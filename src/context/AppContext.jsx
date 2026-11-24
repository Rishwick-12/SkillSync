import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

import { roles } from '../data/roles';
import { companies } from '../data/companies';
import { skillsCatalog } from '../data/skills';
import { initialNotifications } from '../data/notifications';
import { generateRoadmap } from '../utils/roadmap';
import { categorizeSkills } from '../utils/matching';

const AppContext = createContext(null);

const DEFAULT_STARTER_SKILLS = [
  { id: 'react', skillId: 'react', name: 'React', category: 'Web Development', proficiency: 'Intermediate' },
  { id: 'javascript', skillId: 'javascript', name: 'JavaScript', category: 'Web Development', proficiency: 'Advanced' },
  { id: 'html', skillId: 'html', name: 'HTML', category: 'Web Development', proficiency: 'Advanced' },
  { id: 'css', skillId: 'css', name: 'CSS', category: 'Web Development', proficiency: 'Intermediate' },
  { id: 'nodejs', skillId: 'nodejs', name: 'Node.js', category: 'Web Development', proficiency: 'Beginner' },
  { id: 'sql', skillId: 'sql', name: 'SQL', category: 'Databases', proficiency: 'Intermediate' },
  { id: 'python', skillId: 'python', name: 'Python', category: 'Programming Languages', proficiency: 'Intermediate' },
];

