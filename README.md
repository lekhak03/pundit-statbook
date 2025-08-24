

# Pundit Statbook

A modern, minimalist football analytics dashboard built with Next.js and TypeScript. Visualize and compare player stats across positions with interactive charts and a clean UI.

## Live Demo

The site is live at: [https://pundit-statbook.vercel.app/](https://pundit-statbook.vercel.app/)

## Features
- Role-based pages for Defenders, Forwards, Midfielders, and Goalkeepers
- Interactive radar charts for player and system metrics
- Responsive, dark-themed design with theme toggle
- Modular React components for UI and data visualization
- Fast, server-side rendering with Next.js

## Project Structure
```
├── app/                  # Next.js app directory (pages, layouts, role-based folders)
│   ├── defenders/
│   ├── forwards/
│   ├── goalkeepers/
│   ├── midfielders/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/           # Reusable React components
│   ├── metrics-grid.tsx
│   ├── player-stats-grid.tsx
│   ├── radar-chart.tsx
│   ├── status-indicator.tsx
│   ├── system-radar-chart.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/                  # Utility and data logic
│   ├── player-data.ts
│   └── utils.ts
├── public/               # Static assets (images, logos)
├── styles/               # Global styles
│   └── globals.css
├── package.json, tsconfig.json, next.config.mjs, etc.
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation
1. Clone the repository:
	```bash
	git clone https://github.com/Deep03/pundit-statbook.git
	cd pundit-statbook
	```
2. Install dependencies:
	```bash
	pnpm install
	# or
	npm install
	```
3. Run the development server:
	```bash
	pnpm dev
	# or
	npm run dev
	```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Browse by position (Defenders, Forwards, Midfielders, Goalkeepers)
- View player stats and compare metrics visually
- Toggle between light and dark themes

## Customization
- Add or modify components in `components/`
- Update data logic in `lib/`
- Change styles in `styles/globals.css` or `app/globals.css`

## Credits
- Built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- UI inspired by modern sports analytics dashboards

## License
MIT
