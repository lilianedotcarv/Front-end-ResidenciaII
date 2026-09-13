/**
 * Safe markdown and text formatting utility for chat messages.
 */
export function formatMessageText(rawText: string): string {
  // Step 1: Escape HTML to avoid XSS
  let escaped = rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Step 2: Multi-line Code blocks ```ts ... ``` or ``` ... ```
  escaped = escaped.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const langLabel = lang ? `<span class="code-lang">${lang}</span>` : '';
    return `<div class="code-block-wrapper">${langLabel}<pre><code>${code.trim()}</code></pre></div>`;
  });

  // Step 3: Inline code `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Step 4: Bold **text** or __text__
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Step 5: Italic *text* or _text_
  escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  escaped = escaped.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Step 6: Bullet points lines starting with "- " or "* "
  const lines = escaped.split('\n');
  let inList = false;
  const processedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        processedLines.push('<ul class="chat-list">');
        inList = true;
      }
      processedLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }
  if (inList) {
    processedLines.push('</ul>');
  }

  // Step 7: Convert remaining newlines to <br> unless inside <pre> or <ul>
  let result = processedLines.join('\n');
  
  // Replace regular newlines with <br> outside code blocks
  result = result.replace(/(?<!<\/li>|<\/ul>|<\/pre>|<\/div>)\n/g, '<br />');

  return result;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
