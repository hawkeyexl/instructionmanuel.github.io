# Copilot Instructions for instructionmanuel

## Writing a blog post — read this first

When asked to create or substantially adapt a blog post for this site, invoke the **authoring-workflow** skill *before* drafting. The workflow runs Planner → Writer → Editor → Reviewer → Citation Verifier → Proofer; drafting first and then reviewing late wastes the multi-pass benefit and lets style/citation issues land in the published version. Treat "adapt this presentation/talk into a post" and "rewrite this draft" as authoring tasks, not edits.

## Project Overview

This is a **Docusaurus v3.9.1** portfolio and blog site for Manny Silva (Technical Writer & Engineer). The site is **blog-first** (blog at `/`, not `/blog`) with custom portfolio pages and no docs section.

**Production URL**: https://www.instructionmanuel.com  
**Repository**: hawkeyexl/instructionmanuel

## Architecture & Key Decisions

### Blog-First Setup
- `docusaurus.config.ts` sets `blog.routeBasePath: '/'` — blog is the homepage
- `docs: false` — documentation plugin is disabled
- Portfolio page at `/portfolio` replaces traditional homepage
- Custom pages in `src/pages/` for book, doc-detective, talks

### Page Structure
- **`src/pages/portfolio.tsx`**: Homepage with hero section and portfolio cards (uses `portfolio.module.css`)
- **`src/pages/*.md`**: Markdown pages for book, doc-detective, talks content
- **`blog/`**: Blog posts with front matter (authors.yml, tags.yml)
- No `index.tsx` — Docusaurus routing handles blog as root

### Styling Approach
- **CSS Modules** for component-specific styles (`portfolio.module.css`)
- **Global styles** in `src/css/custom.css` with custom CSS variables
- **Design system**: Purple gradient theme (`#667eea` to `#764ba2`)
- Dark mode support via `colorMode.respectPrefersColorScheme: true`

## Development Workflow

### Essential Commands
```bash
npm start          # Development server with hot reload
npm run build      # Production build (output to /build)
npm run serve      # Preview production build locally
npm run typecheck  # Run TypeScript type checking
npm run clear      # Clear Docusaurus cache
```

### Adding Content
- **Blog posts**: Create `blog/YYYY-MM-DD-slug.md` with front matter
- **Portfolio items**: Edit `portfolioItems` array in `src/pages/portfolio.tsx`
- **New pages**: Add `.md` or `.tsx` files to `src/pages/`
- **Navigation**: Update `navbar.items` in `docusaurus.config.ts`

## TypeScript & Tooling

- **TypeScript**: Enabled but not used for build — `tsconfig.json` is for editor experience only
- **Type imports**: Use `import type` for Docusaurus types
- **Docusaurus types**: `@docusaurus/types`, `@docusaurus/preset-classic`
- **React version**: 19.0.0 (latest)

## Styling Conventions

### CSS Module Patterns (portfolio.module.css)
```tsx
// Component-specific styles use CSS modules
import styles from './portfolio.module.css';
<div className={styles.heroBanner}>...</div>
```

### Global Style Variables (custom.css)
- Primary colors: `--ifm-color-primary*` variants
- Card backgrounds: `--ifm-card-background-color`
- Gradient footer: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### Design Patterns
- Modern card hover effects with `transform: translateY(-8px)`
- Gradient accent bars on cards (pseudo-elements)
- Smooth transitions: `cubic-bezier(0.4, 0, 0.2, 1)`
- Backdrop filters for glass-morphism effects

## Component Architecture

### Layout Usage
```tsx
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

export default function Page() {
  return (
    <Layout title="Page Title" description="SEO description">
      <main>{/* Content */}</main>
    </Layout>
  );
}
```

### Navigation Links
- **Internal**: `<Link to="/path">` (from `@docusaurus/Link`)
- **External**: `<a href="https://..." target="_blank" rel="noopener noreferrer">`
- **Navbar**: Configured in `docusaurus.config.ts` under `themeConfig.navbar.items`

## Configuration Patterns

### Docusaurus Config Structure
```typescript
// docusaurus.config.ts
const config: Config = {
  title: 'Manny Silva',
  url: 'https://www.instructionmanuel.com',
  baseUrl: '/',
  organizationName: 'hawkeyexl',
  projectName: 'instructionmanuel',
  future: { v4: true }, // Docusaurus v4 compatibility
  // ...
};
```

### Key Config Sections
- **`presets`**: Classic preset with `docs: false`, blog at root
- **`themeConfig.navbar`**: Top navigation with left/right positioned items
- **`themeConfig.footer`**: Three-column footer with gradient background
- **`themeConfig.prism`**: Syntax highlighting (github/dracula themes)

## Content Front Matter

### Blog Posts
```yaml
---
slug: welcome              # URL slug
title: Post Title          # Page title
authors: [manny]          # References blog/authors.yml
tags: [documentation]     # References blog/tags.yml
---
```

### Markdown Pages
```yaml
---
title: Page Title         # Optional (defaults to filename)
description: SEO text     # Optional meta description
---
```

