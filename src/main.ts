import './style.css';
import type { Message } from './types/chat';
import { BotEngine, QUICK_PROMPTS } from './bot/botEngine';
import { formatMessageText, formatTime } from './utils/formatter';
import { sounds } from './utils/audio';

class ChatApp {
  private messages: Message[] = [];
  private isTyping: boolean = false;
  private botEngine: BotEngine;
  private currentTheme: 'dark' | 'light' = 'dark';

  // DOM elements
  private appEl!: HTMLElement;
  private messagesContainer!: HTMLElement;
  private chatForm!: HTMLFormElement;
  private chatInput!: HTMLTextAreaElement;
  private sendBtn!: HTMLButtonElement;
  private quickPromptsContainer!: HTMLElement;
  private themeBtn!: HTMLButtonElement;
  private soundBtn!: HTMLButtonElement;
  private exportBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;

  constructor() {
    this.botEngine = new BotEngine();
    this.initTheme();
    this.renderLayout();
    this.bindElements();
    this.loadChatHistory();
    this.bindEvents();
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('nova_theme') as 'dark' | 'light' | null;
    this.currentTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  private toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('nova_theme', this.currentTheme);
    this.updateThemeButtonIcon();
  }

  private updateThemeButtonIcon(): void {
    if (!this.themeBtn) return;
    this.themeBtn.innerHTML = this.currentTheme === 'dark' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    this.themeBtn.title = `Switch to ${this.currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`;
  }

  private toggleSound(): void {
    sounds.enabled = !sounds.enabled;
    localStorage.setItem('nova_sound', String(sounds.enabled));
    this.updateSoundButtonIcon();
  }

  private updateSoundButtonIcon(): void {
    if (!this.soundBtn) return;
    this.soundBtn.innerHTML = sounds.enabled
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    this.soundBtn.title = sounds.enabled ? 'Mute Sounds' : 'Unmute Sounds';
  }

  private renderLayout(): void {
    const savedSound = localStorage.getItem('nova_sound');
    if (savedSound !== null) {
      sounds.enabled = savedSound === 'true';
    }

    this.appEl = document.getElementById('app')!;
    this.appEl.innerHTML = `
      <header class="chat-header">
        <div class="bot-profile">
          <div class="bot-avatar-wrapper">
            <span>🤖</span>
            <span class="status-dot"></span>
          </div>
          <div class="bot-info">
            <h2>Nova Bot <span class="ts-badge">TS</span></h2>
            <p>Smart TypeScript AI Assistant</p>
          </div>
        </div>
        <div class="header-actions">
          <button id="sound-btn" class="icon-btn" aria-label="Toggle sound"></button>
          <button id="theme-btn" class="icon-btn" aria-label="Toggle theme"></button>
          <button id="export-btn" class="icon-btn" title="Export Chat" aria-label="Export chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button id="clear-btn" class="icon-btn" title="Clear Chat" aria-label="Clear chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </header>

      <main id="chat-messages" class="chat-messages" aria-live="polite"></main>

      <section id="quick-prompts" class="quick-prompts-container" aria-label="Quick prompts"></section>

      <footer class="chat-input-area">
        <form id="chat-form" class="input-form">
          <textarea
            id="chat-input"
            class="chat-input"
            placeholder="Type a message, ask a question, or test math..."
            rows="1"
            required
          ></textarea>
          <button type="submit" id="send-btn" class="send-btn" aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div class="input-helper">
          <span>Enter to send, Shift+Enter for new line</span>
          <span id="char-count">0 chars</span>
        </div>
      </footer>
    `;
  }

  private bindElements(): void {
    this.messagesContainer = document.getElementById('chat-messages')!;
    this.chatForm = document.getElementById('chat-form') as HTMLFormElement;
    this.chatInput = document.getElementById('chat-input') as HTMLTextAreaElement;
    this.sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
    this.quickPromptsContainer = document.getElementById('quick-prompts')!;
    this.themeBtn = document.getElementById('theme-btn') as HTMLButtonElement;
    this.soundBtn = document.getElementById('sound-btn') as HTMLButtonElement;
    this.exportBtn = document.getElementById('export-btn') as HTMLButtonElement;
    this.clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;

    this.updateThemeButtonIcon();
    this.updateSoundButtonIcon();
    this.renderQuickPrompts();
  }

