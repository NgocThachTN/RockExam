# RockExam
<img width="1902" height="1079" alt="image" src="https://github.com/user-attachments/assets/2e22539f-9d0f-4095-ab0d-48c516cb35ad" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ae332bbb-ab2e-4fc9-9c0d-5615bdf0ea29" />


## Project Overview
RockExam is a React-based web application designed to generate interactive quizzes using Artificial Intelligence. It leverages Google's Gemini AI to analyze text inputs or PDF documents and create multiple-choice questions. The application is optimized for various learning scenarios, including a specialized mode for Japanese Language Proficiency Test (JLPT) preparation, and features a distinctive industrial/geometric design system with a "Matrix Rain" background effect.

## Project Structure

```
RockExam/
├── components/             # Shared UI components
│   ├── InputSection.tsx    # Main input handling (Text/PDF/Prompt)
│   └── MatrixRain.tsx      # Canvas-based background visual effect
├── pages/                  # Page-level components
│   ├── Home/               # Landing page
│   │   ├── components/     # Home-specific components (Hero, InfoSection)
│   │   ├── Home.css        # Home-specific animations
│   │   └── Home.tsx        # Home container
│   └── QuizView/           # Quiz taking interface
│       ├── components/     # Quiz-specific components (StandardQuestion, ReadingQuestion)
│       └── QuizView.tsx    # Main quiz logic and state
├── services/               # External services and API integration
│   └── gemini.ts           # Google GenAI configuration and prompt logic
├── App.tsx                 # Root component and global layout
├── index.html              # Entry HTML (Tailwind CSS & PDF.js via CDN)
├── index.tsx               # React entry point
├── types.ts                # TypeScript definitions
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

## Technologies Used
- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (loaded via CDN)
- **AI Integration**: Google GenAI SDK (@google/genai)
- **PDF Processing**: PDF.js (loaded via CDN)

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- A Google Gemini API Key

### Installation Steps

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory and add your Google Gemini API Key.
    ```env
    GEMINI_API_KEY=your_google_gemini_api_key_here
    ```
    *Note: The application is configured to read this key via `process.env.API_KEY` in `vite.config.ts`.*

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Build for production**:
    ```bash
    npm run build
    ```

## Key Features

### AI Quiz Generation
The core logic resides in `services/gemini.ts`. It sends prompts to the Gemini model to generate JSON-formatted questions. It includes specific logic for:
- **Smart Sampling**: For large documents, it samples text from the beginning, middle, and end to ensure coverage.
- **JLPT Mode**: Automatically detects Japanese language requests and formats questions for Kanji readings (Mojigoi), Grammar (Bunpou), and Reading Comprehension (Dokkai).
- **Retry Mechanism**: Handles API limits with exponential backoff.

### PDF Parsing
PDF processing is handled client-side in `components/InputSection.tsx` using `window.pdfjsLib`. It extracts text from uploaded files to be used as context for the AI.

### Visual Effects
- **Matrix Rain**: A custom canvas component (`components/MatrixRain.tsx`) that renders falling code characters, adapting colors based on the current theme (Light/Dark mode).
- **Theme System**: Supports Light (Sky Blue) and Dark (Zinc/Black) modes with consistent styling across components.

