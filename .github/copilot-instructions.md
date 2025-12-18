# Project Context & Architecture
- **Stack**: React 19, Vite, TypeScript.
- **Styling**: Tailwind CSS (loaded via CDN in `index.html`, NOT via npm/PostCSS).
- **AI Engine**: Google GenAI SDK (`@google/genai`) using `gemini-3-flash-preview`.
- **PDF Processing**: Uses `pdf.js` via CDN (`window.pdfjsLib`), NOT via npm import.

# Core Components & Data Flow
- **Entry Point**: `App.tsx` manages global state (`questions`, `darkMode`, `isLoading`).
- **Folder Structure**:
  - `pages/` — Mỗi trang một folder riêng (ví dụ: `pages/QuizView/QuizView.tsx`).
  - `components/` — Components dùng chung (InputSection, etc.).
  - `services/` — Logic gọi API (gemini.ts).
- **Tách component**: Luôn tách trang thành các component nhỏ riêng biệt trong cùng folder (ví dụ: `pages/QuizView/ProgressBar.tsx`, `pages/QuizView/QuestionCard.tsx`). KHÔNG viết tất cả vào một file.
- **Data Flow**: 
  1. User inputs text/PDF in `components/InputSection.tsx`.
  2. `App.tsx` calls `services/gemini.ts`.
  3. `gemini.ts` prompts Google AI to return JSON.
  4. `pages/QuizView/QuizView.tsx` renders the interactive quiz.
- **State Management**: Local React state (`useState`). No global store (Redux/Zustand).

# Critical Developer Workflows
- **Environment Setup**: 
  - Create `.env` with `GEMINI_API_KEY`.
  - `vite.config.ts` maps this to `process.env.API_KEY` (unusual for Vite, but configured via `define`).
  - **Security**: Tuyệt đối bảo mật API Key. KHÔNG BAO GIỜ hardcode key vào file source code hoặc commit file `.env` lên git. Luôn sử dụng biến môi trường.
- **PDF Parsing**:
  - Do NOT import `pdfjs-dist`.
  - Access via `window.pdfjsLib` (types require `@ts-ignore` or global declaration).
  - Logic resides in `InputSection.tsx`.

# Project-Specific Conventions
- **UI/Design System**: "Industrial/Geometric" aesthetic.
  - Colors: Heavily relies on `zinc-900` (dark) and `zinc-100` (light).
  - Typography: Uppercase, `tracking-widest`, `font-black`, `font-mono` for labels.
  - Borders: Sharp corners (`rounded-none` or small radius), thick borders (`border-2`, `border-4`).
  - Shadows: Hard shadows (`sharp-shadow` class or custom box-shadow).
- **AI Prompting (`services/gemini.ts`)**:
  - **Language**: Strictly Vietnamese.
  - **Kanji Handling**: Must request Hiragana in brackets `[hiragana]` after Kanji. NO Furigana/HTML tags.
  - **Output Format**: Strict JSON array of `Question` objects.
- **Unused Code**: `components/FileImporter.tsx` appears to be legacy/unused. Prefer `InputSection.tsx`.

# Code Style
- **Ưu tiên đơn giản**: Viết code dễ đọc, dễ hiểu cho người mới học.
- **Tránh hàm phức tạp**: Không dùng `reduce`, `flatMap`, hoặc chuỗi method dài. Ưu tiên `for` loop và `if/else` rõ ràng.
- **Biến có tên rõ nghĩa**: Đặt tên biến mô tả mục đích (ví dụ: `questionList` thay vì `ql`).
- **Tách logic nhỏ**: Mỗi hàm chỉ làm một việc, dễ theo dõi từng bước.

# Common Patterns
- **Dark Mode**: Toggled via `dark` class on `<html>` element (handled in `App.tsx`).
- **Error Handling**: Simple `alert()` or local state error messages.
- **Type Definitions**: Centralized in `types.ts`. Always use `Question` interface.