  private renderQuickPrompts(): void {
    this.quickPromptsContainer.innerHTML = '';
    QUICK_PROMPTS.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quick-prompt-btn';
      btn.innerHTML = `<span>${item.icon}</span> <span>${item.label}</span>`;
      btn.addEventListener('click', () => {
        if (!this.isTyping) {
          this.handleSendMessage(item.prompt);
        }
      });
      this.quickPromptsContainer.appendChild(btn);
    });
  }

  private bindEvents(): void {
    // Form submit
    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.chatInput.value.trim();
      if (text && !this.isTyping) {
        this.handleSendMessage(text);
      }
    });

    // Keyboard handling in textarea
    this.chatInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = this.chatInput.value.trim();
        if (text && !this.isTyping) {
          this.handleSendMessage(text);
        }
      }
    });

    // Auto-resize textarea & character count
    const charCountEl = document.getElementById('char-count');
    this.chatInput.addEventListener('input', () => {
      this.chatInput.style.height = 'auto';
      this.chatInput.style.height = `${Math.min(this.chatInput.scrollHeight, 120)}px`;
      if (charCountEl) {
        charCountEl.textContent = `${this.chatInput.value.length} chars`;
      }
    });

    // Theme toggle
    this.themeBtn.addEventListener('click', () => this.toggleTheme());

    // Sound toggle
    this.soundBtn.addEventListener('click', () => this.toggleSound());

    // Clear chat
    this.clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the chat history?')) {
        this.clearChat();
      }
    });

    // Export chat
    this.exportBtn.addEventListener('click', () => this.exportChat());
  }

  private loadChatHistory(): void {
    const saved = localStorage.getItem('nova_chat_history');
    if (saved) {
      try {
        this.messages = JSON.parse(saved);
      } catch {
        this.messages = [];
      }
    }

    // Default welcome message if empty
    if (this.messages.length === 0) {
      this.messages.push({
        id: 'welcome-msg',
        sender: 'bot',
        text: `👋 **Welcome to Nova Bot!**\n\nI am a responsive visual chat bot built from scratch with **TypeScript**.\n\nYou can:\n- Ask me questions about TypeScript & JavaScript 💻\n- Calculate math like \`calc 45 * 12\` 🧮\n- Ask for a \`joke\`, \`quote\`, or \`flip a coin\` 🎲\n- Click any prompt button below to get started!`,
        timestamp: Date.now()
      });
      this.saveChatHistory();
    }

    this.renderAllMessages();
  }

  private saveChatHistory(): void {
    localStorage.setItem('nova_chat_history', JSON.stringify(this.messages));
  }

  private renderAllMessages(): void {
    this.messagesContainer.innerHTML = '';
    this.messages.forEach((msg) => this.appendMessageDOM(msg));
    this.scrollToBottom();
  }

  private appendMessageDOM(msg: Message): void {
    const row = document.createElement('div');
    row.className = `message-row ${msg.sender}`;
    row.id = `msg-${msg.id}`;

    const avatar = document.createElement('div');
    avatar.className = `msg-avatar ${msg.sender}`;
    avatar.textContent = msg.sender === 'bot' ? '🤖' : '👤';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'msg-content-wrapper';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = formatMessageText(msg.text);

    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = formatTime(msg.timestamp);

    contentWrapper.appendChild(bubble);
    contentWrapper.appendChild(time);

    row.appendChild(avatar);
    row.appendChild(contentWrapper);

    this.messagesContainer.appendChild(row);
  }

  private showTypingIndicator(): void {
    const existing = document.getElementById('typing-indicator');
    if (existing) return;

    const row = document.createElement('div');
    row.className = 'typing-indicator-row';
    row.id = 'typing-indicator';

    row.innerHTML = `
      <div class="msg-avatar bot">🤖</div>
      <div class="typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;

    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
  }

  private hideTypingIndicator(): void {
    const existing = document.getElementById('typing-indicator');
    if (existing) {
      existing.remove();
    }
  }

  private scrollToBottom(): void {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  private async handleSendMessage(text: string): Promise<void> {
    if (!text || this.isTyping) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'user',
      text: text,
      timestamp: Date.now()
    };

    this.messages.push(userMsg);
    this.appendMessageDOM(userMsg);
    this.saveChatHistory();
    this.scrollToBottom();
    sounds.playSend();

    // Reset input
    this.chatInput.value = '';
    this.chatInput.style.height = 'auto';
    const charCountEl = document.getElementById('char-count');
    if (charCountEl) charCountEl.textContent = '0 chars';

    // 2. Set Typing State
    this.isTyping = true;
    this.sendBtn.disabled = true;
    this.showTypingIndicator();

    try {
      // 3. Compute Response & Delay
      const response = await this.botEngine.getResponse(text);
      const delay = this.botEngine.getTypingDelay(response);

      setTimeout(() => {
        this.hideTypingIndicator();

        const botMsg: Message = {
          id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          sender: 'bot',
          text: response,
          timestamp: Date.now()
        };

        this.messages.push(botMsg);
        this.appendMessageDOM(botMsg);
        this.saveChatHistory();
        this.scrollToBottom();
        sounds.playReceive();

        this.isTyping = false;
        this.sendBtn.disabled = false;
        this.chatInput.focus();
      }, delay);
    } catch {
      this.hideTypingIndicator();
      this.isTyping = false;
      this.sendBtn.disabled = false;
    }
  }

  private clearChat(): void {
    this.messages = [];
    localStorage.removeItem('nova_chat_history');
    sounds.playClear();
    this.loadChatHistory();
  }

  private exportChat(): void {
    if (this.messages.length === 0) {
      alert('No messages to export.');
      return;
    }

    const textContent = this.messages
      .map((m) => `[${new Date(m.timestamp).toLocaleString()}] ${m.sender.toUpperCase()}:\n${m.text}\n`)
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new ChatApp();
});
