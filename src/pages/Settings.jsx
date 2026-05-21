import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../localStorage/auth';

const Settings = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handleSignOut = async () => {
        try {
            await logout();
            window.location.reload();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleClearAllData = () => {
        localStorage.removeItem('expense_tracker_expenses');
        localStorage.removeItem('expense_tracker_budgets');
        setShowClearConfirm(false);
        alert('All data cleared successfully');
        window.location.reload();
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account and data</p>
            </div>

            {/* Account Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Account</h2>

                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-gray-800 font-medium">{currentUser?.email}</p>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Data Management Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h2>

                <div className="space-y-3">
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="w-full bg-gray-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium"
                    >
                        Clear All Data
                    </button>

                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-800">
                            <strong>Storage:</strong> Your data is stored locally on this device.
                        </p>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>

                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">App Name</p>
                        <p className="text-gray-800 font-medium">Expense Tracker</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Version</p>
                        <p className="text-gray-800 font-medium">1.0.0</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Developer</p>
                        <a
                            href="https://victorydev.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent font-medium hover:text-primary transition-colors duration-200"
                        >
                            Vincent Uyi ↗
                        </a>
                    </div>
                </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-20">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Privacy</h2>

                <p className="text-sm text-gray-600">
                    Your privacy matters. This app stores all data locally on your device. No information is sent to external servers.
                </p>
            </div>

            {/* Clear Data Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Clear All Data?</h3>
                        <p className="text-gray-600 mb-4">
                            This will permanently delete all your expenses and budgets. This cannot be undone.
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearAllData}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;