# Zen Theme Blog

A clean, modern blog theme with excellent readability and beautiful typography. Built with Astro for optimal performance.

## Features

- 🎨 **Zen Theme**: Clean design with excellent readability
- 🔤 **Inter Font**: Optimal readability with Inter typeface
- 🎯 **Responsive Design**: Fully responsive for mobile and desktop
- 🌙 **Dark Mode**: Automatic theme switching based on user preference
- 🔍 **Search**: Built-in search functionality with Pagefind
- 📝 **Markdown Support**: Full markdown and MDX support
- 📊 **Beautiful Tables**: Styled tables with hover effects
- 📱 **Sidebar TOC**: Fixed table of contents for easy navigation

## Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - CSS framework
- **Pagefind** - Search functionality
- **Inter Font** - Typography

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/your-repo-name.git

# Navigate to the project directory
cd your-repo-name

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.astro    # Header component
│   │   └── SearchModal.astro # Search modal
│   ├── content/            # Blog content
│   │   ├── about/          # About page content
│   │   └── blog/           # Blog posts
│   ├── layouts/            # Page layouts
│   │   ├── BlogPost.astro   # Blog post layout
│   │   └── BaseLayout.astro # Base layout
│   ├── pages/              # Page routes
│   │   ├── blog/           # Blog listing
│   │   ├── tags/           # Tag pages
│   │   ├── about.astro     # About page
│   │   └── index.astro     # Home page
│   ├── styles/             # Global styles
│   │   └── global.css      # Global CSS variables
│   └── consts.ts           # Site constants
├── astro.config.mjs        # Astro configuration
├── package.json            # Project dependencies
└── README.md               # This file
```

## Configuration

### Site Metadata

Edit `src/consts.ts` to configure your site:

```typescript
export const SITE_TITLE = 'Zen Theme Blog';
export const SITE_DESCRIPTION = 'A clean, modern blog theme with excellent readability.';
export const AUTHOR_NAME = 'Your Name';
export const AUTHOR_TITLE = 'Your Title';
export const AUTHOR_DESCRIPTION = 'Your description';

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  email: 'mailto:your@email.com',
};
```

### Theme Variables

Edit `src/styles/global.css` to customize the theme:

```css
:root {
  --accent: #F97316;          /* Primary color */
  --text-primary: #18181B;    /* Primary text */
  --text-secondary: #3F3F46;  /* Secondary text */
  --bg-primary: #FFFFFF;      /* Background */
  --border-color: #E4E4E7;    /* Border color */
}
```

### Adding Blog Posts

Create new markdown files in `src/content/blog/`:

```markdown
---
title: Post Title
description: Post description
pubDate: 2026-05-13
tags: ["tag1", "tag2"]
---

Your content here...
```

## Customization

### Changing Colors

Modify the CSS variables in `src/styles/global.css`:

- `--accent`: Primary accent color (default: orange)
- `--text-primary`: Main text color
- `--bg-primary`: Background color
- `--border-color`: Border color

### Changing Fonts

The theme uses Inter font by default. You can change the font in `src/styles/global.css`:

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## Features Overview

### Typography
- Inter font family for optimal readability
- Line height: 1.9 for comfortable reading
- Letter spacing: -0.01em for better text density

### Color Scheme

**Light Mode:**
- Primary: #F97316 (Warm Orange)
- Background: #FFFFFF
- Text: #18181B, #3F3F46, #71717A

**Dark Mode:**
- Primary: #FB923C (Lighter Orange)
- Background: #18181B
- Text: #FAFAFA, #D4D4D8, #71717A

### Layout
- Content Width: 700px for optimal reading line length
- Responsive Design: Works on all screen sizes
- Sidebar TOC: Fixed table of contents for long articles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available for personal use.

## Acknowledgments

- Built with [Astro](https://astro.build/)
- Search powered by [Pagefind](https://pagefind.app/)
- Font by [Inter](https://fonts.google.com/specimen/Inter)
