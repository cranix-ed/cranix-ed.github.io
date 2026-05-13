---
title: Introducing Zen Theme
description: A clean, modern theme inspired by Zen Browser's documentation design
pubDate: 2026-05-13
tags: ["theme", "design", "zen"]
---

## Quick Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Step 1: Initialize Project

```bash
npm create astro@6.5.0 . -- --template blog
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Add Inter Font

Add the Inter font to your `src/layouts/BaseLayout.astro` or main HTML file:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Step 4: Apply Theme Styles

Copy the theme CSS variables to `src/styles/global.css`:

```css
:root {
  --accent: #F97316;
  --accent-hover: #EA580C;
  --accent-light: #FDBA74;
  --text-primary: #18181B;
  --text-secondary: #3F3F46;
  --text-muted: #71717A;
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAFAFA;
  --border-color: #E4E4E7;
}
```

## Overview

The Zen theme is a clean, modern design theme inspired by the Zen Browser documentation website. It features a minimalistic approach with warm orange accents and excellent readability.

## Key Features

### Typography
- **Font**: Inter font family for optimal readability
- **Line Height**: 1.9 for comfortable reading experience
- **Letter Spacing**: -0.01em for better text density

### Color Scheme

**Light Mode:**
- Primary: #F97316 (Warm Orange)
- Background: #FFFFFF
- Text: #18181B (Primary), #3F3F46 (Secondary), #71717A (Muted)
- Border: #E4E4E7

**Dark Mode:**
- Primary: #FB923C (Lighter Orange)
- Background: #18181B
- Text: #FAFAFA (Primary), #D4D4D8 (Secondary), #71717A (Muted)
- Border: #3F3F46

### Layout
- **Content Width**: 700px for optimal reading line length
- **Responsive Design**: Fully responsive for mobile and desktop
- **Sidebar TOC**: Fixed table of contents for easy navigation

## Configuration

### Theme Variables

The theme uses CSS custom properties for easy customization:

```css
:root {
  --accent: #F97316;
  --accent-hover: #EA580C;
  --accent-light: #FDBA74;
  --text-primary: #18181B;
  --text-secondary: #3F3F46;
  --text-muted: #71717A;
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAFAFA;
  --border-color: #E4E4E7;
}
```

### Dark Mode Support

The theme automatically switches between light and dark modes based on user preference. You can toggle the theme using the button in the header.

### Typography Settings

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 17px;
  line-height: 1.9;
  letter-spacing: -0.01em;
  -webkit-font-smoothing: antialiased;
}
```

### Social Links

Configure your social media links in `src/consts.ts`:

```typescript
export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  email: 'mailto:your@email.com',
};
```

These links will be displayed in the footer section of your blog.

## Components

### Tables
Tables feature rounded corners, subtle shadows, and hover effects for rows:

| Feature | Description | Status |
|---------|-------------|--------|
| Responsive | Works on all screen sizes | ✅ |
| Dark Mode | Full dark mode support | ✅ |
| Hover Effects | Row highlighting on hover | ✅ |
| Sticky Header | Fixed table header on scroll | ✅ |

### Code Blocks
Syntax-highlighted code blocks with proper spacing and readable fonts:

```typescript
// Example code block with syntax highlighting
const zenThemeConfig = {
  primaryColor: '#F97316',
  fontSettings: {
    family: 'Inter',
    size: '17px',
    lineHeight: 1.9
  },
  contentWidth: '700px'
};
```

### Configuration Reference

Here's how to configure the Zen theme parameters:

| Parameter | Value | File Location |
|-----------|-------|---------------|
| Accent Color | `#F97316` | `src/styles/global.css` (CSS variable `--accent`) |
| Font Family | Inter | `src/styles/global.css` |
| Font Size | 17px | `src/styles/global.css` (CSS variable `--body-font-size`) |
| Line Height | 1.9 | `src/styles/global.css` |
| Content Width | 700px | `src/layouts/BlogPost.astro` |
| Site Title | Your Blog Name | `src/consts.ts` |
| Social Links | GitHub, Twitter, etc. | `src/consts.ts` (`SOCIAL_LINKS`) |

### Callout Boxes
Tip boxes with icons for important information:

> **Tip:** The Zen theme prioritizes readability with carefully chosen font sizes and line heights.

## Design Philosophy

The Zen theme follows these core design principles:

1. **Readability First**: Every typographic choice is made with reading comfort in mind
2. **Visual Hierarchy**: Clear distinction between headings, body text, and metadata
3. **Consistency**: Uniform spacing and sizing across all components
4. **Accessibility**: Proper contrast ratios and semantic HTML

## Configuration Files

### Site Metadata

Blog title, description, and author information are configured in `src/consts.ts`:

```typescript
export const SITE_TITLE = 'My Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';
export const AUTHOR_NAME = 'Bob';
export const AUTHOR_TITLE = 'Full Stack Developer / Technical Writer';
export const AUTHOR_DESCRIPTION = 'Passionate about technology...';
```

### Astro Configuration

The main Astro configuration file is `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [sitemap()],
});
```

### Content Configuration

Blog posts are stored in the `src/content/blog/` directory as Markdown files with frontmatter:

```markdown
---
title: Post Title
description: Post description
pubDate: 2026-05-13
tags: ["tag1", "tag2"]
---
```

### Theme Variables

All theme colors and typography settings are defined in `src/styles/global.css` using CSS custom properties.

## Getting Started

To use the Zen theme in your project:

1. **Include the Inter font** in your HTML head
2. **Add the CSS variables** to your stylesheet
3. **Configure site metadata** in `src/consts.ts`
4. **Set up Astro** in `astro.config.mjs`
5. **Create content** in `src/content/blog/`
6. **Customize** as needed for your brand

## Conclusion

The Zen theme provides a clean, modern foundation for technical documentation and blogs. Its focus on readability and minimalism makes it perfect for content-heavy websites.

---


