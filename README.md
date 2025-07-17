# 📚 WordWise - Intelligent Dictionary App

WordWise is a modern dictionary web application built with Next.js, TypeScript, and Tailwind CSS. It offers a fast and elegant search experience with audio pronunciation, search history, and complete light/dark theme support.

## ✨ Key Features

### 🔍 **Smart Search**

- Instant word search with robust validation
- Error handling with informative messages
- Automatic suggestions and corrections
- Support for words with spaces, hyphens, and apostrophes

### 📖 **Complete Definitions**

- Detailed definitions with usage examples
- Multiple meanings per word
- Synonyms and antonyms
- Clearly identified parts of speech

### 🔊 **Audio Pronunciation**

- Pronunciation playback when available
- Phonetic transcription
- Intuitive audio controls
- Support for multiple pronunciation variants

### 🎨 **Visual Customization**

- **Themes**: Light and dark mode with automatic system detection
- **Fonts**: Serif, Sans Serif, and Monospace
- **Responsive**: Adaptive design for desktop, tablet, and mobile
- **Animations**: Smooth transitions and loading states

### 📝 **Search History**

- Persistent history with date and time
- Success/failure indicators for searches
- Quick search from history
- Option to clear history

### ⚡ **Technical Features**

- Server-side rendering (SSR)
- Progressive hydration
- Performance optimization
- Complete accessibility (ARIA)
- Hover and focus states

## 🛠️ Technologies Used

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React 19](https://react.dev/)** - UI library

### State and Data

- **[Zustand](https://github.com/pmndrs/zustand)** - State management with persistence
- **[Dictionary API](https://dictionaryapi.dev/)** - Free dictionary API

### Tools

- **[Lucide React](https://lucide.dev/)** - Modern icons
- **[Google Fonts](https://fonts.google.com/)** - Web fonts (Inter, Lora, JetBrains Mono)
- **[ESLint](https://eslint.org/)** - Code linting
- **[Yarn](https://yarnpkg.com/)** - Package manager

## 🚀 Installation

### Prerequisites

- Node.js 18.0 or higher
- Yarn (recommended) or npm

### Clone the Repository

```bash
git clone https://github.com/your-username/wordwise.git
cd wordwise
```

### Install Dependencies

```bash
yarn install
# or
npm install
```

### Run in Development

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
yarn build
yarn start
# or
npm run build
npm start
```

## 💡 Usage

### Basic Search

1. Enter a word in the search field
2. Press Enter or click "Search"
3. Explore definitions, examples, and synonyms

### Change Theme

- Click the moon/sun icon in the header
- Or let it automatically adjust according to your system

### Change Font

- Select between Serif, Sans Serif, or Mono in the header dropdown

### Play Audio

- Click the "Play" button next to the pronunciation
- Audio plays automatically when available

### Access History

- Click the history icon in the header
- Select any previous search to repeat it

## 📁 Project Structure

```
wordwise/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Main layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Header with controls
│   ├── SearchInput.tsx    # Search field
│   ├── WordDefinition.tsx # Display definitions
│   ├── AudioPlayer.tsx    # Audio player
│   ├── SearchHistory.tsx  # History modal
│   └── ThemeProvider.tsx  # Theme provider
├── store/                 # Global state
│   └── useStore.ts        # Zustand store
├── types/                 # TypeScript types
│   └── dictionary.ts      # API types
└── public/               # Static assets
```

## 🌐 API Used

**[Free Dictionary API](https://dictionaryapi.dev/)**

- Endpoint: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- Free and no authentication required
- JSON format responses
- Includes audio, phonetics, and examples

## 🔧 Development

### Available Scripts

```bash
yarn dev          # Development server
yarn build        # Build for production
yarn start        # Run production build
yarn lint         # Run ESLint
```

### Implemented Features

- ✅ Word search with validation
- ✅ Complete definition display
- ✅ Audio playback
- ✅ Persistent search history
- ✅ Font selection
- ✅ Fully responsive design
- ✅ Robust input validation
- ✅ Loading and error states
- ✅ Complete accessibility

### Quality Features

- **TypeScript**: Complete static typing
- **Responsive**: Works on all devices
- **Accessible**: Meets WCAG standards
- **Performant**: Optimized for speed
- **Maintainable**: Clean and documented code
