# Expense Tracker

A modern, multi-user expense tracking web application built with React, Vite, Firebase, and Tailwind CSS. Features real-time expense tracking, budget management, and data visualization with charts.

## Features

### 🔐 Authentication
- Email/Password sign up and login
- Google Sign-In integration
- Password reset functionality
- Protected routes with authentication

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Bottom navigation similar to WhatsApp
- Touch-friendly interface
- Progressive Web App (PWA) capabilities

### 💰 Expense Management
- Add expenses with amount, category, date, and optional notes
- View expenses in chronological order
- Filter by category and date range
- Delete expenses with confirmation
- Real-time updates using Firebase listeners

### 📊 Statistics & Analytics
- Daily, weekly, and monthly spending summaries
- Interactive charts (Pie and Bar charts) using Recharts
- Category-wise spending breakdown with percentages
- Budget tracking with progress indicators
- Smart budget feedback based on spending pace

### 🎯 Budget Management
- Set monthly budgets per category
- Visual progress bars for budget tracking
- Color-coded feedback system:
  - 🟢 Green: "Great pace!" if spending is on track
  - 🟡 Yellow: "Watch out!" if spending is slightly high
  - 🔴 Red: "Slow down!" if spending exceeds budget

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom components
- **Authentication**: LocalStorage (simple email/password)
- **Database**: LocalStorage (browser storage)
- **Charts**: Recharts
- **Routing**: React Router
- **PWA**: Service Worker + Web App Manifest

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Data Storage

This application uses localStorage for data storage, which means:
- All data is stored in your browser's local storage
- No external database or authentication service required
- Data persists between browser sessions
- Clearing browser data will remove all stored expenses and user accounts

## LocalStorage Data Structure

### Expenses Data
```javascript
{
  id: string,               // Unique expense ID
  userId: string,           // User ID
  amount: number,           // Expense amount
  category: string,         // One of: Food, Transport, Tech/Tools, Entertainment, Data/Airtime, Other
  date: string,             // ISO date string
  note: string,             // Optional note
  createdAt: string         // ISO timestamp when expense was created
}
```

### Budgets Data
```javascript
{
  id: string,               // Unique budget ID (userId_category_month)
  userId: string,           // User ID
  category: string,         // Budget category
  monthlyLimit: number,     // Monthly budget limit
  month: string,            // Format: "YYYY-MM"
  createdAt: string         // ISO timestamp when budget was created
}
```

### Users Data
```javascript
{
  id: string,               // Unique user ID
  email: string,            // User email
  password: string,         // User password (stored in plain text for demo)
  displayName: string,      // User display name
  createdAt: string         // ISO timestamp when user was created
}
```

## Project Structure

```
src/
├── components/             # Reusable components
│   ├── Layout.jsx         # Main app layout with bottom navigation
│   ├── LoadingSpinner.jsx  # Loading indicator component
│   └── ProtectedRoute.jsx  # Authentication wrapper
├── contexts/              # React contexts
│   └── AuthContext.jsx     # Authentication state management
├── localStorage/          # localStorage data management
│   ├── auth.js            # Authentication functions
│   └── firestore.js       # Data operations (expenses, budgets)
├── pages/                 # Page components
│   ├── Add.jsx            # Add expense page
│   ├── ForgotPassword.jsx # Password reset page
│   ├── Home.jsx           # Home/expenses list page
│   ├── Login.jsx          # Login page
│   ├── SignUp.jsx         # Sign up page
│   └── Stats.jsx          # Statistics and charts page
├── utils/                 # Utility functions
│   ├── constants.js       # App constants and configurations
│   ├── currencyUtils.js   # Currency formatting and calculations
│   └── dateUtils.js       # Date manipulation utilities
├── App.jsx                # Main app component with routing
├── index.css              # Global styles and Tailwind imports
└── main.jsx               # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## PWA Features

This application includes Progressive Web App features:

- **Offline Support**: Service worker caching for offline functionality
- **App-like Experience**: Can be installed on mobile devices
- **Responsive Design**: Works seamlessly on all device sizes

To install as a PWA:
1. Open the app in a mobile browser
2. Look for the "Add to Home Screen" prompt
3. Tap to install the app

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports static sites:
- Netlify
- Firebase Hosting
- AWS Amplify
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section below
2. Search existing GitHub issues
3. Create a new issue with detailed information

## Troubleshooting

### Data Storage Issues
- Ensure your browser supports localStorage
- Check that browser storage is not disabled
- Clear browser cache if data appears corrupted

### Authentication Issues
- Try using a different email address for signup
- Check that passwords match during signup
- Ensure email format is correct

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check that all dependencies are installed correctly

### PWA Issues
- Ensure the service worker is properly registered
- Check that the manifest.json is accessible
- Verify HTTPS is enabled (required for PWA features)

---

**Happy expense tracking! 🚀**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