export function AppProvider({ children }) {
  const { currentUser } = useAuth();

  // --------------------------------------------------
  // THEME
  // --------------------------------------------------

  const [theme, setTheme] = useState(
    () => localStorage.getItem('skillsync_theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('skillsync_theme', theme);
  }, [theme]);

  const toggleTheme = (forcedTheme) => {
    setTheme((previous) =>
      forcedTheme || (previous === 'light' ? 'dark' : 'light')
    );
  };

  // --------------------------------------------------
  // APPLICATION STATE
  // --------------------------------------------------

  const [user, setUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedCompanies, setSavedCompanies] = useState([]);
  const [savedRoles, setSavedRoles] = useState([]);
  const [savedRoadmaps, setSavedRoadmaps] = useState({});
  const [roadmapProgress, setRoadmapProgress] = useState({});
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Maps frontend roadmap ID to its database UUID when using Supabase
  const [roadmapDatabaseIds, setRoadmapDatabaseIds] = useState({});

  // --------------------------------------------------
  // LOAD AUTHENTICATED USER DATA
  // --------------------------------------------------

  useEffect(() => {
    let active = true;

    const loadUserData = async () => {
      if (!currentUser) {
        setUser(null);
        setUserSkills([]);
        setNotifications([]);
        setSavedCompanies([]);
        setSavedRoles([]);
        setSavedRoadmaps({});
        setRoadmapProgress({});
        setRecentlyViewed([]);
        setRoadmapDatabaseIds({});
        setDataLoading(false);
        return;
      }

      setDataLoading(true);
      setUser(currentUser);

      // 1. Try loading from Supabase if configured
      if (isSupabaseConfigured) {
        try {
          const userId = currentUser.id;

          const results = await Promise.all([
            supabase
              .from('user_skills')
              .select('id, skill_id, proficiency, skills(id, name, category)')
              .eq('user_id', userId),

            supabase
              .from('user_notifications')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false }),

            supabase
              .from('user_bookmarks')
              .select('company_id, role_id')
              .eq('user_id', userId),

            supabase
              .from('user_roadmaps')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false }),

            supabase
              .from('recently_viewed')
              .select('*')
              .eq('user_id', userId)
              .order('viewed_at', { ascending: false })
              .limit(8),
          ]);

          if (!active) return;

          const [
            skillsResult,
            notificationsResult,
            bookmarksResult,
            roadmapsResult,
            recentlyViewedResult,
          ] = results;

          if (!skillsResult.error) {
            setUserSkills(
              (skillsResult.data || [])
                .filter((row) => row.skills)
                .map((row) => ({
                  id: row.skill_id,
                  skillId: row.skill_id,
                  name: row.skills.name,
                  category: row.skills.category,
                  proficiency: row.proficiency,
                }))
            );
          }

          if (!notificationsResult.error) {
            setNotifications(
              (notificationsResult.data || []).map((row) => ({
                id: row.id,
                title: row.title,
                message: row.message,
                type: row.metadata?.originalType || row.type,
                icon: row.icon || 'Bell',
                link: row.link || null,
                read: row.is_read,
                timestamp: row.created_at,
              }))
            );
          }

          if (!bookmarksResult.error) {
            setSavedCompanies(
              (bookmarksResult.data || [])
                .filter((row) => row.company_id)
                .map((row) => row.company_id)
            );
            setSavedRoles(
              (bookmarksResult.data || [])
                .filter((row) => row.role_id)
                .map((row) => row.role_id)
            );
          }

          if (!roadmapsResult.error) {
            const roadmapMap = {};
            const progressMap = {};
            const databaseIdMap = {};

            (roadmapsResult.data || []).forEach((row) => {
              const roadmap = row.roadmap_data;
              if (!roadmap) return;
              const frontendId = roadmap.id || row.id;

              roadmapMap[frontendId] = {
                ...roadmap,
                id: frontendId,
              };

              progressMap[frontendId] = {
                completedTasks: row.completed_tasks || [],
                targetDate: row.target_date || null,
              };

              databaseIdMap[frontendId] = row.id;
            });

            setSavedRoadmaps(roadmapMap);
            setRoadmapProgress(progressMap);
            setRoadmapDatabaseIds(databaseIdMap);
          }

          if (!recentlyViewedResult.error) {
            const viewedItems = (recentlyViewedResult.data || [])
              .map((row) => {
                if (row.company_id) {
                  const company = companies.find((item) => item.id === row.company_id);
                  return company
                    ? {
                        type: 'company',
                        id: company.id,
                        name: company.name,
                        subtitle: `${company.industry || 'Company'} · ${company.location || ''}`,
                      }
                    : null;
                }
                if (row.role_id) {
                  const role = roles.find((item) => item.id === row.role_id);
                  return role
                    ? {
                        type: 'role',
                        id: role.id,
                        name: role.title,
                        subtitle: `${role.category || 'Career'} · ${role.level || ''}`,
                      }
                    : null;
                }
                return null;
              })
              .filter(Boolean);

            setRecentlyViewed(viewedItems);
          }

          setDataLoading(false);
          return;
        } catch (error) {
          console.warn('Could not load data from Supabase, falling back to localStorage:', error);
        }
      }

      // 2. Fallback to localStorage data
      try {
        const storedSkills = localStorage.getItem('skillsync_user_skills');
        if (storedSkills) {
          setUserSkills(JSON.parse(storedSkills));
        } else {
          setUserSkills(DEFAULT_STARTER_SKILLS);
          localStorage.setItem('skillsync_user_skills', JSON.stringify(DEFAULT_STARTER_SKILLS));
        }

        const storedNotifs = localStorage.getItem('skillsync_notifications');
        if (storedNotifs) {
          setNotifications(JSON.parse(storedNotifs));
        } else {
          setNotifications(initialNotifications);
          localStorage.setItem('skillsync_notifications', JSON.stringify(initialNotifications));
        }

        const storedCompanies = localStorage.getItem('skillsync_saved_companies');
        setSavedCompanies(storedCompanies ? JSON.parse(storedCompanies) : ['google', 'microsoft']);

        const storedRoles = localStorage.getItem('skillsync_saved_roles');
        setSavedRoles(storedRoles ? JSON.parse(storedRoles) : ['frontend-dev']);

        const storedRoadmaps = localStorage.getItem('skillsync_saved_roadmaps');
        setSavedRoadmaps(storedRoadmaps ? JSON.parse(storedRoadmaps) : {});

        const storedProgress = localStorage.getItem('skillsync_roadmap_progress');
        setRoadmapProgress(storedProgress ? JSON.parse(storedProgress) : {});

        const storedRecent = localStorage.getItem('skillsync_recently_viewed');
        setRecentlyViewed(storedRecent ? JSON.parse(storedRecent) : [
          {
            type: 'company',
            id: 'google',
            name: 'Google',
            subtitle: 'Technology · Global / Remote',
          },
          {
            type: 'role',
            id: 'frontend-dev',
            name: 'Frontend Developer',
            subtitle: 'Engineering · Mid-Level',
          },
        ]);
      } catch (err) {
        console.error('Error loading fallback data:', err);
      } finally {
        if (active) setDataLoading(false);
      }
    };

    loadUserData();

    return () => {
      active = false;
    };
  }, [currentUser?.id]);

  // --------------------------------------------------
  // USER PROFILE
  // --------------------------------------------------

  const updateUser = (fields) => {
    setUser((previous) => ({
      ...(previous || {}),
      ...fields,
    }));
  };

  // --------------------------------------------------
  // SKILLS
  // --------------------------------------------------

  const addSkill = async (skill) => {
    if (!currentUser) return;

    const skillId =
      skill.skillId ||
      skill.id ||
      skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const matchedCatalogSkill = skillsCatalog.find(
      (s) => s.id === skillId || s.name.toLowerCase() === skill.name.toLowerCase()
    );

    const skillName = matchedCatalogSkill?.name || skill.name;
    const skillCategory = matchedCatalogSkill?.category || skill.category || 'General';
    const proficiency = skill.proficiency || 'Beginner';

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_skills')
          .upsert(
            {
              user_id: currentUser.id,
              skill_id: skillId,
              proficiency,
            },
            { onConflict: 'user_id,skill_id' }
          );
      } catch (err) {
        console.warn('Could not sync skill with Supabase:', err);
      }
    }

    setUserSkills((previous) => {
      const existing = previous.find((item) => item.id === skillId || item.skillId === skillId);
      const updatedSkill = {
        id: skillId,
        skillId,
        name: skillName,
        category: skillCategory,
        proficiency,
      };

      const updatedList = existing
        ? previous.map((item) => (item.id === skillId || item.skillId === skillId ? updatedSkill : item))
        : [...previous, updatedSkill];

      localStorage.setItem('skillsync_user_skills', JSON.stringify(updatedList));
      return updatedList;
    });

    await addNotification({
      title: 'Skill Added',
      message: `Added "${skillName}" (${proficiency}) to your skill profile. Your match scores have updated!`,
      type: 'match',
      icon: 'Sparkles',
      link: '/matches',
    });
  };

  const removeSkill = async (skillId) => {
    if (!currentUser) return;

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_skills')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('skill_id', skillId);
      } catch (err) {
        console.warn('Could not delete skill from Supabase:', err);
      }
    }

    setUserSkills((previous) => {
      const filtered = previous.filter(
        (skill) => skill.id !== skillId && skill.skillId !== skillId
      );
      localStorage.setItem('skillsync_user_skills', JSON.stringify(filtered));
      return filtered;
    });
  };

  const updateSkillProficiency = async (skillId, newProficiency) => {
    if (!currentUser) return;

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_skills')
          .update({ proficiency: newProficiency })
          .eq('user_id', currentUser.id)
          .eq('skill_id', skillId);
      } catch (err) {
        console.warn('Could not update proficiency in Supabase:', err);
      }
    }

    setUserSkills((previous) => {
      const updated = previous.map((skill) =>
        skill.id === skillId || skill.skillId === skillId
          ? { ...skill, proficiency: newProficiency }
          : skill
      );
      localStorage.setItem('skillsync_user_skills', JSON.stringify(updated));
      return updated;
    });
  };

  // --------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------

  const addNotification = async (notif) => {
    if (!currentUser) return;

    const newNotification = {
      id: 'notif-' + Date.now(),
      title: notif.title,
      message: notif.message,
      type: notif.type || 'info',
      icon: notif.icon || 'Bell',
      link: notif.link || null,
      read: false,
      timestamp: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_notifications')
          .insert({
            user_id: currentUser.id,
            title: notif.title,
            message: notif.message,
            type: ['info', 'success', 'warning', 'error'].includes(notif.type) ? notif.type : 'info',
            icon: notif.icon || 'Bell',
            link: notif.link || null,
            metadata: { originalType: notif.type || 'info' },
          });
      } catch (err) {
        console.warn('Could not insert notification into Supabase:', err);
      }
    }

    setNotifications((previous) => {
      const updated = [newNotification, ...previous];
      localStorage.setItem('skillsync_notifications', JSON.stringify(updated));
      return updated;
    });

    return newNotification;
  };

  const markNotificationRead = async (id) => {
    if (!currentUser) return;

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_notifications')
          .update({ is_read: true })
          .eq('user_id', currentUser.id)
          .eq('id', id);
      } catch (err) {
        console.warn('Could not update notification in Supabase:', err);
      }
    }

    setNotifications((previous) => {
      const updated = previous.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      localStorage.setItem('skillsync_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_notifications')
          .update({ is_read: true })
          .eq('user_id', currentUser.id)
          .eq('is_read', false);
      } catch (err) {
        console.warn('Could not update notifications in Supabase:', err);
      }
    }

    setNotifications((previous) => {
      const updated = previous.map((notification) => ({
        ...notification,
        read: true,
      }));
      localStorage.setItem('skillsync_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const dismissNotification = async (id) => {
    if (!currentUser) return;

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_notifications')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('id', id);
      } catch (err) {
        console.warn('Could not delete notification from Supabase:', err);
      }
    }

    setNotifications((previous) => {
      const updated = previous.filter((notification) => notification.id !== id);
      localStorage.setItem('skillsync_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  // --------------------------------------------------
  // SAVED COMPANIES AND ROLES
  // --------------------------------------------------

  const toggleBookmark = async (field, value) => {
    if (!currentUser) return;

    const filterField = field === 'company' ? 'company_id' : 'role_id';

    if (isSupabaseConfigured) {
      try {
        const { data: existing } = await supabase
          .from('user_bookmarks')
          .select('user_id')
          .eq('user_id', currentUser.id)
          .eq(filterField, value)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('user_bookmarks')
            .delete()
            .eq('user_id', currentUser.id)
            .eq(filterField, value);
        } else {
          await supabase
            .from('user_bookmarks')
            .insert({
              user_id: currentUser.id,
              [filterField]: value,
            });
        }
      } catch (err) {
        console.warn('Could not toggle bookmark in Supabase:', err);
      }
    }

    if (field === 'company') {
      setSavedCompanies((previous) => {
        const updated = previous.includes(value)
          ? previous.filter((id) => id !== value)
          : [...previous, value];
        localStorage.setItem('skillsync_saved_companies', JSON.stringify(updated));
        return updated;
      });
    } else {
      setSavedRoles((previous) => {
        const updated = previous.includes(value)
          ? previous.filter((id) => id !== value)
          : [...previous, value];
        localStorage.setItem('skillsync_saved_roles', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const toggleSaveCompany = (companyId) => toggleBookmark('company', companyId);
  const toggleSaveRole = (roleId) => toggleBookmark('role', roleId);

  // --------------------------------------------------
  // ROADMAPS
  // --------------------------------------------------

  const saveRoadmap = async (roadmap) => {
    if (!currentUser) return;

    const roleId = roadmap.roleId || roadmap.role?.id;
    const companyId = roadmap.companyId || roadmap.company?.id || null;

    if (!roleId) {
      throw new Error('This roadmap is missing its role ID.');
    }

    const frontendId = roadmap.id || `roadmap-${Date.now()}`;
    const savedRoadmap = {
      ...roadmap,
      id: frontendId,
    };

    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from('user_roadmaps')
          .insert({
            user_id: currentUser.id,
            role_id: roleId,
            company_id: companyId,
            progress: 0,
            completed_tasks: [],
            roadmap_data: roadmap,
          })
          .select()
          .single();

        if (data?.id) {
          setRoadmapDatabaseIds((previous) => ({
            ...previous,
            [frontendId]: data.id,
          }));
        }
      } catch (err) {
        console.warn('Could not save roadmap to Supabase:', err);
      }
    }

    setSavedRoadmaps((previous) => {
      const updated = {
        ...previous,
        [frontendId]: savedRoadmap,
      };
      localStorage.setItem('skillsync_saved_roadmaps', JSON.stringify(updated));
      return updated;
    });

    setRoadmapProgress((previous) => {
      const updated = {
        ...previous,
        [frontendId]: {
          completedTasks: [],
          targetDate: null,
        },
      };
      localStorage.setItem('skillsync_roadmap_progress', JSON.stringify(updated));
      return updated;
    });

    await addNotification({
      title: 'Roadmap Generated',
      message: `Personalized learning roadmap for ${roadmap.roleTitle || 'your selected role'} has been saved to My Roadmaps!`,
      type: 'roadmap',
      icon: 'Map',
      link: `/roadmaps/${frontendId}`,
    });
  };

  const deleteRoadmap = async (roadmapId) => {
    if (!currentUser) return;

    if (isSupabaseConfigured && roadmapDatabaseIds[roadmapId]) {
      try {
        await supabase
          .from('user_roadmaps')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('id', roadmapDatabaseIds[roadmapId]);
      } catch (err) {
        console.warn('Could not delete roadmap from Supabase:', err);
      }
    }

    setSavedRoadmaps((previous) => {
      const copy = { ...previous };
      delete copy[roadmapId];
      localStorage.setItem('skillsync_saved_roadmaps', JSON.stringify(copy));
      return copy;
    });

    setRoadmapProgress((previous) => {
      const copy = { ...previous };
      delete copy[roadmapId];
      localStorage.setItem('skillsync_roadmap_progress', JSON.stringify(copy));
      return copy;
    });
  };

  const toggleRoadmapTask = async (roadmapId, taskId) => {
    const current = roadmapProgress[roadmapId] || {
      completedTasks: [],
      targetDate: null,
    };

    const taskSet = new Set(current.completedTasks || []);
    if (taskSet.has(taskId)) {
      taskSet.delete(taskId);
    } else {
      taskSet.add(taskId);
    }

    const updated = {
      ...current,
      completedTasks: Array.from(taskSet),
    };

    setRoadmapProgress((previous) => {
      const allUpdated = {
        ...previous,
        [roadmapId]: updated,
      };
      localStorage.setItem('skillsync_roadmap_progress', JSON.stringify(allUpdated));
      return allUpdated;
    });
  };

  const setRoadmapTargetDate = async (roadmapId, date) => {
    const current = roadmapProgress[roadmapId] || {
      completedTasks: [],
      targetDate: null,
    };

    const updated = {
      ...current,
      targetDate: date,
    };

    setRoadmapProgress((previous) => {
      const allUpdated = {
        ...previous,
        [roadmapId]: updated,
      };
      localStorage.setItem('skillsync_roadmap_progress', JSON.stringify(allUpdated));
      return allUpdated;
    });
  };

  // --------------------------------------------------
  // RECENTLY VIEWED
  // --------------------------------------------------

  const addToRecentlyViewed = async (item) => {
    if (!currentUser) return;

    setRecentlyViewed((previous) => {
      const filtered = previous.filter(
        (entry) => !(entry.type === item.type && entry.id === item.id)
      );
      const updated = [item, ...filtered].slice(0, 8);
      localStorage.setItem('skillsync_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  // --------------------------------------------------
  // ROADMAP GENERATION HELPER
  // --------------------------------------------------

  const generateAndSaveRoadmap = async (role, missing, improve, company) => {
    const roadmap = generateRoadmap(role, missing, improve, company);
    await saveRoadmap(roadmap);
    return roadmap;
  };

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,

        user,
        updateUser,

        userSkills,
        addSkill,
        removeSkill,
        updateSkillProficiency,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
        addNotification,

        savedCompanies,
        toggleSaveCompany,

        savedRoles,
        toggleSaveRole,

        savedRoadmaps,
        saveRoadmap,
        deleteRoadmap,

        roadmapProgress,
        toggleRoadmapTask,
        setRoadmapTargetDate,

        recentlyViewed,
        addToRecentlyViewed,

        dataLoading,

        generateAndSaveRoadmap,
        categorizeSkills,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
}
