/**
 * Tests for MarkdownConverter
 */

const MarkdownConverter = require('../src/converter');
const fs = require('fs-extra');
const path = require('path');

describe('MarkdownConverter', () => {
  let converter;

  beforeEach(() => {
    converter = new MarkdownConverter();
  });

  describe('Basic Conversion', () => {
    test('should convert simple markdown to HTML', () => {
      const markdown = '# Hello World\n\nThis is a **bold** text.';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<h1>Hello World</h1>');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<!DOCTYPE html>');
    });

    test('should handle empty markdown', () => {
      const markdown = '';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<body>');
      expect(html).toContain('</body>');
    });

    test('should handle markdown with only whitespace', () => {
      const markdown = '   \n\n   ';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<body>');
    });
  });

  describe('Headers', () => {
    test('should convert headers of all levels', () => {
      const markdown = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<h1>H1</h1>');
      expect(html).toContain('<h2>H2</h2>');
      expect(html).toContain('<h3>H3</h3>');
      expect(html).toContain('<h4>H4</h4>');
      expect(html).toContain('<h5>H5</h5>');
      expect(html).toContain('<h6>H6</h6>');
    });
  });

  describe('Text Formatting', () => {
    test('should convert bold text', () => {
      const markdown = 'This is **bold** text.';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<strong>bold</strong>');
    });

    test('should convert italic text', () => {
      const markdown = 'This is *italic* text.';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<em>italic</em>');
    });

    test('should convert inline code', () => {
      const markdown = 'This is `inline code`.';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<code>inline code</code>');
    });
  });

  describe('Lists', () => {
    test('should convert unordered lists', () => {
      const markdown = '- Item 1\n- Item 2\n- Item 3';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Item 1</li>');
      expect(html).toContain('<li>Item 2</li>');
      expect(html).toContain('<li>Item 3</li>');
      expect(html).toContain('</ul>');
    });

    test('should convert ordered lists', () => {
      const markdown = '1. First item\n2. Second item\n3. Third item';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<ol>');
      expect(html).toContain('<li>First item</li>');
      expect(html).toContain('<li>Second item</li>');
      expect(html).toContain('<li>Third item</li>');
      expect(html).toContain('</ol>');
    });
  });

  describe('Links and Images', () => {
    test('should convert links', () => {
      const markdown = '[Google](https://google.com)';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<a href="https://google.com">Google</a>');
    });

    test('should convert images', () => {
      const markdown = '![Alt text](https://example.com/image.jpg)';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<img src="https://example.com/image.jpg" alt="Alt text" />');
    });
  });

  describe('Code Blocks', () => {
    test('should convert code blocks', () => {
      const markdown = '```javascript\nconst x = 1;\nconsole.log(x);\n```';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('const x = 1;');
    });

    test('should handle code blocks without language', () => {
      const markdown = '```\nconst x = 1;\n```';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<pre>');
      expect(html).toContain('<code>');
    });
  });

  describe('Blockquotes', () => {
    test('should convert blockquotes', () => {
      const markdown = '> This is a blockquote\n> with multiple lines';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<blockquote>');
      expect(html).toContain('This is a blockquote');
    });
  });

  describe('Tables', () => {
    test('should convert tables', () => {
      const markdown = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
      const html = converter.convert(markdown);
      
      expect(html).toContain('<table>');
      expect(html).toContain('<th>Header 1</th>');
      expect(html).toContain('<td>Cell 1</td>');
    });
  });

  describe('Options', () => {
    test('should apply theme option', () => {
      const markdown = '# Test';
      const html = converter.convert(markdown, { theme: 'dark' });
      
      expect(html).toContain('class="dark-theme"');
    });

    test('should disable highlighting', () => {
      const markdown = '```javascript\nconst x = 1;\n```';
      const html = converter.convert(markdown, { highlight: false });
      
      expect(html).toContain('<pre>');
      expect(html).toContain('<code>');
    });
  });

  describe('Error Handling', () => {
    test('should throw error for invalid AST', () => {
      expect(() => {
        converter.renderer.render(null);
      }).toThrow('Invalid AST: expected document node');
    });

    test('should handle conversion errors gracefully', () => {
      expect(() => {
        converter.convert(undefined);
      }).toThrow();
    });
  });

  describe('File Operations', () => {
    const testDir = path.join(__dirname, 'temp');
    const inputFile = path.join(testDir, 'test.md');
    const outputFile = path.join(testDir, 'test.html');

    beforeEach(async () => {
      await fs.ensureDir(testDir);
      await fs.writeFile(inputFile, '# Test\n\nThis is a test.');
    });

    afterEach(async () => {
      await fs.remove(testDir);
    });

    test('should convert file to HTML', async () => {
      const result = await converter.convertFile(inputFile, outputFile);
      
      expect(result.success).toBe(true);
      expect(await fs.pathExists(outputFile)).toBe(true);
      
      const html = await fs.readFile(outputFile, 'utf8');
      expect(html).toContain('<h1>Test</h1>');
    });

    test('should handle file not found', async () => {
      const nonExistentFile = path.join(testDir, 'nonexistent.md');
      
      await expect(converter.convertFile(nonExistentFile, outputFile))
        .rejects.toThrow();
    });
  });

  describe('Validation', () => {
    test('should validate markdown files', async () => {
      const validFile = path.join(__dirname, 'temp', 'test.md');
      const invalidFile = path.join(__dirname, 'temp', 'test.txt');
      
      await fs.ensureDir(path.dirname(validFile));
      await fs.writeFile(validFile, '# Test');
      await fs.writeFile(invalidFile, 'Not markdown');
      
      expect(await converter.validateFile(validFile)).toBe(true);
      expect(await converter.validateFile(invalidFile)).toBe(false);
      
      await fs.remove(path.dirname(validFile));
    });

    test('should get supported extensions', () => {
      const extensions = converter.getSupportedExtensions();
      
      expect(extensions).toContain('.md');
      expect(extensions).toContain('.markdown');
      expect(extensions).toContain('.mdown');
    });
  });
});
