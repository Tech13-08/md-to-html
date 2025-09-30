/**
 * HTML Renderer - Converts AST to HTML
 */

const hljs = require('highlight.js');

class HTMLRenderer {
  constructor(options = {}) {
    this.options = {
      highlight: true,
      theme: 'light',
      ...options
    };
  }

  /**
   * Render AST to HTML
   * @param {Object} ast - Abstract Syntax Tree
   * @returns {string} HTML string
   */
  render(ast) {
    if (!ast || ast.type !== 'document') {
      throw new Error('Invalid AST: expected document node');
    }

    const html = this.renderNode(ast);
    return this.wrapInDocument(html);
  }

  /**
   * Render a single node
   * @param {Object} node - AST node
   * @returns {string} HTML string
   */
  renderNode(node) {
    if (!node) return '';

    switch (node.type) {
      case 'document':
        return node.children.map(child => this.renderNode(child)).join('\n');
      
      case 'header':
        return this.renderHeader(node);
      
      case 'paragraph':
        return this.renderParagraph(node);
      
      case 'code_block':
        return this.renderCodeBlock(node);
      
      case 'list':
        return this.renderList(node);
      
      case 'ordered_list':
        return this.renderOrderedList(node);
      
      case 'blockquote':
        return this.renderBlockquote(node);
      
      case 'hr':
        return this.renderHorizontalRule();
      
      case 'table':
        return this.renderTable(node);
      
      case 'text':
        return this.escapeHtml(node.content);
      
      case 'bold':
        return `<strong>${this.renderInlineContent(node)}</strong>`;
      
      case 'italic':
        return `<em>${this.renderInlineContent(node)}</em>`;
      
      case 'inline_code':
        return `<code>${this.escapeHtml(node.content)}</code>`;
      
      case 'link':
        return `<a href="${this.escapeHtml(node.url)}">${this.renderInlineContent(node)}</a>`;
      
      case 'image':
        return `<img src="${this.escapeHtml(node.src)}" alt="${this.escapeHtml(node.alt)}" />`;
      
      default:
        return this.escapeHtml(node.content || '');
    }
  }

  /**
   * Render header
   */
  renderHeader(node) {
    const content = this.renderInlineContent(node);
    return `<h${node.level}>${content}</h${node.level}>`;
  }

  /**
   * Render paragraph
   */
  renderParagraph(node) {
    if (node.children && node.children.length > 0) {
      const content = node.children.map(child => this.renderNode(child)).join('');
      return `<p>${content}</p>`;
    }
    return `<p>${this.escapeHtml(node.content)}</p>`;
  }

  /**
   * Render code block with syntax highlighting
   */
  renderCodeBlock(node) {
    let code = node.code;
    
    if (this.options.highlight && node.language) {
      try {
        const highlighted = hljs.highlight(code, { language: node.language });
        code = highlighted.value;
      } catch (error) {
        // Fallback to plain text if highlighting fails
        code = this.escapeHtml(code);
      }
    } else {
      code = this.escapeHtml(code);
    }

    const languageClass = node.language ? ` class="language-${node.language}"` : '';
    return `<pre><code${languageClass}>${code}</code></pre>`;
  }

  /**
   * Render unordered list
   */
  renderList(node) {
    const items = node.items.map(item => {
      const content = item.children ? 
        item.children.map(child => this.renderNode(child)).join('') :
        this.escapeHtml(item.content);
      return `<li>${content}</li>`;
    }).join('\n');
    
    return `<ul>\n${items}\n</ul>`;
  }

  /**
   * Render ordered list
   */
  renderOrderedList(node) {
    const items = node.items.map(item => {
      const content = item.children ? 
        item.children.map(child => this.renderNode(child)).join('') :
        this.escapeHtml(item.content);
      return `<li>${content}</li>`;
    }).join('\n');
    
    return `<ol>\n${items}\n</ol>`;
  }

  /**
   * Render blockquote
   */
  renderBlockquote(node) {
    const content = node.children ? 
      node.children.map(child => this.renderNode(child)).join('') :
      this.escapeHtml(node.content);
    return `<blockquote>${content}</blockquote>`;
  }

  /**
   * Render horizontal rule
   */
  renderHorizontalRule() {
    return '<hr>';
  }

  /**
   * Render table
   */
  renderTable(node) {
    if (!node.rows || node.rows.length === 0) return '';

    const rows = node.rows.map((row, index) => {
      const cells = row.cells.map(cell => {
        const tag = index === 0 ? 'th' : 'td';
        return `<${tag}>${this.escapeHtml(cell)}</${tag}>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('\n');

    return `<table>\n${rows}\n</table>`;
  }

  /**
   * Render inline content
   */
  renderInlineContent(node) {
    if (node.children && node.children.length > 0) {
      return node.children.map(child => this.renderNode(child)).join('');
    }
    return this.escapeHtml(node.content || '');
  }

  /**
   * Escape HTML special characters
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Wrap content in HTML document structure
   */
  wrapInDocument(content) {
    const themeClass = this.options.theme === 'dark' ? 'dark-theme' : 'light-theme';
    
    return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Document</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        ${content}
    </div>
</body>
</html>`;
  }
}

module.exports = HTMLRenderer;
