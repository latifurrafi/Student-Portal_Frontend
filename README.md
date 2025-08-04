# Student Portal Frontend - React

A modern React-based student portal for Daffodil International University with a beautiful UI and responsive design.

## Features

- 📊 **Dashboard** with financial summary and academic performance charts
- 👤 **Student Profile** with comprehensive personal and academic information
- 📱 **Responsive Design** that works on desktop, tablet, and mobile
- 🎨 **Modern UI** built with Tailwind CSS and Font Awesome icons
- 📈 **Interactive Charts** using Chart.js and react-chartjs-2
- 🧭 **Navigation** with sidebar and active state indicators

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive charts and graphs
- **Font Awesome** - Icon library
- **React Scripts** - Create React App build tools

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd Student-Portal_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout with sidebar and header
│   ├── Sidebar.js      # Navigation sidebar
│   └── Header.js       # Top header with user info
├── pages/              # Page components
│   ├── Dashboard.js    # Dashboard page with charts
│   └── StudentProfile.js # Student profile page
├── App.js              # Main app component with routing
├── index.js            # React entry point
└── index.css           # Global styles and Tailwind imports
```

## Components Overview

### Layout Component
- Manages the overall layout structure
- Handles sidebar toggle functionality
- Responsive design for mobile devices

### Sidebar Component
- Navigation menu with all student portal features
- Active state highlighting for current page
- Collapsible on mobile devices

### Dashboard Component
- Financial summary cards
- Interactive SGPA performance chart
- Today's routine section

### StudentProfile Component
- Comprehensive student information display
- Personal, academic, and financial details
- Recent activities timeline

## Styling

The application uses **Tailwind CSS** for styling with custom color schemes:
- `diu-blue`: #1e3a8a
- `diu-dark`: #1e293b
- `diu-light`: #f1f5f9

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

To build the application for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files that can be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Note**: This is a frontend-only implementation. For a complete student portal, you'll need to integrate with a backend API to fetch real data. 