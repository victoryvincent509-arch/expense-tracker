import React, { useState, useEffect } from 'react';
import { subscribeToExpenses, deleteExpense } from '../localStorage/firestore';
import { CATEGORIES, CATEGORY_COLORS, FILTER_PERIODS, getCategoryColor } from '../utils/constants';
import { formatDate, getDateRange } from '../utils/dateUtils';
import { formatCurrency } from '../utils/currencyUtils';

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    period: 'month',
    customStart: '',
    customEnd: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Set up real-time listener
    const unsubscribe = subscribeToExpenses('default-user', (data) => {
      setExpenses(data);
      setLoading(false);
    }, filters);

    return () => unsubscribe();
  }, [filters]);

  const handleDeleteClick = (expense) => {
    setDeleteConfirm(expense);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(deleteConfirm.id);
    try {
      await deleteExpense(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const getExpenseCategoryColor = (category) => {
    return getCategoryColor(category);
  };
  const getAllCategories = () => {
    // Get all unique categories from expenses
    const usedCategories = [...new Set(expenses.map(e => e.category))];

    // Combine with default categories and remove duplicates
    const allCategories = [...new Set([...CATEGORIES, ...usedCategories])];

    // Sort alphabetically, keep "Other" at the end
    const sorted = allCategories.filter(cat => cat !== 'Other').sort();
    if (allCategories.includes('Other')) {
      sorted.push('Other');
    }

    return sorted;
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
            <span className="text-white text-2xl font-bold animate-pulse">₦</span>
          </div>
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Expenses</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
          </p>
          <p className="text-lg font-semibold text-accent">
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {getAllCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Period Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                value={filters.period}
                onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {FILTER_PERIODS.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
            </div>

            {/* Custom Date Range */}
            {filters.period === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.customStart}
                    onChange={(e) => setFilters(prev => ({ ...prev, customStart: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.customEnd}
                    onChange={(e) => setFilters(prev => ({ ...prev, customEnd: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No expenses found</h3>
            <p className="text-gray-600 mb-4">
              {filters.category !== 'all' || filters.period !== 'month'
                ? 'Try adjusting your filters or add new expenses'
                : 'Start tracking your expenses by adding your first one'
              }
            </p>
            <a
              href="/add"
              className="inline-flex items-center bg-accent text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </a>
          </div>
        ) : (
          expenses.map(expense => (
            <div key={expense.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className="px-2 py-1 text-xs font-medium text-white rounded-full"
                      style={{ backgroundColor: getExpenseCategoryColor(expense.category) }}
                    >
                      {expense.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-1">
                    {formatCurrency(expense.amount)}
                  </p>
                  {expense.note && (
                    <p className="text-sm text-gray-600">{expense.note}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteClick(expense)}
                  disabled={deleting === expense.id}
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting === expense.id ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Expense?</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this {formatCurrency(deleteConfirm.amount)} expense from {deleteConfirm.category}? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
