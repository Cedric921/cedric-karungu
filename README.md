# 🌟 Lord VB Portfolio

A modern, responsive portfolio website built with React, Vite, and Tailwind CSS. This portfolio showcases professional work, skills, experience, and contact information with a sleek dark/light theme toggle and smooth scroll animations.

## ✨ Features

- **🎨 Dark/Light Theme Toggle** - Seamless theme switching with localStorage persistence
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **✨ Smooth Scroll Animations** - Custom scroll animation hooks for engaging user experience
- **🚀 Fast Performance** - Built with Vite for rapid development and optimized builds
- **🎯 Modular Components** - Well-organized React components for easy maintenance and scalability
- **⌨️ Keyboard Accessible** - Built with accessibility best practices in mind
- **📄 Modern UI** - Clean and professional design using Tailwind CSS

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev)
- **Build Tool**: [Vite 6](https://vitejs.dev)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com)
- **Build Optimization**: [PostCSS](https://postcss.org), [Autoprefixer](https://autoprefixer.github.io)
- **Package Manager**: npm

## 📦 Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.jsx      # Navigation bar with theme toggle
│   ├── Hero.jsx        # Hero section
│   ├── AboutMe.jsx     # About section
│   ├── Skills.jsx      # Skills section
│   ├── Experience.jsx  # Work experience section
│   ├── Portfolio.jsx   # Projects showcase
│   ├── Contact.jsx     # Contact form/information
│   └── Footer.jsx      # Footer
├── constants/          # Application constants and data
│   └── constants.jsx   # SVG Icons and content data
├── hooks/             # Custom React hooks
│   └── useScrollAnimation.js  # Scroll animation hook
├── styles/            # Global styles
│   └── globals.css    # Global CSS and Tailwind imports
├── App.jsx            # Main app component
└── index.jsx          # React entry point

public/               # Static assets
├── images/           # Project and portfolio images
└── document/         # Downloadable documents

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cedric-karungu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Theme System

The portfolio includes a dark/light theme system:
- **Theme Persistence**: User's theme preference is saved to localStorage
- **Auto-detection**: Checks for saved preference, defaults to dark theme
- **Toggle Button**: Located in the navbar for easy switching

## 🎬 Animations

Custom scroll animations enhance the user experience:
- Smooth fade-ins and transitions as sections come into view
- Implemented via the `useScrollAnimation` custom hook
- Responsive and performant animations

## 📧 Contact

The portfolio includes a contact section to get in touch. Links available for:
- Email
- LinkedIn
- GitHub
- Additional social media platforms

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Cedric Karungu** - Your friendly neighborhood developer 👨‍💻

---

Built with ❤️ using React & Vite
