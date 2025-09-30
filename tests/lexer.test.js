/**
 * Tests for MarkdownLexer
 */

const MarkdownLexer = require('../src/parser/lexer');

describe('MarkdownLexer', () => {
  let lexer;

  beforeEach(() => {
    lexer = new MarkdownLexer();
  });

  describe('Basic Tokenization', () => {
    test('should tokenize simple text', () => {
      const text = 'Hello world';
      const tokens = lexer.tokenize(text);
      
      expect(tokens).toHaveLength(11); // Each character becomes a token
      expect(tokens[0].type).toBe('text');
      expect(tokens[0].value).toBe('H');
    });

    test('should tokenize headers', () => {
      const text = '# Header 1\n## Header 2';
      const tokens = lexer.tokenize(text);
      
      const headerTokens = tokens.filter(token => token.type === 'header');
      expect(headerTokens).toHaveLength(2);
      expect(headerTokens[0].level).toBe(1);
      expect(headerTokens[0].text).toBe('Header 1');
      expect(headerTokens[1].level).toBe(2);
      expect(headerTokens[1].text).toBe('Header 2');
    });
  });

  describe('Text Formatting', () => {
    test('should tokenize bold text', () => {
      const text = 'This is **bold** text';
      const tokens = lexer.tokenize(text);
      
      const boldTokens = tokens.filter(token => token.type === 'bold');
      expect(boldTokens).toHaveLength(1);
      expect(boldTokens[0].content).toBe('bold');
    });

    test('should tokenize italic text', () => {
      const text = 'This is *italic* text';
      const tokens = lexer.tokenize(text);
      
      const italicTokens = tokens.filter(token => token.type === 'italic');
      expect(italicTokens).toHaveLength(1);
      expect(italicTokens[0].content).toBe('italic');
    });

    test('should tokenize inline code', () => {
      const text = 'This is `code` text';
      const tokens = lexer.tokenize(text);
      
      const codeTokens = tokens.filter(token => token.type === 'inline_code');
      expect(codeTokens).toHaveLength(1);
      expect(codeTokens[0].content).toBe('code');
    });
  });

  describe('Links and Images', () => {
    test('should tokenize links', () => {
      const text = '[Google](https://google.com)';
      const tokens = lexer.tokenize(text);
      
      const linkTokens = tokens.filter(token => token.type === 'link');
      expect(linkTokens).toHaveLength(1);
      expect(linkTokens[0].text).toBe('Google');
      expect(linkTokens[0].url).toBe('https://google.com');
    });

    test('should tokenize images', () => {
      const text = '![Alt text](https://example.com/image.jpg)';
      const tokens = lexer.tokenize(text);
      
      const imageTokens = tokens.filter(token => token.type === 'image');
      expect(imageTokens).toHaveLength(1);
      expect(imageTokens[0].alt).toBe('Alt text');
      expect(imageTokens[0].src).toBe('https://example.com/image.jpg');
    });
  });

  describe('Code Blocks', () => {
    test('should tokenize code blocks with language', () => {
      const text = '```javascript\nconst x = 1;\n```';
      const tokens = lexer.tokenize(text);
      
      const codeTokens = tokens.filter(token => token.type === 'code_block');
      expect(codeTokens).toHaveLength(1);
      expect(codeTokens[0].language).toBe('javascript');
      expect(codeTokens[0].code).toContain('const x = 1;');
    });

    test('should tokenize code blocks without language', () => {
      const text = '```\nconst x = 1;\n```';
      const tokens = lexer.tokenize(text);
      
      const codeTokens = tokens.filter(token => token.type === 'code_block');
      expect(codeTokens).toHaveLength(1);
      expect(codeTokens[0].language).toBe('');
      expect(codeTokens[0].code).toContain('const x = 1;');
    });
  });

  describe('Lists', () => {
    test('should tokenize unordered list items', () => {
      const text = '- Item 1\n- Item 2';
      const tokens = lexer.tokenize(text);
      
      const listTokens = tokens.filter(token => token.type === 'list_item');
      expect(listTokens).toHaveLength(2);
      expect(listTokens[0].content).toBe('Item 1');
      expect(listTokens[1].content).toBe('Item 2');
    });

    test('should tokenize ordered list items', () => {
      const text = '1. First item\n2. Second item';
      const tokens = lexer.tokenize(text);
      
      const listTokens = tokens.filter(token => token.type === 'ordered_list_item');
      expect(listTokens).toHaveLength(2);
      expect(listTokens[0].content).toBe('First item');
      expect(listTokens[1].content).toBe('Second item');
    });
  });

  describe('Blockquotes', () => {
    test('should tokenize blockquotes', () => {
      const text = '> This is a blockquote';
      const tokens = lexer.tokenize(text);
      
      const quoteTokens = tokens.filter(token => token.type === 'blockquote');
      expect(quoteTokens).toHaveLength(1);
      expect(quoteTokens[0].content).toBe('This is a blockquote');
    });
  });

  describe('Horizontal Rules', () => {
    test('should tokenize horizontal rules', () => {
      const text = '---\nSome content\n***';
      const tokens = lexer.tokenize(text);
      
      const hrTokens = tokens.filter(token => token.type === 'hr');
      expect(hrTokens).toHaveLength(2);
    });
  });

  describe('Tables', () => {
    test('should tokenize table rows', () => {
      const text = '| Header 1 | Header 2 |\n| Cell 1   | Cell 2   |';
      const tokens = lexer.tokenize(text);
      
      const tableTokens = tokens.filter(token => token.type === 'table_row');
      expect(tableTokens).toHaveLength(2);
      expect(tableTokens[0].content).toContain('Header 1');
      expect(tableTokens[1].content).toContain('Cell 1');
    });
  });

  describe('Line Breaks', () => {
    test('should tokenize line breaks', () => {
      const text = 'Paragraph 1\n\nParagraph 2';
      const tokens = lexer.tokenize(text);
      
      const breakTokens = tokens.filter(token => token.type === 'line_break');
      expect(breakTokens.length).toBeGreaterThan(0);
    });
  });

  describe('Complex Documents', () => {
    test('should tokenize complex markdown document', () => {
      const text = `# Main Title

This is a paragraph with **bold** and *italic* text.

## Subtitle

- List item 1
- List item 2

\`\`\`javascript
const x = 1;
\`\`\`

[Link](https://example.com)`;

      const tokens = lexer.tokenize(text);
      
      expect(tokens.length).toBeGreaterThan(0);
      
      const headerTokens = tokens.filter(token => token.type === 'header');
      expect(headerTokens).toHaveLength(2);
      
      const boldTokens = tokens.filter(token => token.type === 'bold');
      expect(boldTokens).toHaveLength(1);
      
      const italicTokens = tokens.filter(token => token.type === 'italic');
      expect(italicTokens).toHaveLength(1);
      
      const listTokens = tokens.filter(token => token.type === 'list_item');
      expect(listTokens).toHaveLength(2);
      
      const codeTokens = tokens.filter(token => token.type === 'code_block');
      expect(codeTokens).toHaveLength(1);
      
      const linkTokens = tokens.filter(token => token.type === 'link');
      expect(linkTokens).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string', () => {
      const tokens = lexer.tokenize('');
      expect(tokens).toHaveLength(0);
    });

    test('should handle whitespace only', () => {
      const tokens = lexer.tokenize('   \n\n   ');
      expect(tokens.length).toBeGreaterThan(0);
    });

    test('should handle special characters', () => {
      const text = 'Special chars: @#$%^&*()';
      const tokens = lexer.tokenize(text);
      expect(tokens.length).toBeGreaterThan(0);
    });
  });
});
