# Markdown to HTML Converter

A powerful, feature-rich system for converting Markdown files to beautifully styled HTML documents with modern CSS, syntax highlighting, and responsive design.

## ✨ Features

- **Complete Markdown Support**: Full GitHub Flavored Markdown (GFM) support
- **Syntax Highlighting**: Beautiful code highlighting with 20+ languages
- **Responsive Design**: Mobile-first responsive layouts
- **Multiple Themes**: Light and dark theme support
- **CLI Interface**: Easy-to-use command-line tool
- **Batch Processing**: Convert multiple files at once
- **Watch Mode**: Auto-convert files on changes
- **Math Support**: LaTeX math expressions
- **Table of Contents**: Auto-generated TOC
- **Print Styles**: Optimized for printing

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/md-to-html.git
cd md-to-html

# Install dependencies
npm install

# Make CLI globally available
npm link
```

### Basic Usage

```bash
# Convert a single file
md-to-html convert document.md

# Convert with custom output
md-to-html convert document.md output.html

# Convert with dark theme
md-to-html convert document.md --theme dark

# Convert entire directory
md-to-html convert ./docs ./html --theme light
```

## 📖 Documentation

### CLI Commands

#### Convert Command

Convert markdown files to HTML:

```bash
md-to-html convert <input> [output] [options]
```

**Options:**
- `--theme <theme>` - Color theme (light|dark)
- `--no-highlight` - Disable syntax highlighting
- `--toc` - Generate table of contents
- `--math` - Enable math expression support
- `--no-responsive` - Disable responsive design
- `--no-print` - Disable print styles
- `--copy-styles` - Copy CSS styles to output directory

**Examples:**
```bash
# Basic conversion
md-to-html convert document.md

# With options
md-to-html convert document.md output.html --theme dark --toc

# Convert directory
md-to-html convert ./docs ./html --theme light --copy-styles
```

#### Watch Command

Watch markdown files and auto-convert on changes:

```bash
md-to-html watch <input> [output] [options]
```

**Examples:**
```bash
# Watch single file
md-to-html watch document.md

# Watch directory
md-to-html watch ./docs --output-dir ./html
```

#### Batch Command

Convert multiple files using glob patterns:

```bash
md-to-html batch <patterns...> [options]
```

**Examples:**
```bash
# Convert all markdown files
md-to-html batch "*.md" --output-dir ./html

# Convert specific patterns
md-to-html batch "docs/*.md" "guides/*.md" --output-dir ./build
```

#### Config Command

Manage configuration:

```bash
md-to-html config [options]
```

**Examples:**
```bash
# List all configuration
md-to-html config --list

# Set configuration
md-to-html config --set theme=dark

# Get configuration
md-to-html config --get theme

# Reset to defaults
md-to-html config --reset
```

### Configuration

Create a configuration file at `~/.md-to-html/config.json`:

```json
{
  "theme": "light",
  "highlight": true,
  "toc": false,
  "math": true,
  "responsive": true,
  "printStyles": true,
  "outputDir": null,
  "watch": false,
  "verbose": false
}
```

### API Usage

```javascript
const MarkdownConverter = require('./src/converter');

// Create converter instance
const converter = new MarkdownConverter({
  theme: 'dark',
  highlight: true,
  toc: true
});

// Convert markdown to HTML
const markdown = '# Hello World\n\nThis is **bold** text.';
const html = converter.convert(markdown);

// Convert file
await converter.convertFile('input.md', 'output.html');

// Convert multiple files
const files = [
  { input: 'doc1.md', output: 'doc1.html' },
  { input: 'doc2.md', output: 'doc2.html' }
];
const results = await converter.convertFiles(files);
```

## 🎨 Styling

### Themes

The converter includes two built-in themes:

- **Light Theme**: Clean, professional light theme
- **Dark Theme**: Modern dark theme with syntax highlighting

### Custom Styling

You can customize the output by modifying the CSS variables:

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --link-color: #0066cc;
  --heading-color: #1a1a1a;
  --border-color: #e1e5e9;
  --code-bg: #f6f8fa;
  --code-color: #24292e;
}
```

### Responsive Design

The output is fully responsive with:
- Mobile-first approach
- Flexible typography
- Responsive tables
- Optimized code blocks
- Print-friendly styles

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
md-to-html/
├── src/
│   ├── parser/           # Markdown parsing components
│   │   ├── lexer.js      # Tokenizer
│   │   ├── parser.js     # AST parser
│   │   └── renderer.js   # HTML renderer
│   ├── styles/           # CSS styling system
│   │   ├── base.css      # Base styles
│   │   ├── themes/       # Theme styles
│   │   ├── components/   # Component styles
│   │   └── responsive.css # Responsive styles
│   ├── cli/              # CLI interface
│   │   ├── commands/     # CLI commands
│   │   └── utils/        # CLI utilities
│   └── converter.js      # Main converter
├── tests/                # Test files
├── examples/             # Example files
├── docs/                 # Documentation
└── package.json
```

## 🔧 Development

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/your-username/md-to-html.git
cd md-to-html

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Scripts

- `npm start` - Run the CLI
- `npm run dev` - Development mode with auto-reload
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [marked](https://github.com/markedjs/marked) - Markdown parser
- [highlight.js](https://github.com/highlightjs/highlight.js) - Syntax highlighting
- [commander](https://github.com/tj/commander.js) - CLI framework
- [chokidar](https://github.com/paulmillr/chokidar) - File watching

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/md-to-html/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/md-to-html/discussions)

---

*Built with ❤️ for the developer community*
