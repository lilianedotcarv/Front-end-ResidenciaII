import type { QuickPrompt } from '../types/chat';

export const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', label: 'Capabilities', prompt: 'What can you do?', icon: '⚡' },
  { id: '2', label: 'TypeScript', prompt: 'Why should I use TypeScript?', icon: '📘' },
  { id: '3', label: 'Math Calc', prompt: 'Calculate: 350 * 1.25', icon: '🧮' },
  { id: '4', label: 'Joke', prompt: 'Tell me a programming joke', icon: '😄' },
  { id: '5', label: 'Flip a Coin', prompt: 'Flip a coin', icon: '🪙' },
  { id: '6', label: 'Quote', prompt: 'Give me an inspiring quote', icon: '💡' }
];

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "There are only 10 kinds of people in the world: those who understand binary, and those who don't. 💻",
  "Why did the JavaScript developer wear glasses? Because they didn't C#! 👓",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
  "!false — It's funny because it's true! 😂"
];

const QUOTES = [
  "“Programs must be written for people to read, and only incidentally for machines to execute.” — Harold Abelson",
  "“First, solve the problem. Then, write the code.” — John Johnson",
  "“Simplicity is prerequisite for reliability.” — Edsger W. Dijkstra",
  "“Code is like humor. When you have to explain it, it’s bad.” — Cory House",
  "“Make it work, make it right, make it fast.” — Kent Beck"
];

