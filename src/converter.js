/**
 * Markdown to HTML Converter - Main conversion logic
 */

const MarkdownLexer = require('./parser/lexer');
const MarkdownParser = require('./parser/parser');
const HTMLRenderer = require('./parser/renderer');

class MarkdownConverter {
  constructor(options = {}) {
    this.lexer = new MarkdownLexer();
    this.parser = new MarkdownParser();
    this.renderer = new HTMLRenderer(options);
  }

  /**
   * Convert markdown text to HTML
   * @param {string} markdown - Markdown text
   * @param {Object} options - Conversion options
   * @returns {string} HTML string
   */
  convert(markdown, options = {}) {
    try {
      // Update renderer options
      this.renderer.options = { ...this.renderer.options, ...options };

      // Tokenize markdown
      const tokens = this.lexer.tokenize(markdown);
      
      // Parse tokens into AST
      const ast = this.parser.parse(tokens);
      
      // Render AST to HTML
      const html = this.renderer.render(ast);
      
      return html;
    } catch (error) {
      throw new Error(`Conversion failed: ${error.message}`);
    }
  }

  /**
   * Convert markdown file to HTML file
   * @param {string} inputPath - Path to markdown file
   * @param {string} outputPath - Path to output HTML file
   * @param {Object} options - Conversion options
   */
  async convertFile(inputPath, outputPath, options = {}) {
    const fs = require('fs-extra');
    
    try {
      // Read markdown file
      const markdown = await fs.readFile(inputPath, 'utf8');
      
      // Convert to HTML
      const html = this.convert(markdown, options);
      
      // Write HTML file
      await fs.writeFile(outputPath, html, 'utf8');
      
      return { success: true, outputPath };
    } catch (error) {
      throw new Error(`File conversion failed: ${error.message}`);
    }
  }

  /**
   * Convert multiple markdown files
   * @param {Array} files - Array of {input, output} file objects
   * @param {Object} options - Conversion options
   * @returns {Array} Results array
   */
  async convertFiles(files, options = {}) {
    const results = [];
    
    for (const file of files) {
      try {
        const result = await this.convertFile(file.input, file.output, options);
        results.push({ ...result, input: file.input });
      } catch (error) {
        results.push({ 
          success: false, 
          input: file.input, 
          output: file.output, 
          error: error.message 
        });
      }
    }
    
    return results;
  }

  /**
   * Get supported file extensions
   * @returns {Array} Array of supported extensions
   */
  getSupportedExtensions() {
    return ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn', '.mdtxt', '.mdtext'];
  }

  /**
   * Validate markdown file
   * @param {string} filePath - Path to markdown file
   * @returns {boolean} True if valid
   */
  async validateFile(filePath) {
    const fs = require('fs-extra');
    const path = require('path');
    
    try {
      // Check if file exists
      if (!(await fs.pathExists(filePath))) {
        return false;
      }
      
      // Check file extension
      const ext = path.extname(filePath).toLowerCase();
      if (!this.getSupportedExtensions().includes(ext)) {
        return false;
      }
      
      // Check if file is readable
      await fs.access(filePath, fs.constants.R_OK);
      
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = MarkdownConverter;
