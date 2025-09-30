/**
 * Markdown Lexer - Tokenizes markdown text into tokens
 */

class MarkdownLexer {
  constructor() {
    this.rules = [
      // Headers
      { type: 'header', pattern: /^(#{1,6})\s+(.+)$/m },
      // Code blocks
      { type: 'code_block', pattern: /^```(\w*)\n([\s\S]*?)```$/m },
      // Inline code
      { type: 'inline_code', pattern: /`([^`]+)`/g },
      // Bold
      { type: 'bold', pattern: /\*\*([^*]+)\*\*/g },
      // Italic
      { type: 'italic', pattern: /\*([^*]+)\*/g },
      // Links
      { type: 'link', pattern: /\[([^\]]+)\]\(([^)]+)\)/g },
      // Images
      { type: 'image', pattern: /!\[([^\]]*)\]\(([^)]+)\)/g },
      // Lists
      { type: 'list_item', pattern: /^[\s]*[-*+]\s+(.+)$/m },
      { type: 'ordered_list_item', pattern: /^[\s]*\d+\.\s+(.+)$/m },
      // Blockquotes
      { type: 'blockquote', pattern: /^>\s*(.+)$/m },
      // Horizontal rules
      { type: 'hr', pattern: /^[-*_]{3,}$/m },
      // Tables
      { type: 'table_row', pattern: /^\|(.+)\|$/m },
      // Line breaks
      { type: 'line_break', pattern: /\n\n/ },
      // Paragraphs
      { type: 'paragraph', pattern: /^(.+)$/m }
    ];
  }

  /**
   * Tokenize markdown text
   * @param {string} text - Markdown text to tokenize
   * @returns {Array} Array of tokens
   */
  tokenize(text) {
    const tokens = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        tokens.push({
          type: 'line_break',
          value: '\n',
          content: '\n',
          position: i,
          length: 1
        });
        continue;
      }
      
      // Check for headers
      const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        tokens.push({
          type: 'header',
          level: headerMatch[1].length,
          text: headerMatch[2],
          value: line,
          content: headerMatch[2],
          position: i,
          length: line.length
        });
        continue;
      }
      
      // Check for code blocks
      if (trimmedLine.startsWith('```')) {
        const language = trimmedLine.substring(3).trim();
        const codeLines = [];
        let j = i + 1;
        
        while (j < lines.length && !lines[j].trim().startsWith('```')) {
          codeLines.push(lines[j]);
          j++;
        }
        
        tokens.push({
          type: 'code_block',
          language: language,
          code: codeLines.join('\n'),
          value: line,
          content: codeLines.join('\n'),
          position: i,
          length: j - i + 1
        });
        
        i = j; // Skip to end of code block
        continue;
      }
      
      // Check for lists
      const listMatch = trimmedLine.match(/^[\s]*[-*+]\s+(.+)$/);
      if (listMatch) {
        tokens.push({
          type: 'list_item',
          content: listMatch[1],
          value: line,
          position: i,
          length: line.length
        });
        continue;
      }
      
      // Check for ordered lists
      const orderedListMatch = trimmedLine.match(/^[\s]*\d+\.\s+(.+)$/);
      if (orderedListMatch) {
        tokens.push({
          type: 'ordered_list_item',
          content: orderedListMatch[1],
          value: line,
          position: i,
          length: line.length
        });
        continue;
      }
      
      // Check for blockquotes
      if (trimmedLine.startsWith('>')) {
        tokens.push({
          type: 'blockquote',
          content: trimmedLine.substring(1).trim(),
          value: line,
          position: i,
          length: line.length
        });
        continue;
      }
      
      // Check for horizontal rules
      if (/^[-*_]{3,}$/.test(trimmedLine)) {
        tokens.push({
          type: 'hr',
          value: line,
          content: line,
          position: i,
          length: line.length
        });
        continue;
      }
      
      // Check for table rows
      if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
        const cells = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell);
        tokens.push({
          type: 'table_row',
          content: trimmedLine,
          cells: cells,
          value: line,
          position: i,
          length: line.length
        });
        continue;
      }
      
      // Default to paragraph
      tokens.push({
        type: 'paragraph',
        content: line,
        value: line,
        position: i,
        length: line.length
      });
    }
    
    return tokens;
  }
}

module.exports = MarkdownLexer;
