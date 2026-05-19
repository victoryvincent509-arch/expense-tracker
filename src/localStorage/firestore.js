// localStorage-based data management for expenses and budgets

const STORAGE_KEYS = {
  EXPENSES: 'expense_tracker_expenses',
  BUDGETS: 'expense_tracker_budgets',
};

// Helper to get data from localStorage
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

// Helper to save data to localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Generate unique ID
const generateId = () => {
  return `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Add expense
export const addExpense = async (expenseData) => {
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES);
  const newExpense = {
    id: generateId(),
    ...expenseData,
    date: new Date(expenseData.date).toISOString(),
    createdAt: new Date().toISOString(),
  };
  expenses.push(newExpense);
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  return newExpense.id;
};

// Get user expenses with filters
export const getUserExpenses = async (userId, filters = {}) => {
  let expenses = getFromStorage(STORAGE_KEYS.EXPENSES);

  // Filter by user
  expenses = expenses.filter(expense => expense.userId === userId);

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    expenses = expenses.filter(expense => expense.category === filters.category);
  }

  // Apply date filters
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    expenses = expenses.filter(expense => new Date(expense.date) >= startDate);
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    expenses = expenses.filter(expense => new Date(expense.date) <= endDate);
  }

  // Sort by createdAt timestamp (newest first), then by date
  expenses.sort((a, b) => {
    // First sort by date (newest first)
    const dateComparison = new Date(b.date) - new Date(a.date);
    if (dateComparison !== 0) return dateComparison;

    // If same date, sort by creation time (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  // Convert ISO strings back to Date objects
  return expenses.map(expense => ({
    ...expense,
    date: new Date(expense.date),
    createdAt: new Date(expense.createdAt)
  }));
};

// Real-time listener simulation for user expenses
export const subscribeToExpenses = (userId, callback, filters = {}) => {
  console.log('subscribeToExpenses called with userId:', userId);

  // Initial load
  getUserExpenses(userId, filters).then(expenses => {
    console.log('Initial expenses loaded:', expenses);
    callback(expenses);
  }).catch(error => {
    console.error('Error loading expenses:', error);
    callback([]);
  });

  // Poll for changes every 2 seconds
  const intervalId = setInterval(() => {
    getUserExpenses(userId, filters).then(expenses => {
      console.log('Polling - expenses:', expenses.length);
      callback(expenses);
    }).catch(error => {
      console.error('Error polling expenses:', error);
    });
  }, 2000);

  // Return unsubscribe function
  return () => {
    console.log('Unsubscribing from expenses');
    clearInterval(intervalId);
  };
};

// Delete expense
export const deleteExpense = async (expenseId) => {
  let expenses = getFromStorage(STORAGE_KEYS.EXPENSES);
  expenses = expenses.filter(expense => expense.id !== expenseId);
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
};

// Update expense
export const updateExpense = async (expenseId, updateData) => {
  let expenses = getFromStorage(STORAGE_KEYS.EXPENSES);
  const index = expenses.findIndex(expense => expense.id === expenseId);

  if (index !== -1) {
    expenses[index] = {
      ...expenses[index],
      ...updateData,
      date: new Date(updateData.date).toISOString(),
    };
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  }
};

// Set budget
export const setBudget = async (budgetData) => {
  let budgets = getFromStorage(STORAGE_KEYS.BUDGETS);
  const budgetId = `${budgetData.userId}_${budgetData.category}_${budgetData.month}`;

  // Remove existing budget for this category/month if it exists
  budgets = budgets.filter(b => b.id !== budgetId);

  const newBudget = {
    id: budgetId,
    ...budgetData,
    createdAt: new Date().toISOString(),
  };

  budgets.push(newBudget);
  saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
};

// Get user budgets
export const getUserBudgets = async (userId, month) => {
  let budgets = getFromStorage(STORAGE_KEYS.BUDGETS);
  return budgets.filter(budget =>
    budget.userId === userId && budget.month === month
  );
};

// Get spending stats
export const getSpendingStats = async (userId, period) => {
  const now = new Date();
  let startDate, endDate;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
      endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    default:
      return 0;
  }

  const expenses = await getUserExpenses(userId, { startDate, endDate });
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};