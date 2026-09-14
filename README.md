# AegisHub Frontend

Accessible health gateway featuring real-time sign language interpretation, live captioning, and AI-powered dermatological triage. Built for **GatewayHacks 2026 -- Track 1: Accessibility & Health**.

## Overview

AegisHub is a client-side React application that connects to backend AI services to provide three core accessibility and health tools:

| Tool | Route | Input | What it does |
|------|-------|-------|-------------|
| **Sign Language Interpreter** | `/sign-interpreter` | Camera (hand landmarks) | Captures 21-point hand landmarks from the device camera and sends lightweight coordinate data to a classification endpoint. Returns a sign gloss with confidence score and alternatives. No raw video ever leaves the device. |
| **Live Captioner** | `/captioner` | Microphone (speech audio) | Streams audio for real-time speech-to-text transcription. Produces live captions with partial/final utterance states, speaker activity detection, configurable font size, high-contrast mode, and auto-scroll. |
| **Derma-Scan** | `/derma-scan` | Image upload (JPG/PNG/WebP, max 10 MB) | Accepts drag-and-drop or click-to-upload images. Sends a compressed image to an AI analysis endpoint and returns a structured observation with triage tier, plain-language guidance, confidence band, and skin-tone caveat. |

All three tools run in **mock mode** by default, returning simulated data so the UI can be developed and demonstrated without a live backend. Toggle to real API calls by setting `USE_MOCK_API = false` in `src/lib/types/api.ts` and providing `VITE_API_BASE_URL`.

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS 3.4** with custom design tokens (light + dark themes)
- **Vite 6** for fast builds
- **React Router 7** for client-side routing
- **React Dropzone** for image uploads
- **React Helmet Async** for SEO / page metadata

## Getting Started

### Prerequisites

- Node.js 18+ (recommended 20+)

### Install

```bash
git clone https://github.com/AegisHub-Gateway/aegishub-frontend.git
cd aegishub-frontend
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `""` (empty) | Base URL of the AegisHub backend API. When empty, mock data is used. |

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=https://your-api.example.com
```

## Architecture

```
src/
  App.tsx                    # Route definitions
  main.tsx                   # Entry point (providers: Theme > Auth > Helmet)

  context/
    AuthContext.tsx           # Client-side auth (localStorage), sign in / sign out / profile
    SidebarContext.tsx        # Sidebar open/close state
    ThemeContext.tsx           # Light/dark theme via localStorage

  layout/
    AppLayout.tsx             # App shell: sidebar + header + content outlet
    AppSidebar.tsx            # Sidebar navigation with workspace + system links
    AppHeader.tsx             # Sticky header with mobile menu, theme toggle, avatar

  pages/
    Home/                     # Marketing homepage (hero, tools, data flow, FAQ, footer)
    Dashboard/                # Authenticated dashboard with tool cards + recent activity
    SignInterpreter/          # Camera + hand landmarks + classify workflow
    Captioner/                # Microphone + live caption streaming
    DermaScan/                # Image upload + analysis + results display
    History/                  # Session history with detail modals
    Settings/                 # Theme, accessibility, privacy, app info
    Help/                     # Emergency info, AI disclaimer, FAQ, support links
    AuthPages/                # Sign in, sign up, profile setup wizard
    OtherPage/                # 404 not found

  components/
    aegis/                    # Reusable AegisHub components
      CameraView.tsx          # Camera feed with permission states + overlays
      HandLandmarkOverlay.tsx # Canvas-based 21-point hand landmark visualization
      ScanUpload.tsx          # Drag-and-drop image upload (react-dropzone)
      PermissionState.tsx     # Camera/mic permission denied/unavailable states
      CaptionDisplay.tsx      # Caption display component
      ConfidenceIndicator.tsx # Confidence bar/meter
      EmergencyBanner.tsx     # Medical emergency banner
      EmptyState.tsx          # Empty state placeholder
      InterpretationResult.tsx# Sign interpretation result card
      ModalityCard.tsx        # Tool entry card with status
      SafetyDisclaimer.tsx    # Medical disclaimer (compact + full)
      ScanResult.tsx          # Derma-Scan result display
      SessionStatus.tsx       # Session status indicator
      Spinner.tsx             # Loading spinner

    auth/
      SignInForm.tsx          # Email/password sign-in form
      SignUpForm.tsx          # First/last name + email sign-up form

    common/
      PageMeta.tsx            # Page title/description via react-helmet
      ScrollToTop.tsx         # Scrolls to top on route change

  lib/
    api/
      sign.ts                 # Sign language classification (mock + real)
      caption.ts              # Live caption streaming (mock)
      derma.ts                # Dermatology analysis (mock + real)
    hooks/
      useCamera.ts            # Camera access (getUserMedia)
      useMicrophone.ts        # Microphone access (getUserMedia)
      useHandLandmarks.ts     # Mock hand landmark tracking (21-point MediaPipe topology)
      useGreetingName.ts      # Display name from AuthContext
      useScrollReveal.ts      # IntersectionObserver scroll animation
    types/
      api.ts                  # USE_MOCK_API flag, API_BASE_URL, error/result types
      sign.ts                 # HandFrame, SignClassificationRequest/Response
      caption.ts              # CaptionResponse, CaptionUtterance, CaptionSettings
      derma.ts                # DermaAnalysisResponse, triage types
    utils/
      cn.ts                   # clsx + tailwind-merge utility

  styles/
    tokens.css                # CSS custom properties for light + dark themes
    globals.css               # Font imports, type scale, animations, focus-ring
```

## API Integration

Each tool module (`sign.ts`, `caption.ts`, `derma.ts`) contains both a **mock implementation** and a **real implementation**, gated by `USE_MOCK_API` in `src/lib/types/api.ts`.

### Sign Language Classification

```
POST /v1/sign/classify
Body: { frame: HandFrame, handedness: "left" | "right" }
Response: { gloss: string, confidence: number, alternatives: SignAlternative[] }
```

### Dermatology Analysis

```
POST /v1/derma/analyze
Body: FormData with compressed image
Response: { tier: "low_concern" | "monitor" | "seek_evaluation" | "urgent", guidance: string, confidence_band: string, skin_tone_caveat: string }
```

### Live Captioning

```
Mock only -- streams simulated caption utterances.
```

## Design System

The app uses CSS custom properties defined in `src/styles/tokens.css` to power both light and dark themes. Tailwind is configured to reference these tokens, giving you a consistent design language across the entire UI.

**Typography:**
- Headings: Outfit (Google Fonts)
- Body: Source Serif 4 (Google Fonts)
- Code/Numbers: JetBrains Mono (Google Fonts)

**Key conventions:**
- `.focus-ring` class provides visible focus outlines for keyboard navigation
- `prefers-reduced-motion` collapses all animations
- `aria-*` attributes used throughout for screen readers

## Features

- **Dark mode** with system preference detection and manual toggle
- **Responsive** mobile-first layout with collapsible sidebar
- **Client-side auth** (localStorage) with sign in, sign up, and multi-step profile setup
- **Medical safety disclaimers** displayed prominently on every tool page
- **Camera/mic permission handling** with clear denied/unavailable/unsupported states
- **Hand landmark visualization** rendered on a canvas overlay
- **Image upload** with drag-and-drop, file type validation, and size limits
- **Session history** with filterable entries and detail modals
- **Settings** for theme, accessibility preferences, and privacy info

## Project Structure

```
aegishub-frontend/
  index.html
  vite.config.ts
  tailwind.config.js
  tsconfig.json
  package.json
  public/
    favicon.png
    images/
      error/        # 404 page SVGs
      logo/         # Auth logo
  src/
    ...
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request
