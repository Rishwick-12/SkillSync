import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'usr_demo_01',
  name: 'Alex Johnson',
  email: 'demo@skillsync.app',
  password: 'demo123',
  headline: 'Aspiring Full Stack Engineer & Computer Science Student',
  education: 'B.Tech in Computer Science and Engineering',
  experience: 'Fresher (0-1 yrs)',
  bio: 'Passionate about modern web technologies, building scalable apps with React & Node.js, and mastering DSA patterns.',
  location: 'Bengaluru, India',
  targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Flipkart'],
  targetRoles: ['Frontend Developer', 'Full Stack Developer', 'Software Engineer'],
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = localStorage.getItem('skillsync_session');
      return session ? JSON.parse(session) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Seed users database in localStorage if empty
    try {
      const usersRaw = localStorage.getItem('skillsync_users');
      if (!usersRaw) {
        localStorage.setItem('skillsync_users', JSON.stringify([DEMO_USER]));
      }
      if (!localStorage.getItem('skillsync_session')) {
        localStorage.setItem('skillsync_session', JSON.stringify(DEMO_USER));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('skillsync_users') || '[]');
          const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

          // For demo convenience, allow demo credentials or user credentials
          if (email.toLowerCase() === 'demo@skillsync.app') {
            const demoSession = { ...DEMO_USER };
            localStorage.setItem('skillsync_session', JSON.stringify(demoSession));
            setCurrentUser(demoSession);
            return resolve(demoSession);
          }

          if (!user) {
            return reject(new Error('No account found with this email address. Please register.'));
          }

          if (user.password !== password) {
            return reject(new Error('Incorrect password. Please try again.'));
          }

          const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            headline: user.headline || 'Software Developer',
            education: user.education || 'Computer Science',
            experience: user.experience || 'Entry Level',
          };
          localStorage.setItem('skillsync_session', JSON.stringify(sessionUser));
          setCurrentUser(sessionUser);
          resolve(sessionUser);
        } catch (err) {
          reject(err);
        }
      }, 400);
    });
  };

  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('skillsync_users') || '[]');
          if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
            return reject(new Error('An account with this email already exists.'));
          }

          const newUser = {
            id: `usr_${Date.now()}`,
            name,
            email,
            password,
            headline: 'Aspiring Software Professional',
            education: 'Computer Science & Engineering',
            experience: 'Fresher (0-1 yrs)',
          };

          users.push(newUser);
          localStorage.setItem('skillsync_users', JSON.stringify(users));

          const sessionUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            headline: newUser.headline,
            education: newUser.education,
            experience: newUser.experience,
          };
          localStorage.setItem('skillsync_session', JSON.stringify(sessionUser));
          setCurrentUser(sessionUser);
          resolve(sessionUser);
        } catch (err) {
          reject(err);
        }
      }, 400);
    });
  };

  const logout = () => {
    localStorage.removeItem('skillsync_session');
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    localStorage.setItem('skillsync_session', JSON.stringify(updated));

    try {
      const users = JSON.parse(localStorage.getItem('skillsync_users') || '[]');
      const index = users.findIndex((u) => u.id === currentUser.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedFields };
        localStorage.setItem('skillsync_users', JSON.stringify(users));
      }
    } catch (e) {
      console.error(e);
    }
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
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
