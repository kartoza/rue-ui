# rue-ui

A modern, standardized React application built with **Vite**, **TypeScript**, and **ESLint**.

## 🚀 Features

- ⚡️ **Vite** - Next generation frontend tooling for fast development
- ⚛️ **React 19** - Latest version of React with modern features
- 🔷 **TypeScript** - Type-safe code for better developer experience
- 🎨 **Chakra UI** - theming (custom theme in src/theme/Theme.tsx)
- 💅 **Prettier** - Consistent code formatting
- 🧪 **Vitest + Testing Library** setup

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

## 🛠️ Getting Started

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/kartoza/rue-ui.git

# Navigate to the project directory
cd rue-ui

# Install dependencies
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly

## Test

- `npm test` - run Vitest once
- `npm run test:watch` - watch mode
- `npm run coverage` - if configured in vitest

## 📁 Project Structure

```
rue-ui/
├── public/                          # Static assets served as-is
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/                  # Reusable UI blocks (each folder = one component)
│   │   └── NavBar/                  # Example component structure
│   │       ├── NavBar.tsx           # component implementation
│   │       ├── NavBar.test.tsx      # component unit tests
│   │       └── style.scss           # component-scoped styles
│   ├── pages/                       # Route-level views (compose components)
│   │   ├── About/
│   │   │   ├── About.tsx            # page implementation
│   │   │   └── style.scss           # page-scoped styles
│   │   ├── Index/                    # (reserved for Index page files)
│   ├── test/
│   │   ├── render.tsx               # RTL render wrapper (Chakra + Router)
│   │   └── setup.ts                 # Vitest setup (JSDOM config, mocks, etc.)
│   ├── theme/
│   │   ├── Button.tsx               # Example themed component
│   │   └── Theme.tsx                # Chakra theme config
│   ├── index.css                    # Global (Vite) CSS
│   ├── main.tsx                     # App entry
│   ├── reportWebVitals.tsx          # Web vitals (optional)
│   ├── routes.tsx                   # App routes
│   └── styles.scss                  # Global SCSS
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuration

### TypeScript

TypeScript is configured with strict mode enabled. Configuration files:

- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.app.json` - App-specific TypeScript configuration
- `tsconfig.node.json` - Node-specific TypeScript configuration

### ESLint

ESLint is configured with recommended rules for React and TypeScript. See `eslint.config.js` for details.

### Prettier

Code formatting is handled by Prettier with sensible defaults. See `.prettierrc` for configuration.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and formatting (`npm run lint:fix && npm run format`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by [React](https://react.dev/)
- Type-safe with [TypeScript](https://www.typescriptlang.org/)
