/**
 * Markdown Parser - Parses tokens into an Abstract Syntax Tree (AST)
 */

class MarkdownParser {
  constructor() {
    this.tokens = [];
    this.current = 0;
  }

  /**
   * Parse tokens into AST
   * @param {Array} tokens - Array of tokens from lexer
   * @returns {Object} AST root node
   */
  parse(tokens) {
    this.tokens = tokens;
    this.current = 0;
    
    const ast = {
      type: 'document',
      children: []
    };

    while (!this.isAtEnd()) {
      const node = this.parseNode();
      if (node) {
        ast.children.push(node);
      }
    }

    return ast;
  }

  /**
   * Parse a single node
   * @returns {Object|null} AST node or null
   */
  parseNode() {
    const token = this.peek();
    if (!token) return null;

    switch (token.type) {
      case 'header':
        return this.parseHeader();
      case 'code_block':
        return this.parseCodeBlock();
      case 'list_item':
        return this.parseList();
      case 'ordered_list_item':
        return this.parseOrderedList();
      case 'blockquote':
        return this.parseBlockquote();
      case 'hr':
        return this.parseHorizontalRule();
      case 'table_row':
        return this.parseTable();
      case 'line_break':
        this.advance();
        return null;
      case 'paragraph':
        return this.parseParagraph();
      default:
        return this.parseText();
    }
  }

  /**
   * Parse header node
   */
  parseHeader() {
    const token = this.advance();
    return {
      type: 'header',
      level: token.level,
      text: token.text,
      children: this.parseInlineContent(token.text)
    };
  }

  /**
   * Parse code block node
   */
  parseCodeBlock() {
    const token = this.advance();
    return {
      type: 'code_block',
      language: token.language,
      code: token.code
    };
  }

  /**
   * Parse list node
   */
  parseList() {
    const items = [];
    
    while (!this.isAtEnd() && this.peek().type === 'list_item') {
      const token = this.advance();
      items.push({
        type: 'list_item',
        content: token.content,
        children: this.parseInlineContent(token.content)
      });
    }

    return {
      type: 'list',
      items: items
    };
  }

  /**
   * Parse ordered list node
   */
  parseOrderedList() {
    const items = [];
    
    while (!this.isAtEnd() && this.peek().type === 'ordered_list_item') {
      const token = this.advance();
      items.push({
        type: 'list_item',
        content: token.content,
        children: this.parseInlineContent(token.content)
      });
    }

    return {
      type: 'ordered_list',
      items: items
    };
  }

  /**
   * Parse blockquote node
   */
  parseBlockquote() {
    const token = this.advance();
    return {
      type: 'blockquote',
      content: token.content,
      children: this.parseInlineContent(token.content)
    };
  }

  /**
   * Parse horizontal rule node
   */
  parseHorizontalRule() {
    this.advance();
    return {
      type: 'hr'
    };
  }

  /**
   * Parse table node
   */
  parseTable() {
    const rows = [];
    
    while (!this.isAtEnd() && this.peek().type === 'table_row') {
      const token = this.advance();
      rows.push({
        type: 'table_row',
        cells: token.cells || []
      });
    }

    return {
      type: 'table',
      rows: rows
    };
  }

  /**
   * Parse paragraph node
   */
  parseParagraph() {
    const token = this.advance();
    return {
      type: 'paragraph',
      content: token.content,
      children: this.parseInlineContent(token.content)
    };
  }

  /**
   * Parse text node
   */
  parseText() {
    const token = this.advance();
    return {
      type: 'text',
      content: token.content
    };
  }

  /**
   * Parse inline content (bold, italic, links, etc.)
   */
  parseInlineContent(text) {
    if (!text) return [];
    
    // Simple approach: process text character by character
    const children = [];
    let i = 0;
    let currentText = '';
    
    while (i < text.length) {
      // Check for bold **text**
      if (text.substring(i, i + 2) === '**') {
        // Add any accumulated text
        if (currentText) {
          children.push({ type: 'text', content: currentText });
          currentText = '';
        }
        
        // Find closing **
        const endIndex = text.indexOf('**', i + 2);
        if (endIndex !== -1) {
          const content = text.substring(i + 2, endIndex);
          children.push({ type: 'bold', content: content });
          i = endIndex + 2;
          continue;
        }
      }
      
      // Check for italic *text* (but not **text**)
      if (text[i] === '*' && text[i + 1] !== '*') {
        // Add any accumulated text
        if (currentText) {
          children.push({ type: 'text', content: currentText });
          currentText = '';
        }
        
        // Find closing *
        const endIndex = text.indexOf('*', i + 1);
        if (endIndex !== -1 && text[endIndex + 1] !== '*') {
          const content = text.substring(i + 1, endIndex);
          children.push({ type: 'italic', content: content });
          i = endIndex + 1;
          continue;
        }
      }
      
      // Check for inline code `text`
      if (text[i] === '`') {
        // Add any accumulated text
        if (currentText) {
          children.push({ type: 'text', content: currentText });
          currentText = '';
        }
        
        // Find closing `
        const endIndex = text.indexOf('`', i + 1);
        if (endIndex !== -1) {
          const content = text.substring(i + 1, endIndex);
          children.push({ type: 'inline_code', content: content });
          i = endIndex + 1;
          continue;
        }
      }
      
      // Check for links [text](url)
      if (text[i] === '[') {
        // Add any accumulated text
        if (currentText) {
          children.push({ type: 'text', content: currentText });
          currentText = '';
        }
        
        const linkEnd = text.indexOf(']', i);
        if (linkEnd !== -1 && text[linkEnd + 1] === '(') {
          const urlStart = linkEnd + 2;
          const urlEnd = text.indexOf(')', urlStart);
          if (urlEnd !== -1) {
            const linkText = text.substring(i + 1, linkEnd);
            const url = text.substring(urlStart, urlEnd);
            children.push({ type: 'link', content: linkText, url: url });
            i = urlEnd + 1;
            continue;
          }
        }
      }
      
      // Check for images ![alt](src)
      if (text.substring(i, i + 2) === '![') {
        // Add any accumulated text
        if (currentText) {
          children.push({ type: 'text', content: currentText });
          currentText = '';
        }
        
        const altEnd = text.indexOf(']', i + 2);
        if (altEnd !== -1 && text[altEnd + 1] === '(') {
          const srcStart = altEnd + 2;
          const srcEnd = text.indexOf(')', srcStart);
          if (srcEnd !== -1) {
            const alt = text.substring(i + 2, altEnd);
            const src = text.substring(srcStart, srcEnd);
            children.push({ type: 'image', content: alt, src: src, alt: alt });
            i = srcEnd + 1;
            continue;
          }
        }
      }
      
      // Regular character
      currentText += text[i];
      i++;
    }
    
    // Add any remaining text
    if (currentText) {
      children.push({ type: 'text', content: currentText });
    }
    
    return children;
  }

  /**
   * Check if at end of tokens
   */
  isAtEnd() {
    return this.current >= this.tokens.length;
  }

  /**
   * Get current token without advancing
   */
  peek() {
    if (this.isAtEnd()) return null;
    return this.tokens[this.current];
  }

  /**
   * Get current token and advance
   */
  advance() {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.tokens[this.current - 1];
  }
}

module.exports = MarkdownParser;
