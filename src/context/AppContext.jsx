
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

import { roles } from '../data/roles';
import { companies } from '../data/companies';
import { generateRoadmap } from '../utils/roadmap';
import { categorizeSkills } from '../utils/matching';

const AppContext = createContext(null);

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

  // Maps the frontend roadmap ID to its database UUID.
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

        // Skills
        if (skillsResult.error) throw skillsResult.error;

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

        // Notifications
        if (notificationsResult.error) throw notificationsResult.error;

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

        // Bookmarks
        if (bookmarksResult.error) throw bookmarksResult.error;

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

        // Roadmaps
        if (roadmapsResult.error) throw roadmapsResult.error;

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

        // Recently viewed
        if (recentlyViewedResult.error) throw recentlyViewedResult.error;

        const viewedItems = (recentlyViewedResult.data || [])
          .map((row) => {
            if (row.company_id) {
              const company = companies.find(
                (item) => item.id === row.company_id
              );

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
              const role = roles.find(
                (item) => item.id === row.role_id
              );

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
      } catch (error) {
        console.error('Error loading user application data:', error);
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

    const { data: existingSkill, error: lookupError } = await supabase
      .from('skills')
      .select('id, name, category')
      .eq('id', skillId)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (!existingSkill) {
      throw new Error(
        `The skill "${skill.name}" was not found in the skills database.`
      );
    }

    const proficiency = skill.proficiency || 'Beginner';

    const { error } = await supabase
      .from('user_skills')
      .upsert(
        {
          user_id: currentUser.id,
          skill_id: skillId,
          proficiency,
        },
        { onConflict: 'user_id,skill_id' }
      );

    if (error) throw error;

    setUserSkills((previous) => {
      const existing = previous.find((item) => item.id === skillId);

      const updatedSkill = {
        id: skillId,
        skillId,
        name: existingSkill.name,
        category: existingSkill.category,
        proficiency,
      };

      return existing
        ? previous.map((item) =>
            item.id === skillId ? updatedSkill : item
          )
        : [...previous, updatedSkill];
    });

    await addNotification({
      title: 'Skill Added',
      message: `Added "${existingSkill.name}" (${proficiency}) to your skill profile. Your match scores have updated!`,
      type: 'match',
      icon: 'Sparkles',
      link: '/matches',
    });
  };

  const removeSkill = async (skillId) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('skill_id', skillId);

    if (error) throw error;

    setUserSkills((previous) =>
      previous.filter(
        (skill) => skill.id !== skillId && skill.skillId !== skillId
      )
    );
  };

  const updateSkillProficiency = async (skillId, newProficiency) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('user_skills')
      .update({ proficiency: newProficiency })
      .eq('user_id', currentUser.id)
      .eq('skill_id', skillId);

    if (error) throw error;

    setUserSkills((previous) =>
      previous.map((skill) =>
        skill.id === skillId || skill.skillId === skillId
          ? { ...skill, proficiency: newProficiency }
          : skill
      )
    );
  };

  // --------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------

  const addNotification = async (notif) => {
    if (!currentUser) return;

    const allowedTypes = ['info', 'success', 'warning', 'error'];

    const databaseType = allowedTypes.includes(notif.type)
      ? notif.type
      : 'info';

    const metadata = {
      ...(notif.metadata || {}),
      originalType: notif.type || 'info',
    };

    const { data, error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: currentUser.id,
        title: notif.title,
        message: notif.message,
        type: databaseType,
        icon: notif.icon || 'Bell',
        link: notif.link || null,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;

    const newNotification = {
      id: data.id,
      title: data.title,
      message: data.message,
      type: metadata.originalType,
      icon: data.icon,
      link: data.link,
      read: false,
      timestamp: data.created_at,
    };

    setNotifications((previous) => [
      newNotification,
      ...previous,
    ]);

    return newNotification;
  };

  const markNotificationRead = async (id) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('user_id', currentUser.id)
      .eq('id', id);

    if (error) throw error;

    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('user_id', currentUser.id)
      .eq('is_read', false);

    if (error) throw error;

    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const dismissNotification = async (id) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('user_notifications')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('id', id);

    if (error) throw error;

    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id)
    );
  };

  // --------------------------------------------------
  // SAVED COMPANIES AND ROLES
  // --------------------------------------------------

  const toggleBookmark = async (field, value) => {
    if (!currentUser) return;

    const filterField = field === 'company' ? 'company_id' : 'role_id';

    const { data: existing, error: lookupError } = await supabase
      .from('user_bookmarks')
      .select('user_id')
      .eq('user_id', currentUser.id)
      .eq(filterField, value)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (existing) {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', currentUser.id)
        .eq(filterField, value);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: currentUser.id,
          [filterField]: value,
        });

      if (error) throw error;
    }

    if (field === 'company') {
      setSavedCompanies((previous) =>
        existing
          ? previous.filter((id) => id !== value)
          : [...previous, value]
      );
    } else {
      setSavedRoles((previous) =>
        existing
          ? previous.filter((id) => id !== value)
          : [...previous, value]
      );
    }
  };

  const toggleSaveCompany = (companyId) =>
    toggleBookmark('company', companyId);

  const toggleSaveRole = (roleId) =>
    toggleBookmark('role', roleId);

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

    const { data, error } = await supabase
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

    if (error) throw error;

    const frontendId = roadmap.id || data.id;

    const savedRoadmap = {
      ...roadmap,
      id: frontendId,
    };

    setSavedRoadmaps((previous) => ({
      ...previous,
      [frontendId]: savedRoadmap,
    }));

    setRoadmapDatabaseIds((previous) => ({
      ...previous,
      [frontendId]: data.id,
    }));

    setRoadmapProgress((previous) => ({
      ...previous,
      [frontendId]: {
        completedTasks: [],
        targetDate: null,
      },
    }));

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

    const databaseId = roadmapDatabaseIds[roadmapId];

    if (!databaseId) {
      throw new Error('Could not find this roadmap in your account.');
    }

    const { error } = await supabase
      .from('user_roadmaps')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('id', databaseId);

    if (error) throw error;

    setSavedRoadmaps((previous) => {
      const copy = { ...previous };
      delete copy[roadmapId];
      return copy;
    });

    setRoadmapProgress((previous) => {
      const copy = { ...previous };
      delete copy[roadmapId];
      return copy;
    });

    setRoadmapDatabaseIds((previous) => {
      const copy = { ...previous };
      delete copy[roadmapId];
      return copy;
    });
  };

  const updateRoadmapProgressInDatabase = async (
    roadmapId,
    progressData
  ) => {
    const databaseId = roadmapDatabaseIds[roadmapId];

    if (!currentUser || !databaseId) return;

    const { error } = await supabase
      .from('user_roadmaps')
      .update({
        completed_tasks: progressData.completedTasks || [],
        target_date: progressData.targetDate || null,
      })
      .eq('user_id', currentUser.id)
      .eq('id', databaseId);

    if (error) throw error;
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

    await updateRoadmapProgressInDatabase(roadmapId, updated);

    setRoadmapProgress((previous) => ({
      ...previous,
      [roadmapId]: updated,
    }));
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

    await updateRoadmapProgressInDatabase(roadmapId, updated);

    setRoadmapProgress((previous) => ({
      ...previous,
      [roadmapId]: updated,
    }));
  };

  // --------------------------------------------------
  // RECENTLY VIEWED
  // --------------------------------------------------

  const addToRecentlyViewed = async (item) => {
    if (!currentUser) return;

    const isCompany = item.type === 'company';
    const field = isCompany ? 'company_id' : 'role_id';

    const record = {
      user_id: currentUser.id,
      company_id: isCompany ? item.id : null,
      role_id: isCompany ? null : item.id,
      viewed_at: new Date().toISOString(),
    };

    const { error: deleteError } = await supabase
      .from('recently_viewed')
      .delete()
      .eq('user_id', currentUser.id)
      .eq(field, item.id);

    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase
      .from('recently_viewed')
      .insert(record);

    if (insertError) throw insertError;

    setRecentlyViewed((previous) => {
      const filtered = previous.filter(
        (entry) => !(entry.type === item.type && entry.id === item.id)
      );

      return [item, ...filtered].slice(0, 8);
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
