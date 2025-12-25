# 🌟 Lord VB Portfolio

A modern, responsive portfolio website built with Next.js (app router), React, and Tailwind CSS. This portfolio showcases professional work, skills, experience, and contact information with a sleek dark/light theme toggle and smooth scroll animations.

## ✨ Features

- **🎨 Dark/Light Theme Toggle** - Seamless theme switching with localStorage persistence
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **✨ Smooth Scroll Animations** - Custom scroll animation hooks for engaging user experience
- **🚀 Fast Performance** - Built with Vite for rapid development and optimized builds
- **🎯 Modular Components** - Well-organized React components for easy maintenance and scalability
- **⌨️ Keyboard Accessible** - Built with accessibility best practices in mind
- **📄 Modern UI** - Clean and professional design using Tailwind CSS

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js (React 19) — app router + server-side rendering
- **Internationalization**: `next-intl` for locale routing and translations
- **Styling**: Tailwind CSS 3
- **Build Tools**: Next.js (build & dev server), PostCSS, Autoprefixer
- **Language**: TypeScript
- **Package Manager**: npm

## 📦 Project Structure

```
app/                   # Next.js app router (layouts, pages per locale)
├── layout.tsx
├── [locale]/
│   ├── layout.tsx
│   └── page.tsx
├── page.tsx

src/                   # Client-side components and utilities
├── components/         # React components (UI pieces)
├── constants/          # Application constants and data
├── hooks/              # Custom hooks (e.g. useScrollAnimation)
└── styles/             # Global styles (globals.css)

public/                # Static assets
├── images/             # Project and portfolio images
└── document/           # Downloadable documents

next.config.js         # Next.js configuration
tsconfig.json          # TypeScript configuration
package.json           # Scripts and dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

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
   The Next.js dev server will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Start Production Server

```bash
npm start
```

This runs `next start` and serves the production build (default port `3000`).

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

- **Gabriel Buhendwa** - Your friendly neighborhood developer 👨‍💻
- **Cedric Karungu** - Your friendly neighborhood developer 👨‍💻

---

Built with ❤️ using React & Vite