## Writing Style & Content Guidelines

This site follows the [Google Developer Style Guide](https://developers.google.com/style) principles adapted for blog content.

### Voice and Tone
- **Conversational but professional**: Write like a knowledgeable friend, not overly formal or frivolous
- **Second person for instructions**: Use "you" when giving guidance
- **First person sparingly**: Acceptable for personal stories/experiences, but maintain clarity
- **Active voice**: ✅ "I built this tool" not ⛔ "This tool was built by me"
- **Present tense**: ✅ "Doc Detective validates docs" not ⛔ "Doc Detective will validate docs"

### Language to Avoid
- **No empty modifiers**: Avoid "simply", "just", "easy", "obviously"
- **No exclamation marks**: Except rare, genuinely exciting moments
- **No buzzwords**: Keep language clear and jargon-free
- **No "please"**: ✅ "Click the button" not ⛔ "Please click the button"

### Formatting Standards
- **Sentence case for headings**: "How to test documentation" not "How To Test Documentation"
- **Code elements in backticks**: Reference `functions`, `variables`, `filenames.md`
- **UI elements in bold**: Click the **Save** button
- **Serial commas**: Use Oxford commas in lists
- **Conditions before instructions**: ✅ "To save, click **Save**" not ⛔ "Click **Save** to save"

### Blog Structure Patterns
- **Intro with context**: Start with the problem or motivation
- **"What You'll Learn" sections**: For tutorial-style posts
- **Code blocks with titles**: Use descriptive titles for code examples
- **Practical examples**: Show real-world applications, not abstract concepts
- **Next steps/resources**: End with actionable takeaways

### Markdown/MDX Features

**Admonitions** for important callouts:
```markdown
:::info
This feature requires Doc Detective v2.0 or later.
:::

:::warning
Make sure to test in a staging environment first.
:::

:::tip[Pro tip]
Use JSON schema validation to catch configuration errors early.
:::
```

**Code blocks with context**:
````markdown
```json title="test-spec.json"
{
  "tests": [
    { "id": "homepage-test" }
  ]
}
```
````

**Tabs for alternatives** (import from `@theme/Tabs` and `@theme/TabItem`):
```mdx
<Tabs>
  <TabItem value='npm' label='npm'>
    ```bash
    npm install doc-detective
    ```
  </TabItem>
  <TabItem value='yarn' label='Yarn'>
    ```bash
    yarn add doc-detective
    ```
  </TabItem>
</Tabs>
```

## Common Tasks

### Update Portfolio Cards
Edit `portfolioItems` array in `src/pages/portfolio.tsx`:
```tsx
const portfolioItems = [
  {
    title: "Project Name",
    description: "Description text",
    link: "/path-or-url",
    linkText: "Button Text",
    icon: "📖",
    featured: true,        // Optional: highlighted style
    external: true         // Optional: opens in new tab
  }
];
```

### Modify Hero Section
Hero content is in `HomepageHeader()` function in `portfolio.tsx`:
- Bio text, CTA buttons, social links
- Hero image path: `/img/manny-silva.jpg`
- Styles in `portfolio.module.css` (`.heroBanner`, `.heroContent`, etc.)

### Add Navigation Items
In `docusaurus.config.ts` → `themeConfig.navbar.items`:
```typescript
{to: '/page-slug', label: 'Label', position: 'left'}  // Internal
{href: 'https://...', label: 'Label', position: 'right'}  // External
```

## Content Testing Philosophy

While this portfolio site doesn't implement Doc Detective testing (unlike doc-detective.com), the content reflects a "docs-as-tests" philosophy:

- **Validate claims**: If writing about a tool feature, verify it works before publishing
- **Keep examples current**: Code snippets should reflect actual implementation
- **Test external links**: Ensure referenced resources are still accessible
- **Screenshot accuracy**: If adding images, confirm they match current UI

When writing about documentation testing concepts:
- Draw from real experience at Skyflow, Apple, Google
- Provide practical, reproducible examples
- Explain the "why" behind testing strategies, not just the "how"

## Static Assets

- **Images**: Place in `static/img/` (referenced as `/img/filename.jpg`)
- **Favicon**: `static/img/favicon.ico`
- **Logo**: `static/img/logo.svg`

## SEO & Meta

- **Site title**: Set in `docusaurus.config.ts` (used in page titles)
- **Page-specific**: Use `<Layout title="..." description="...">` props
- **Social card**: `themeConfig.image` (default OG image)

## Deployment Notes

- **Platform**: Configured for www.instructionmanuel.com
- **Build output**: `/build` directory (static files)
- **GitHub Pages**: Settings in config (`organizationName`, `projectName`)
- **Deploy command**: `npm run deploy` (uses Docusaurus deploy)

## Accessibility

- Focus states defined in `custom.css` (2px outline)
- Semantic HTML in markdown pages
- Alt text on hero image and icons
- ARIA-friendly Docusaurus theme components

## Future Compatibility

- `future: { v4: true }` enabled for Docusaurus v4 migration
- React 19 compatible
- Node >=20.0 required (see `package.json` engines)
