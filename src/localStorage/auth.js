// Simple localStorage-based authentication
// Note: This is not secure for production use

const USERS_KEY = 'expense_tracker_users';
const CURRENT_USER_KEY = 'expense_tracker_current_user';

// Get all users from localStorage
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Generate a simple user ID
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Sign up with email and password
export const signUpWithEmail = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getUsers();
        
        // Check if user already exists
        if (users.find(user => user.email === email)) {
          reject(new Error('User already exists'));
          return;
        }

        // Create new user
        const newUser = {
          id: generateUserId(),
          email,
          password, // In production, this should be hashed
          displayName: email.split('@')[0], // Use email prefix as display name
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        // Set as current user
        setCurrentUser(newUser);

        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulate network delay
  });
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
          reject(new Error('Invalid email or password'));
          return;
        }

        // Set as current user
        setCurrentUser(user);

        resolve(user);
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulate network delay
  });
};

// Sign in with Google (mock implementation)
export const signInWithGoogle = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Mock Google user
        const googleUser = {
          id: generateUserId(),
          email: 'user@gmail.com',
          displayName: 'Google User',
          photoURL: null,
          provider: 'google',
          createdAt: new Date().toISOString()
        };

        // Check if user already exists
        const users = getUsers();
        const existingUser = users.find(u => u.email === googleUser.email);
        
        if (existingUser) {
          setCurrentUser(existingUser);
          resolve(existingUser);
        } else {
          users.push(googleUser);
          saveUsers(users);
          setCurrentUser(googleUser);
          resolve(googleUser);
        }
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulate network delay
  });
};

// Reset password
export const resetPassword = async (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
          reject(new Error('User not found'));
          return;
        }

        // In a real app, this would send an email
        // For localStorage, we'll just resolve
        console.log(`Password reset link sent to ${email}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulate network delay
  });
};

// Sign out
export const logout = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem(CURRENT_USER_KEY);
      resolve();
    }, 200);
  });
};

// Get current user
export const getCurrentUser = () => {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  return currentUser ? JSON.parse(currentUser) : null;
};

// Set current user
const setCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};
