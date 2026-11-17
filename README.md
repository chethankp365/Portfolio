# CHETHAN KUMAR // PORTFOLIO & ZER0 AI ASSISTANT

A high-performance, cybersecurity-themed personal portfolio and terminal environment built for **Chethan Kumar** — final-year Computer Science and Design Engineering student at Atria Institute of Technology, Bengaluru (VTU, CGPA 7.8), aspiring ethical hacker, cyber-range builder, and offensive security researcher.

Featuring **ZER0**, an autonomous, white-hat AI companion powered by a multi-provider fallback engine (Gemini, Groq, OpenRouter, Mistral, Cerebras, and Hugging Face) with live streaming, voice recognition with real-time audio waveforms, speech synthesis, and structured UI actions.

---

## ⚡ Tech Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19, TypeScript strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom cyberpunk theme tokens (`#05080A` background, `#00FF9C` neon green, `#00E5FF` cyan, `#FF3B6B` pink-red)
- **Visuals**: Low-overhead Matrix rain canvas, scanlines overlay, cut-corner clipped cards, glitch/decode text reveal, 3D tilt card
- **AI Core**: Multi-provider fallback engine with automatic rotation, rate limiting (Upstash Redis + in-memory fallback), Zod validation, and structured action execution
- **Testing**: [Vitest](https://vitest.dev/) unit test suite covering actions, validation, rate limiting, and provider fallback
- **Accessibility & SEO**: Semantic HTML, ARIA live regions, `prefers-reduced-motion` compliance, Open Graph image generation, and JSON-LD Person schema

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js**: v20 or higher (v24 recommended)
- **npm**: v10 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
MISTRAL_API_KEY=your_mistral_api_key
CEREBRAS_API_KEY=your_cerebras_api_key

# Optional: Upstash Redis for distributed rate limiting across serverless instances
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```
> **Note**: Any provider key left empty will be automatically bypassed. The engine automatically rotates across all configured keys and seamlessly falls back on error or rate-limit (429).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

---

## 🤖 ZER0 AI Assistant & Multi-Provider Architecture

ZER0 is located in `src/components/ZeroAssistant.tsx` and communicates with the backend route handler `POST /api/chat`.

### Features
1. **Multi-Provider Fallback**: Round-robins across configured providers to spread free-tier quotas. If provider #1 encounters rate limits (HTTP 429) or timeouts (10s), it enters a 60-second cooldown and automatically falls back to provider #2, #3, etc.
2. **Safe Action Protocol**: ZER0 can execute actions on the site:
   - `scroll`: Smooth-scrolls to `#about`, `#experience`, `#projects`, `#skills`, or `#connect`.
   - `project`: Automatically expands the project list, scrolls to the card, and highlights it with a neon pulse.
   - `download_cv`: Triggers the direct download of `Chethan_Kumar_CV.pdf`.
3. **Voice Input & Waveform**: Web Speech API (`webkitSpeechRecognition`) coupled with Web Audio API `AnalyserNode` to render a live frequency waveform as you speak.
4. **Speech Synthesis**: Optional voice replies using `window.speechSynthesis` (defaults to muted, remembers preference in `localStorage`).
5. **Security Guardrails**: Rejects prompt injection attempts, malware requests, and unauthorized exploitation queries in-character. Bound strictly to the verified knowledge object in `src/data/profile.ts`.

### How to Add or Swap an AI Provider
All providers implement the `AIProvider` interface in `src/lib/ai/types.ts`:
```ts
export interface AIProvider {
  name: string;
  isConfigured: () => boolean;
  stream: (messages: ChatMessage[], systemPrompt: string, signal?: AbortSignal) => Promise<AsyncIterable<string>>;
}
```
To register or reorder providers, update `createDefaultProviders()` in `src/lib/ai/registry.ts`. All OpenAI-compatible APIs (Groq, OpenRouter, Mistral, Cerebras, Together, DeepSeek) share `OpenAICompatibleProvider`.

---

## 📁 Content Management (No Component Edits Required)

All text, project details, experience records, and skills are isolated in typed data files under `src/data/`:

| File | Purpose |
|------|---------|
| `src/data/profile.ts` | Hero name, pitch, whoami bio, status line, social links, animated counter targets, and ZER0 knowledge base source of truth |
| `src/data/projects.ts` | All 8 project cards: `slug`, `title`, `tagline`, `bullets[]`, `stack[]`, `liveUrl`, `githubUrl`, `featured` |
| `src/data/experience.ts` | Cynaris Solutions (CURRENT), CodSoft, Rotaract Club, Education, and Certifications |
| `src/data/skills.ts` | 6 grouped technical categories with terminal commands, descriptions, and skill chips |

### Updating Project Links
In `src/data/projects.ts`, fill in `liveUrl` and `githubUrl`:
```ts
{
  slug: "no-entry",
  title: "NO ENTRY",
  ...
  liveUrl: "https://your-demo-url.com",    // Leave empty "" to hide button
  githubUrl: "https://github.com/chethankp365/no-entry"
}
```
Buttons automatically hide when the URL string is empty.

---

## 🧪 Testing & Verification

Run the test suite and production build verification:

```bash
# Run 17 unit tests with Vitest (actions, validation, rate limiting, provider fallback)
npm test

# Run ESLint check (zero errors & warnings)
npm run lint

# Production build verification (checks TypeScript and route generation)
npm run build
```

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete portfolio & ZER0 AI engine"
   git branch -M main
   git remote add origin https://github.com/chethankp365/portfolio.git
   git push -u origin main
   ```
2. Navigate to [Vercel](https://vercel.com/) and click **Add New... > Project**.
3. Select your GitHub repository `portfolio`.
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - `OPENROUTER_API_KEY`
   - `MISTRAL_API_KEY` (optional)
   - `CEREBRAS_API_KEY` (optional)
   - `UPSTASH_REDIS_REST_URL` (optional)
   - `UPSTASH_REDIS_REST_TOKEN` (optional)
5. Click **Deploy**. Vercel will build the Next.js App Router application and deploy it globally on the edge network.

---

## 🔒 Security & Privacy Notice

- **No Personal Identifiers Exposed**: Phone numbers and residential addresses are omitted from all copy, source code, and knowledge bases.
- **Client IP Rate Limiting**: Enforced per-IP (12 req/min and 60 req/hr) returning HTTP 429.
- **Same-Origin Verification**: Rejects cross-origin API abuse via `Origin` and `Host` validation.
- **Prompt Injection Defense**: Untrusted user inputs attempting to bypass boundaries are intercepted and answered in-character by ZER0.
- **Git Protection**: `.env.local` and all `.env*` files are strictly excluded via `.gitignore`.
