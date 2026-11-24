import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: 'demo-user-101',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'user',
  avatar_url: '',
  headline: 'Full Stack Developer & CS Graduate',
  education: 'B.Tech in Computer Science',
  experience: '1 Year Experience / Recent Grad',
  bio: 'Passionate about React, modern web development, and cloud computing. Actively preparing for Software Engineering and Frontend Developer roles.',
  location: 'Bangalore, India',
  linkedin: 'https://linkedin.com',
  github: 'https://github.com',
  careerInterests: ['Frontend Development', 'Full Stack Development', 'Cloud Computing'],
  targetCompanies: ['google', 'microsoft', 'amazon'],
  targetRoles: ['frontend-dev', 'software-eng', 'fullstack-dev'],
};

function formatUser(authUser, profile) {
  return {
    id: authUser.id,
    name:
      profile?.full_name ||
      authUser.user_metadata?.full_name ||
      authUser.email?.split('@')[0] ||
      'User',
    email: authUser.email,
    role: profile?.role || 'user',
    avatar_url: profile?.avatar_url || '',
    headline: profile?.headline || '',
    education: profile?.education || '',
    experience: profile?.experience || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    linkedin: profile?.linkedin || '',
    github: profile?.github || '',
    careerInterests: profile?.career_interests || [],
    targetCompanies: profile?.target_companies || [],
    targetRoles: profile?.target_roles || [],
  };
}

async function fetchUserProfile(authUser) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) throw error;

  return formatUser(authUser, profile);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      // 1. If Supabase is configured, try Supabase session
      if (isSupabaseConfigured) {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) throw error;

          if (session?.user) {
            const user = await fetchUserProfile(session.user);
            if (mounted) {
              setCurrentUser(user);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.warn('Unable to restore Supabase session, checking local storage:', error);
        }
      }

      // 2. Fallback to localStorage session
      try {
        const stored = localStorage.getItem('skillsync_demo_user');
        const hasLoggedOut = localStorage.getItem('skillsync_logged_out');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (mounted) setCurrentUser(parsed);
        } else if (!hasLoggedOut && mounted) {
          const user = { ...DEFAULT_DEMO_USER };
          localStorage.setItem('skillsync_demo_user', JSON.stringify(user));
          setCurrentUser(user);
        } else if (mounted) {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Failed to parse local user session:', err);
        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSession();

    if (isSupabaseConfigured) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          if (mounted) {
            setCurrentUser(null);
            setLoading(false);
          }
          return;
        }

        if (
          event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED' ||
          event === 'PASSWORD_RECOVERY'
        ) {
          Promise.resolve().then(async () => {
            try {
              const user = await fetchUserProfile(session.user);
              if (mounted) setCurrentUser(user);
            } catch (error) {
              console.error('Unable to load user profile:', error);
            } finally {
              if (mounted) setLoading(false);
            }
          });
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      return () => {
        mounted = false;
      };
    }
  }, []);

  const loginDemoUser = () => {
    localStorage.removeItem('skillsync_logged_out');
    const user = { ...DEFAULT_DEMO_USER };
    localStorage.setItem('skillsync_demo_user', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (error) throw error;

        if (!data.session || !data.user) {
          return {
            requiresEmailConfirmation: true,
            email: data.user?.email || email,
          };
        }

        const user = await fetchUserProfile(data.user);
        setCurrentUser(user);

        return {
          requiresEmailConfirmation: false,
          user,
        };
      } catch (err) {
        console.warn('Supabase sign-up failed, falling back to local demo registration:', err);
      }
    }

    // Local fallback registration
    const localUser = {
      id: 'user-' + Date.now(),
      name: name.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
      role: 'user',
      avatar_url: '',
      headline: 'Aspiring Developer',
      education: '',
      experience: '',
      bio: '',
      location: '',
      linkedin: '',
      github: '',
      careerInterests: [],
      targetCompanies: [],
      targetRoles: [],
    };
    localStorage.setItem('skillsync_demo_user', JSON.stringify(localUser));
    setCurrentUser(localUser);
    return {
      requiresEmailConfirmation: false,
      user: localUser,
    };
  };

  const login = async (email, password) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) throw error;

        const user = await fetchUserProfile(data.user);
        setCurrentUser(user);
        return user;
      } catch (err) {
        console.warn('Supabase sign-in failed, checking local credentials:', err);
      }
    }

    // Local fallback login
    localStorage.removeItem('skillsync_logged_out');
    const localUser = {
      ...DEFAULT_DEMO_USER,
      email: email.trim().toLowerCase(),
      name: email.split('@')[0] || 'User',
    };
    localStorage.setItem('skillsync_demo_user', JSON.stringify(localUser));
    setCurrentUser(localUser);
    return localUser;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign-out error:', err);
      }
    }

    localStorage.setItem('skillsync_logged_out', 'true');
    localStorage.removeItem('skillsync_demo_user');
    setCurrentUser(null);
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) {
      throw new Error('You must be logged in to update your profile.');
    }

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
    };

    localStorage.setItem('skillsync_demo_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    if (isSupabaseConfigured) {
      try {
        const profileUpdates = {};
        const fieldMap = {
          name: 'full_name',
          full_name: 'full_name',
          headline: 'headline',
          education: 'education',
          experience: 'experience',
          bio: 'bio',
          location: 'location',
          avatar_url: 'avatar_url',
          linkedin: 'linkedin',
          github: 'github',
          careerInterests: 'career_interests',
          targetCompanies: 'target_companies',
          targetRoles: 'target_roles',
        };

        Object.entries(fieldMap).forEach(([frontendField, databaseField]) => {
          if (updatedFields[frontendField] !== undefined) {
            profileUpdates[databaseField] = updatedFields[frontendField];
          }
        });

        if (Object.keys(profileUpdates).length > 0) {
          await supabase
            .from('profiles')
            .update(profileUpdates)
            .eq('id', currentUser.id);
        }
      } catch (err) {
        console.warn('Could not sync profile to Supabase:', err);
      }
    }

    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        loginDemoUser,
        register,
        logout,
        updateProfile,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
}
