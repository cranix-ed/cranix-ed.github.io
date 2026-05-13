// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
	site: 'https://example.com',
	integrations: [
		expressiveCode({
			themes: ['github-light', 'github-dark'],
			defaultProps: {
				theme: 'auto',
				wrap: true,
				showLineNumbers: true,
			},
			styleOverrides: {
				codeFontSize: '0.875rem',
				codeFontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
				codeLineHeight: '1.7142857em',
				borderRadius: '0.5rem',
				frameBorderWidth: '1px',
				frameShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
				containerPaddingBlock: '0.75rem',
				containerPaddingInline: '1rem',
				lineNumberMarginInline: '1rem',
				lineNumberWidth: '2rem',
			},
			frames: {
				showCopyButton: true,
				showLanguageBadge: true,
			},
		}),
		mdx(),
		sitemap(),
	],
	markdown: {},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{ src: ['./src/assets/fonts/atkinson-regular.woff'], weight: 400, style: 'normal', display: 'swap' },
					{ src: ['./src/assets/fonts/atkinson-bold.woff'], weight: 700, style: 'normal', display: 'swap' },
				],
			},
		},
	],
});
