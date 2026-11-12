
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

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
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          const user = await fetchUserProfile(session.user);

          if (mounted) setCurrentUser(user);
        } else if (mounted) {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Unable to restore session:', error);

        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSession();

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
  }, []);

  const register = async (name, email, password) => {
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
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw error;

    const user = await fetchUserProfile(data.user);
    setCurrentUser(user);

    return user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setCurrentUser(null);
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) {
      throw new Error('You must be logged in to update your profile.');
    }

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

    if (Object.keys(profileUpdates).length === 0) {
      return currentUser;
    }

    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', currentUser.id);

    if (error) throw error;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    const updatedUser = await fetchUserProfile(user);

    setCurrentUser(updatedUser);

    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
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
