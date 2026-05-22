import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addExpense } from '../localStorage/firestore';
import { CATEGORIES } from '../utils/constants';
import { getTodayString, formatDate } from '../utils/dateUtils';
import { getUserExpenses } from '../localStorage/firestore';
const Add = () => {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState(CATEGORIES);
  const [formData, setFormData] = useState({

    amount: '',
    category: CATEGORIES[0],
    date: getTodayString(),
    note: '',
    customCategory: ''
  });
  useEffect(() => {
    const fetchCategories = async () => {
      const expenses = await getUserExpenses('default-user');
      const usedCategories = [...new Set(expenses.map(e => e.category))];
      const combined = [...new Set([...CATEGORIES, ...usedCategories])];
      // Sort alphabetically, but keep "Other" at the end
      const sorted = combined.filter(cat => cat !== 'Other').sort();
      if (combined.includes('Other')) {
        sorted.push('Other');
      }
      setAllCategories(sorted);
    };

    fetchCategories();
  }, []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (formData.category === 'Other' && !formData.customCategory.trim()) {
      setError('Please specify what "Other" is');
      return;
    }

    if (!formData.date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);

    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        category: formData.category === 'Other' ? formData.customCategory.trim() : formData.category,
        date: formData.date,
        note: formData.note.trim()
      };

      await addExpense(expenseData);
      setSuccess(true);

      // Reset form
      setFormData({
        amount: '',
        category: CATEGORIES[0],
        date: getTodayString(),
        note: '',
        customCategory: ''
      });

      // Navigate to home after success
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      setError('Failed to add expense. Please try again.');
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Expense</h1>
        <p className="text-gray-600">Record your spending to track your finances</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Expense added successfully!
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
              ₦
            </span>
            <input
              type="text"
              name="amount"
              value={formData.amount ? parseFloat(formData.amount).toLocaleString('en-US') : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (value === '' || !isNaN(value)) {
                  handleChange({ target: { name: 'amount', value } });
                }
              }}
              className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Category Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            required
          >
            {allCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        {/* Custom Category Input (shows when "Other" is selected) */}
        {formData.category === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specify Category *
            </label>
            <input
              type="text"
              name="customCategory"
              value={formData.customCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., Birthday gift, Car repair, Medical"
              required
            />
          </div>
        )}
        {/* Date Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            max={getTodayString()}
            required
          />
        </div>

        {/* Note Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note (optional)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            rows={3}
            placeholder="Add a note about this expense..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white px-4 py-3 rounded-lg hover:bg-primary transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Expense...
            </span>
          ) : (
            'Add Expense'
          )}
        </button>
      </form>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Tips</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <span className="text-accent mr-2">•</span>
            Be consistent with categorizing expenses for better insights
          </li>
          <li className="flex items-start">
            <span className="text-accent mr-2">•</span>
            Add notes to remember specific purchases
          </li>
          <li className="flex items-start">
            <span className="text-accent mr-2">•</span>
            Review your spending patterns in the Stats tab
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Add;
