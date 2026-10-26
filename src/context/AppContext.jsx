import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialNotifications } from '../data/notifications';
import { roles } from '../data/roles';
import { companies } from '../data/companies';
import { generateRoadmap } from '../utils/roadmap';
import { categorizeSkills } from '../utils/matching';

const AppContext = createContext(null);

const DEFAULT_USER_SKILLS = [
  { id: 'javascript', skillId: 'javascript', name: 'JavaScript', category: 'Web Development', proficiency: 'Advanced' },
  { id: 'react', skillId: 'react', name: 'React', category: 'Web Development', proficiency: 'Intermediate' },
  { id: 'html', skillId: 'html', name: 'HTML', category: 'Web Development', proficiency: 'Advanced' },
  { id: 'css', skillId: 'css', name: 'CSS', category: 'Web Development', proficiency: 'Advanced' },
  { id: 'git', skillId: 'git', name: 'Git', category: 'Tools & Version Control', proficiency: 'Intermediate' },
  { id: 'sql', skillId: 'sql', name: 'SQL', category: 'Databases', proficiency: 'Intermediate' },
  { id: 'python', skillId: 'python', name: 'Python', category: 'Programming Languages', proficiency: 'Beginner' },
  { id: 'dsa', skillId: 'data-structures', name: 'Data Structures and Algorithms', category: 'DSA & CS Fundamentals', proficiency: 'Beginner' },
];

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('skillsync_theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('skillsync_theme', theme);
  }, [theme]);

  const toggleTheme = (forcedTheme) => {
    if (forcedTheme) {
      setTheme(forcedTheme);
    } else {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }
  };

  // User Profile State
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_user_profile');
      return stored
        ? JSON.parse(stored)
        : {
            name: 'Alex Johnson',
            email: 'demo@skillsync.app',
            headline: 'Aspiring Full Stack Engineer & Computer Science Student',
            education: 'B.Tech in Computer Science and Engineering',
            experience: 'Fresher (0-1 yrs)',
            bio: 'Passionate about frontend architecture, responsive design, and algorithms. Currently expanding my stack towards Full Stack and Cloud engineering.',
            location: 'Bengaluru, Karnataka, India',
            linkedin: 'https://linkedin.com/in/alexjohnson-demo',
            github: 'https://github.com/alexjohnson-demo',
            careerInterests: ['Frontend Development', 'Full Stack Development', 'Cloud Computing', 'AI Integration'],
            targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Flipkart'],
            targetRoles: ['Frontend Developer', 'Full Stack Developer', 'Software Engineer'],
          };
    } catch {
      return {};
    }
  });

  const updateUser = (fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem('skillsync_user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  // Skills State
  const [userSkills, setUserSkills] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_user_skills');
      return stored ? JSON.parse(stored) : DEFAULT_USER_SKILLS;
    } catch {
      return DEFAULT_USER_SKILLS;
    }
  });

  useEffect(() => {
    localStorage.setItem('skillsync_user_skills', JSON.stringify(userSkills));
  }, [userSkills]);

  const addSkill = (skill) => {
    setUserSkills((prev) => {
      const existsIndex = prev.findIndex(
        (s) =>
          (s.skillId && s.skillId.toLowerCase() === (skill.skillId || skill.id || '').toLowerCase()) ||
          s.name.toLowerCase() === skill.name.toLowerCase()
      );
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = { ...copy[existsIndex], ...skill };
        return copy;
      }
      const newSkill = {
        id: skill.id || skill.skillId || `skill-${Date.now()}`,
        skillId: skill.skillId || skill.id || skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: skill.name,
        category: skill.category || 'General',
        proficiency: skill.proficiency || 'Beginner',
      };
      return [...prev, newSkill];
    });

    // Add automatic notification
    addNotification({
      title: 'Skill Added',
      message: `Added "${skill.name}" (${skill.proficiency || 'Beginner'}) to your skill profile. Your match scores have updated!`,
      type: 'match',
      icon: 'Sparkles',
      link: '/matches',
    });
  };

  const removeSkill = (skillId) => {
    setUserSkills((prev) => prev.filter((s) => s.id !== skillId && s.skillId !== skillId));
  };

  const updateSkillProficiency = (skillId, newProficiency) => {
    setUserSkills((prev) =>
      prev.map((s) => (s.id === skillId || s.skillId === skillId ? { ...s, proficiency: newProficiency } : s))
    );
  };

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_notifications');
      return stored ? JSON.parse(stored) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  useEffect(() => {
    localStorage.setItem('skillsync_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Saved Companies State
  const [savedCompanies, setSavedCompanies] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_saved_companies');
      return stored ? JSON.parse(stored) : ['google', 'microsoft'];
    } catch {
      return ['google', 'microsoft'];
    }
  });

  useEffect(() => {
    localStorage.setItem('skillsync_saved_companies', JSON.stringify(savedCompanies));
  }, [savedCompanies]);

  const toggleSaveCompany = (companyId) => {
    setSavedCompanies((prev) => {
      const exists = prev.includes(companyId);
      const updated = exists ? prev.filter((id) => id !== companyId) : [...prev, companyId];
      return updated;
    });
  };

  // Saved Roles State
  const [savedRoles, setSavedRoles] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_saved_roles');
      return stored ? JSON.parse(stored) : ['frontend-dev', 'full-stack-dev'];
    } catch {
      return ['frontend-dev', 'full-stack-dev'];
    }
  });

  useEffect(() => {
    localStorage.setItem('skillsync_saved_roles', JSON.stringify(savedRoles));
  }, [savedRoles]);

  const toggleSaveRole = (roleId) => {
    setSavedRoles((prev) => {
      const exists = prev.includes(roleId);
      return exists ? prev.filter((id) => id !== roleId) : [...prev, roleId];
    });
  };

  // Saved Roadmaps State
  const [savedRoadmaps, setSavedRoadmaps] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_saved_roadmaps');
      if (stored) return JSON.parse(stored);

      // Generate a default starter roadmap for Frontend Dev
      const feRole = roles.find((r) => r.id === 'frontend-dev');
      const google = companies.find((c) => c.id === 'google');
      if (feRole) {
        const { missing, improve } = categorizeSkills(DEFAULT_USER_SKILLS, feRole);
        const rm = generateRoadmap(feRole, missing, improve, google);
        return { [rm.id]: rm };
      }
      return {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('skillsync_saved_roadmaps', JSON.stringify(savedRoadmaps));
  }, [savedRoadmaps]);

  // Roadmap Progress State { [roadmapId]: { completedTasks: string[], targetDate: string } }
  const [roadmapProgress, setRoadmapProgress] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_roadmap_progress');
      if (stored) return JSON.parse(stored);
      return {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('skillsync_roadmap_progress', JSON.stringify(roadmapProgress));
  }, [roadmapProgress]);

  const saveRoadmap = (roadmap) => {
    setSavedRoadmaps((prev) => ({
      ...prev,
      [roadmap.id]: roadmap,
    }));
    addNotification({
      title: 'Roadmap Generated',
      message: `Personalized learning roadmap for ${roadmap.roleTitle} has been saved to My Roadmaps!`,
      type: 'roadmap',
      icon: 'Map',
      link: `/roadmaps/${roadmap.id}`,
    });
  };

  const deleteRoadmap = (roadmapId) => {
    setSavedRoadmaps((prev) => {
      const copy = { ...prev };
      delete copy[roadmapId];
      return copy;
    });
    setRoadmapProgress((prev) => {
      const copy = { ...prev };
      delete copy[roadmapId];
      return copy;
    });
  };

  const toggleRoadmapTask = (roadmapId, taskId) => {
    setRoadmapProgress((prev) => {
      const current = prev[roadmapId] || { completedTasks: [], targetDate: null };
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
      return {
        ...prev,
        [roadmapId]: updated,
      };
    });
  };

  const setRoadmapTargetDate = (roadmapId, date) => {
    setRoadmapProgress((prev) => {
      const current = prev[roadmapId] || { completedTasks: [], targetDate: null };
      return {
        ...prev,
        [roadmapId]: { ...current, targetDate: date },
      };
    });
  };

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_recently_viewed');
      return stored
        ? JSON.parse(stored)
        : [
            { type: 'company', id: 'google', name: 'Google', subtitle: 'Technology · Mountain View, CA' },
            { type: 'role', id: 'frontend-dev', name: 'Frontend Developer', subtitle: 'Web Development · Mid Level' },
            { type: 'company', id: 'microsoft', name: 'Microsoft', subtitle: 'Technology · Redmond, WA' },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('skillsync_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (item) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => !(i.type === item.type && i.id === item.id));
      return [item, ...filtered].slice(0, 8);
    });
  };

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
