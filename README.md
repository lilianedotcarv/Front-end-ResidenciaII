# 🤖 Nova Bot — Visual Simple Chat Bot in TypeScript

A sleek, responsive, and interactive visual chat bot built from scratch using **TypeScript**, **Vite**, and modern **CSS**.

---

## ✨ Features

- **Modern Visual UI**:
  - Responsive chat bubble layout with user and bot avatars.
  - Dark / Light mode toggle (persisted in `localStorage`).
  - Web Audio sound effects (synthesized sounds for sending, receiving, and clearing messages with mute toggle).
  - Animated typing indicator (`Nova is typing...`) with realistic latency.
  - Markdown formatting support: code blocks, inline code, bold, italics, and lists.
  - One-click prompt chips (TypeScript facts, math, jokes, coin flips, quotes).
  - Export chat history as a `.txt` file.
  - Chat persistence via `localStorage`.

- **Pure TypeScript**:
  - Strongly-typed models (`Message`, `QuickPrompt`, `BotConfig`).
  - Modular engine (`BotEngine`) with pattern recognition, safe math evaluation, and knowledge base.
  - Zero external UI framework bloat (lightning-fast load times and lightweight footprint).

---

## 🚀 Quick Start

### 1. Navigate to the project directory:
```bash
cd /home/lillo/Projetos/visual-chatbot
```

### 2. Start the development server:
```bash
npm run dev
```

Then open the local URL in your browser (usually `http://localhost:5173`).

---

## 🛠️ Build for Production

To build the static distribution files:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```
visual-chatbot/
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
├── public/
│   └── favicon.svg         # Bot avatar favicon
└── src/
    ├── main.ts             # Application controller and UI lifecycle
    ├── style.css           # Styling, themes, animations, responsive design
    ├── types/
    │   └── chat.ts         # TypeScript interfaces (Message, QuickPrompt, etc.)
    ├── bot/
    │   └── botEngine.ts    # Chatbot logic, responses, and math evaluator
    └── utils/
        ├── audio.ts        # Web Audio API sound synthesizers
        └── formatter.ts    # Markdown parser & HTML sanitization
```

---

## 🔌 Connecting Real AI (Gemini / OpenAI)

In `src/bot/botEngine.ts`, you can connect to external AI APIs by modifying `getResponse(userInput: string)`. For example, using fetch:

```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer YOUR_API_KEY`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: userInput }]
  })
});
```
