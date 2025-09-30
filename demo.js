#!/usr/bin/env node

/**
 * Demo script for md-to-html converter
 */

const MarkdownConverter = require('./src/converter');
const fs = require('fs-extra');
const path = require('path');

async function runDemo() {
  console.log('🚀 Markdown to HTML Converter Demo\n');

  try {
    // Create converter instance
    const converter = new MarkdownConverter({
      theme: 'light',
      highlight: true,
      toc: false
    });

    // Sample markdown content
    const markdown = `# Welcome to md-to-html

This is a **demo** of the Markdown to HTML converter.

## Features

- Complete Markdown support
- Syntax highlighting
- Responsive design
- Multiple themes

## Code Example

\`\`\`javascript
const converter = new MarkdownConverter();
const html = converter.convert(markdown);
\`\`\`

## Links

- [GitHub](https://github.com)
- [Documentation](https://docs.example.com)

> This is a blockquote example.

---

*Built with ❤️ for developers*`;

    console.log('📝 Converting markdown to HTML...');
    
    // Convert markdown to HTML
    const html = converter.convert(markdown);
    
    console.log('✅ Conversion successful!');
    console.log(`📄 Generated HTML (${html.length} characters)`);
    
    // Save to file
    const outputPath = path.join(__dirname, 'demo-output.html');
    await fs.writeFile(outputPath, html);
    
    console.log(`💾 Saved to: ${outputPath}`);
    
    // Show HTML preview
    console.log('\n📋 HTML Preview:');
    console.log('─'.repeat(50));
    console.log(html.substring(0, 500) + '...');
    console.log('─'.repeat(50));
    
    console.log('\n🎉 Demo completed successfully!');
    console.log(`\nTo view the output, open: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// Run demo if this file is executed directly
if (require.main === module) {
  runDemo();
}

module.exports = runDemo;
