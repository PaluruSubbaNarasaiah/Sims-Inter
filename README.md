# Student Information Management System (SIMS)

A comprehensive web-based student information management system designed for intermediate colleges, built with modern React technologies.

## 🚀 Features

### Core Modules
- **Multi-Role Authentication** - Secure login for SuperAdmin, Admin, Lecturer, Student, and Parent roles
- **Student Management** - Complete student profile and academic record management
- **Attendance Tracking** - Real-time attendance monitoring with detailed analytics
- **Fee Management** - Comprehensive fee collection and payment tracking
- **Academic Reports** - Exam results, grade management, and progress tracking
- **Communication Hub** - Messages, announcements, and notifications system
- **Event Management** - College events and calendar integration
- **Leave Management** - Leave request and approval workflow

### User Roles & Permissions
- **SuperAdmin** - System-wide administration and configuration
- **Admin** - College administration and management oversight
- **Lecturer** - Class management, attendance, and academic activities
- **Student** - Academic records, attendance, and communication access
- **Parent** - Child's academic progress monitoring and communication

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React, React Icons (Font Awesome)
- **Routing**: React Router DOM
- **Build Tool**: Vite with Hot Module Replacement (HMR)
- **Development**: ES6+, JSX

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sims-client-inter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPERADMIN_USERNAME=superadmin
   VITE_SUPERADMIN_PASSWORD=admin123
   VITE_SUPERADMIN_EMAIL=superadmin@college.edu

   VITE_ADMIN_USERNAME=admin
   VITE_ADMIN_PASSWORD=admin123
   VITE_ADMIN_EMAIL=admin@college.edu

   VITE_LECTURER_USERNAME=lecturer
   VITE_LECTURER_PASSWORD=lecturer123

   VITE_STUDENT_USERNAME=student
   VITE_STUDENT_PASSWORD=student123

   VITE_PARENT_USERNAME=parent
   VITE_PARENT_PASSWORD=parent123
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
sims-client-inter/
├── src/
│   ├── assets/              # Static assets (images, logos)
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   │   ├── parent/         # Parent portal pages
│   │   │   ├── components/ # Parent-specific components
│   │   │   ├── attendance/ # Attendance management
│   │   │   └── profile/    # Profile management
│   │   ├── admin/          # Admin portal pages
│   │   ├── lecturer/       # Lecturer portal pages
│   │   └── student/        # Student portal pages
│   ├── utils/              # Helper functions and utilities
│   └── App.jsx             # Main application component
├── public/                 # Public assets
├── .env                    # Environment variables
└── package.json           # Project dependencies
```

## 🔐 Authentication

The system supports role-based authentication with the following default credentials:

| Role | Username | Password |
|------|----------|----------|
| SuperAdmin | superadmin | admin123 |
| Admin | admin | admin123 |
| Lecturer | lecturer | lecturer123 |
| Student | student | student123 |
| Parent | parent | parent123 |

## 🎯 Key Features by Role

### Parent Portal
- **My Children** - View and manage ward information
- **Fee Management** - Track fee payments and dues
- **Homework Diary** - Monitor daily assignments
- **Exam Results** - Access academic performance
- **Attendance** - Real-time attendance tracking
- **Leave Requests** - Submit and track leave applications
- **Events** - College event calendar
- **Messages** - Communication with teachers
- **Announcements** - Important college notices

### Responsive Design
- Mobile-first approach
- Collapsible sidebar navigation
- Touch-friendly interface
- Cross-browser compatibility

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI/UX Features

- **Modern Design** - Clean, intuitive interface
- **Responsive Layout** - Works on all device sizes
- **Dark/Light Theme** - User preference support
- **Smooth Animations** - Enhanced user experience
- **Accessibility** - WCAG compliant design

## 📱 Mobile Support

- Progressive Web App (PWA) ready
- Touch gestures support
- Offline functionality
- Mobile-optimized navigation

## 🔧 Configuration

### Tailwind CSS
Custom configuration for college branding and theme colors.

### Vite Configuration
Optimized build settings for fast development and production builds.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries:
- Email: support@college.edu
- Documentation: [Project Wiki](wiki-url)
- Issues: [GitHub Issues](issues-url)

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added parent portal and mobile responsiveness
- **v1.2.0** - Enhanced UI/UX and performance improvements

---

**Built with ❤️ for educational institutions**