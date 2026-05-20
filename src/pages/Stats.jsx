import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUserExpenses, getUserBudgets, setBudget, getSpendingStats } from '../localStorage/firestore';
import { CATEGORIES, CATEGORY_COLORS, CHART_TYPES, getCategoryColor } from '../utils/constants';
import { formatCurrency, calculatePercentage, getBudgetFeedback } from '../utils/currencyUtils';
import { getCurrentMonth, getDaysElapsedInMonth } from '../utils/dateUtils';

const Stats = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState(CHART_TYPES.PIE);
  const [chartPeriod, setChartPeriod] = useState('thisWeek');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    category: CATEGORIES[0],
    amount: ''
  });

  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0
  });

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {

    try {
      setLoading(true);

      // Fetch expenses
      const expensesData = await getUserExpenses('default-user');
      setExpenses(expensesData);

      // Fetch budgets
      const currentMonth = getCurrentMonth();
      const budgetsData = await getUserBudgets('default-user', currentMonth);
      setBudgets(budgetsData);

      // Fetch spending stats
      const [todaySpent, weekSpent, monthSpent] = await Promise.all([
        getSpendingStats('default-user', 'today'),
        getSpendingStats('default-user', 'week'),
        getSpendingStats('default-user', 'month')
      ]);

      setStats({
        today: todaySpent,
        week: weekSpent,
        month: monthSpent
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryData = () => {
    const categoryTotals = {};

    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: calculatePercentage(amount, stats.month)
    }));
  };

  const getDailyData = () => {
    const dailyTotals = {};
    const dates = [];
    const now = new Date();
    let startDate, endDate, numDays;

    // Determine date range based on chartPeriod
    switch (chartPeriod) {
      case 'thisWeek':
        // Start from Sunday of current week
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        numDays = 7; // Always show full week (Sun-Sat)
        break;
      case 'lastWeek':
        // Last week: previous Sunday to Saturday
        const lastWeekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 1);
        startDate = new Date(lastWeekEnd.getFullYear(), lastWeekEnd.getMonth(), lastWeekEnd.getDate() - 6);
        numDays = 7;
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        numDays = now.getDate(); // Only show days up to today
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        numDays = endDate.getDate();
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        numDays = 7;
    }

    // Generate date array
    for (let i = 0; i < numDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dates.push(dateStr);
      dailyTotals[dateStr] = 0;
    }

    // Populate with expense data
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const expenseDateStr = expenseDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (dailyTotals.hasOwnProperty(expenseDateStr)) {
        dailyTotals[expenseDateStr] += expense.amount;
      }
    });

    return dates.map(date => ({
      date,
      amount: dailyTotals[date]
    }));
  };

  const getAllCategories = () => {
    // Get all unique categories from expenses
    const usedCategories = [...new Set(expenses.map(e => e.category))];

    // Combine with default categories and remove duplicates
    const allCategories = [...new Set([...CATEGORIES, ...usedCategories])];

    // Remove "Other" from the list (it's only for adding expenses, not budgets)
    const filteredCategories = allCategories.filter(cat => cat !== 'Other');

    // Sort alphabetically
    return filteredCategories.sort();
  };

  const handleSetBudget = async () => {
    if (!budgetForm.amount || parseFloat(budgetForm.amount) <= 0) {
      return;
    }

    try {
      const currentMonth = getCurrentMonth();
      await setBudget({
        userId: 'default-user',
        category: budgetForm.category,
        monthlyLimit: parseFloat(budgetForm.amount),
        month: currentMonth
      });

      setShowBudgetModal(false);
      setBudgetForm({ category: CATEGORIES[0], amount: '' });
      fetchData();
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  const getBudgetProgress = (category) => {
    const budget = budgets.find(b => b.category === category);
    if (!budget) return null;

    const spent = expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);

    const percentage = calculatePercentage(spent, budget.monthlyLimit);
    const { daysElapsed, daysInMonth, percentageElapsed } = getDaysElapsedInMonth();
    const feedback = getBudgetFeedback(spent, budget.monthlyLimit, percentage, percentageElapsed, daysElapsed, daysInMonth);

    return {
      budget,
      spent,
      percentage,
      feedback,
      daysElapsed,
      daysInMonth
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
            <span className="text-white text-2xl font-bold animate-pulse">₦</span>
          </div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const categoryData = getCategoryData();
  const dailyData = getDailyData();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Statistics</h1>
        <p className="text-gray-600">Track your spending patterns and budgets</p>
      </div>

      {/* Spending Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Today</p>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.today)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">This Week</p>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.week)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">This Month</p>
          <p className="text-lg font-bold text-accent">{formatCurrency(stats.month)}</p>
        </div>
      </div>

      {/* Charts Section */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Spending Analysis</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartType(CHART_TYPES.PIE)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${chartType === CHART_TYPES.PIE
                  ? 'bg-white text-accent shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Pie
              </button>
              <button
                onClick={() => setChartType(CHART_TYPES.BAR)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${chartType === CHART_TYPES.BAR
                  ? 'bg-white text-accent shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Bar
              </button>
            </div>
          </div>
          {/* Time Period Selector for Bar Chart */}
          {chartType === CHART_TYPES.BAR && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartPeriod('thisWeek')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${chartPeriod === 'thisWeek'
                    ? 'bg-white text-accent shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setChartPeriod('lastWeek')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${chartPeriod === 'lastWeek'
                    ? 'bg-white text-accent shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  Last Week
                </button>
                <button
                  onClick={() => setChartPeriod('thisMonth')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${chartPeriod === 'thisMonth'
                    ? 'bg-white text-accent shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setChartPeriod('lastMonth')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${chartPeriod === 'lastMonth'
                    ? 'bg-white text-accent shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  Last Month
                </button>
              </div>
            </div>
          )}

          {chartType === CHART_TYPES.PIE ? (
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="amount" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Budget Progress Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Budget Progress</h2>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors duration-200 font-medium flex items-center space-x-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Manage Budgets</span>
          </button>
        </div>

        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">No budgets set yet</p>
            <p className="text-gray-500 text-xs mt-1">Set budgets to track your spending</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map(budget => {
              const progress = getBudgetProgress(budget.category);
              if (!progress) return null;

              return (
                <div key={budget.category} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{budget.category}</span>
                    <span className="text-xs text-gray-500">
                      {formatCurrency(progress.spent)} / {formatCurrency(progress.budget.monthlyLimit)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${progress.percentage >= 100 ? 'bg-red-500' :
                          progress.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{progress.percentage}% used</span>
                    <div className={`text-xs ${progress.feedback.color === 'red' ? 'text-red-600' :
                      progress.feedback.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                      <div className="font-medium">
                        {progress.feedback.emoji} {progress.feedback.message}
                      </div>
                      <div className="text-gray-600 mt-1">
                        {progress.feedback.detail}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Set Budget</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  {getAllCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Budget (₦)
                </label>
                <input
                  type="text"
                  value={budgetForm.amount ? parseFloat(budgetForm.amount).toLocaleString('en-US') : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, '');
                    if (value === '' || !isNaN(value)) {
                      setBudgetForm(prev => ({ ...prev, amount: value }));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSetBudget}
                className="flex-1 bg-accent text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors duration-200 font-medium"
              >
                Set Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