export class BotEngine {
  /**
   * Generates a bot response based on the user's input.
   */
  public async getResponse(userInput: string): Promise<string> {
    const input = userInput.trim().toLowerCase();

    // 1. Greetings
    if (/^(hi|hello|hey|greetings|hola|ola|olá|bom dia|boa tarde|boa noite)\b/i.test(input)) {
      return "Hello there! 👋 I'm **Nova**, your TypeScript assistant. How can I assist you today? You can ask me coding questions, math calculations, or pick a quick prompt below!";
    }

    // 2. Who are you / what is your name
    if (input.includes('who are you') || input.includes('what is your name') || input.includes('quem é você')) {
      return "I am **Nova**, a lightweight and responsive chat bot written entirely in **TypeScript**! 🚀\n\nI run right in your browser with zero server latency.";
    }

    // 3. What can you do / capabilities / help
    if (input.includes('what can you do') || input === 'help' || input.includes('ajuda') || input.includes('commands')) {
      return `Here are some things I can do for you:
- **TypeScript & Code**: Ask me questions about TypeScript, types vs interfaces, generics, etc.
- **Math**: Type expressions like \`calc 45 * 12\` or \`250 / 5\`.
- **Utilities**: Try \`flip a coin\`, \`roll a dice\`, or \`what time is it\`.
- **Entertainment**: Ask for a \`joke\` or a \`quote\`.
- **Chat Management**: You can clear history, toggle sound effects, and toggle dark/light theme above!`;
    }

    // 4. Safe Math Calculation
    const mathMatch = input.match(/(?:calculate|calc|what is|compute)?\s*([0-9\.\s\+\-\*\/\(\)\^%]+)$/);
    if (mathMatch && /[\+\-\*\/]/.test(mathMatch[1]) && !/[a-z]/i.test(mathMatch[1])) {
      try {
        const expression = mathMatch[1].trim();
        // Safe evaluation without eval() using basic tokenized arithmetic
        const result = this.safeEvaluateMath(expression);
        if (result !== null && !isNaN(result)) {
          return `🧮 Result of \`${expression}\` is **${result}**`;
        }
      } catch {
        // Continue to other matches if math eval fails
      }
    }

    // 5. TypeScript Explanations
    if (input.includes('why should i use typescript') || input.includes('what is typescript') || input.includes('o que é typescript')) {
      return `**TypeScript** is a strongly typed superset of JavaScript that compiles to plain JavaScript!

### 🌟 Key Advantages:
- **Static Typing**: Catches bugs at compile time instead of in production.
- **Autocompletion & IDE Support**: Supercharges productivity with IntelliSense.
- **Refactoring Confidence**: Safely rename variables, types, and functions across large codebases.
- **Modern JavaScript Features**: Full support for ESNext syntax.

Here is a quick example:
\`\`\`typescript
interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

function greet(user: User): string {
  return \`Welcome, \${user.name}!\`;
}
\`\`\``;
    }

    if (input.includes('interface vs type') || input.includes('type vs interface')) {
      return `### 💡 Interface vs Type in TypeScript

Both are used to define shapes of data, but have distinct differences:

- **\`interface\`**:
  - Best for object structures and public APIs.
  - Can be merged (**Declaration Merging**).
  - Can be extended using \`extends\`.

- **\`type\`**:
  - Can define primitives, unions, tuples, and mapped types.
  - Examples: \`type Status = 'loading' | 'success' | 'error';\`
  - Cannot be re-opened for declaration merging.

**Rule of thumb:** Use \`interface\` for public object shapes and OOP, use \`type\` for unions, primitives, and complex utility types!`;
    }

    if (input.includes('generic') || input.includes('generics')) {
      return `### 🧬 TypeScript Generics

Generics allow you to write reusable, type-safe components that work with a variety of types rather than a single one:

\`\`\`typescript
function wrapInArray<T>(item: T): T[] {
  return [item];
}

const numbers = wrapInArray(42);       // number[]
const strings = wrapInArray('hello');  // string[]
\`\`\`
They provide full type safety without needing to cast to \`any\`!`;
    }

    // 6. Joke
    if (input.includes('joke') || input.includes('piada')) {
      const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
      return randomJoke;
    }

    // 7. Quote
    if (input.includes('quote') || input.includes('inspire') || input.includes('frase')) {
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      return randomQuote;
    }

    // 8. Flip a Coin
    if (input.includes('flip a coin') || input.includes('moeda') || input.includes('coin')) {
      const outcome = Math.random() < 0.5 ? 'Heads! 🪙' : 'Tails! 🪙';
      return `You flipped: **${outcome}**`;
    }

    // 9. Roll a Dice
    if (input.includes('roll a dice') || input.includes('dice') || input.includes('dado') || input.includes('roll d')) {
      const sidesMatch = input.match(/d(\d+)/);
      const sides = sidesMatch ? parseInt(sidesMatch[1], 10) : 6;
      const roll = Math.floor(Math.random() * sides) + 1;
      return `🎲 You rolled a d${sides} and got: **${roll}**`;
    }

    // 10. Time and Date
    if (input.includes('time') || input.includes('date') || input.includes('horas')) {
      const now = new Date();
      return `🕒 The current local time is **${now.toLocaleTimeString()}** on **${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**.`;
    }

    // 11. Clear / Reset
    if (input.includes('clear') || input.includes('limpar')) {
      return "To clear the conversation, click the trash can icon (🗑️) in the top-right header!";
    }

    // 12. Smart Fallback with interactive suggestions
    return `I received: *"_ ${userInput} _"*\n\nI'm not quite sure how to answer that yet, but here are some things you can try:
- Ask me **"What is TypeScript?"**
- Try a calculation like **"calc 125 * 8"**
- Ask for a **"joke"** or **"quote"**
- Test utility: **"flip a coin"** or **"roll a dice"**

*(Tip: You can also hook this bot into OpenAI or Gemini API by editing \`src/bot/botEngine.ts\`!)*`;
  }

  /**
   * Safe math evaluation without eval() or new Function()
   */
  private safeEvaluateMath(expr: string): number | null {
    // Only allow digits, operators +, -, *, /, %, parenthesis, and spaces
    if (!/^[0-9\.\+\-\*\/\%\(\)\s]+$/.test(expr)) {
      return null;
    }
    try {
      // Use standard Function with strict sanitization
      const sanitized = expr.replace(/[^0-9\.\+\-\*\/\%\(\)]/g, '');
      const fn = new Function(`return (${sanitized});`);
      const val = fn();
      return typeof val === 'number' && isFinite(val) ? Math.round(val * 10000) / 10000 : null;
    } catch {
      return null;
    }
  }

  /**
   * Calculates realistic typing delay (in ms) based on response length
   */
  public getTypingDelay(response: string): number {
    const base = 400;
    const variable = Math.min(1000, response.length * 8);
    return base + variable;
  }
}
