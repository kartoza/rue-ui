# rue-ui

A modern, standardized React application built with **Vite**, **TypeScript**, and **ESLint**.

## 🚀 Features

- ⚡️ **Vite** - Next generation frontend tooling for fast development
- ⚛️ **React 19** - Latest version of React with modern features
- 🔷 **TypeScript** - Type-safe code for better developer experience
- 🎨 **ESLint** - Code linting with React-specific rules
- 💅 **Prettier** - Consistent code formatting
- 🏗️ **Modern Build Setup** - Optimized production builds

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

## 📁 Project Structure

```
rue-ui/
├── public/           # Static assets
├── src/              # Source files
│   ├── assets/       # Images, fonts, etc.
│   ├── App.tsx       # Main App component
│   ├── App.css       # App styles
│   ├── main.tsx      # Application entry point
│   └── index.css     # Global styles
├── .eslintrc.js      # ESLint configuration
├── .prettierrc       # Prettier configuration
├── index.html        # HTML entry point
├── package.json      # Project dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite configuration
└── README.md         # Project documentation
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
