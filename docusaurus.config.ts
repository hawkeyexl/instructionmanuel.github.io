import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Instruction Manuel',
  tagline: 'Technical Writer & Engineer',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://www.instructionmanuel.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'hawkeyexl', // Usually your GitHub org/user name.
  projectName: 'instructionmanuel.github.io', // Usually your repo name.
  trailingSlash: false, // Remove trailing slashes from URLs

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false, // Disable docs
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          blogTitle: 'Manny Silva\'s Blog',
          blogDescription: 'Thoughts on technical writing, documentation, and engineering',
          routeBasePath: '/', // Blog is now the main entry point
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Instruction Manuel',
      logo: {
        alt: 'Instruction Manuel',
        src: 'img/logo.png',
      },
      items: [
        {to: '/', label: 'Home', position: 'left'},
        {to: '/portfolio', label: 'Portfolio', position: 'left'},
        {to: '/books/docs-as-tests', label: 'Book', position: 'left'},
        {to: '/doc-detective', label: 'Doc Detective', position: 'left'},
        {to: '/talks', label: 'Talks', position: 'left'},
        {
          href: 'https://github.com/hawkeyexl',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.linkedin.com/in/manuelrbsilva',
          label: 'LinkedIn',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Work',
          items: [
            {
              label: 'Portfolio',
              to: '/portfolio',
            },
            {
              label: 'Docs as Tests Book',
              to: '/books/docs-as-tests',
            },
            {
              label: 'Doc Detective',
              to: '/doc-detective',
            },
            {
              label: 'Talks',
              to: '/talks',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/manuelrbsilva',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/hawkeyexl',
            },
            {
              label: 'Docs as Tests Blog',
              href: 'https://www.docsastests.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Doc Detective Website',
              href: 'https://doc-detective.com',
            },
            {
              label: 'Doc Detective GitHub',
              href: 'https://github.com/doc-detective/doc-detective',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Manny Silva. | Part of the <a href="https://caseyrfsmith.github.io/webring/">tech writing webring</a>.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
