# Usage Guide

This guide provides detailed instructions on how to use the Markdown to HTML converter.

## Installation

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn package manager

### Install from Source

```bash
# Clone the repository
git clone https://github.com/your-username/md-to-html.git
cd md-to-html

# Install dependencies
npm install

# Make CLI globally available
npm link
```

### Verify Installation

```bash
md-to-html --version
```

## Basic Usage

### Convert Single File

```bash
# Basic conversion
md-to-html convert document.md

# With custom output
md-to-html convert document.md output.html

# With theme
md-to-html convert document.md --theme dark
```

### Convert Directory

```bash
# Convert all markdown files in directory
md-to-html convert ./docs ./html

# With options
md-to-html convert ./docs ./html --theme light --toc
```

## Advanced Usage

### Watch Mode

Automatically convert files when they change:

```bash
# Watch single file
md-to-html watch document.md

# Watch directory
md-to-html watch ./docs --output-dir ./html

# Watch with options
md-to-html watch ./docs --theme dark --toc
```

### Batch Processing

Convert multiple files using glob patterns:

```bash
# Convert all markdown files
md-to-html batch "*.md" --output-dir ./html

# Convert specific patterns
md-to-html batch "docs/*.md" "guides/*.md" --output-dir ./build

# With concurrency control
md-to-html batch "*.md" --output-dir ./html --concurrency 3
```

### Configuration Management

```bash
# Initialize configuration
md-to-html init

# List all configuration
md-to-html config --list

# Set configuration
md-to-html config --set theme=dark
md-to-html config --set highlight=true

# Get configuration
md-to-html config --get theme

# Reset to defaults
md-to-html config --reset
```

## Command Options

### Global Options

- `-v, --verbose` - Enable verbose output
- `-c, --config <path>` - Path to config file
- `--theme <theme>` - Color theme (light|dark)
- `--no-highlight` - Disable syntax highlighting
- `--toc` - Generate table of contents
- `--math` - Enable math expression support
- `--no-responsive` - Disable responsive design
- `--no-print` - Disable print styles
- `-o, --output <path>` - Output file or directory
- `--output-dir <dir>` - Output directory for batch operations
- `--copy-styles` - Copy CSS styles to output directory

### Convert Command

```bash
md-to-html convert <input> [output] [options]
```

**Examples:**
```bash
# Basic conversion
md-to-html convert document.md

# With output file
md-to-html convert document.md output.html

# With theme
md-to-html convert document.md --theme dark

# With table of contents
md-to-html convert document.md --toc

# Convert directory
md-to-html convert ./docs ./html --theme light --copy-styles
```

### Watch Command

```bash
md-to-html watch <input> [output] [options]
```

**Options:**
- `-d, --debounce <ms>` - Debounce time in milliseconds

**Examples:**
```bash
# Watch single file
md-to-html watch document.md

# Watch directory
md-to-html watch ./docs --output-dir ./html

# With debounce
md-to-html watch ./docs --debounce 500
```

### Batch Command

```bash
md-to-html batch <patterns...> [options]
```

**Options:**
- `-o, --output-dir <dir>` - Output directory
- `--concurrency <number>` - Number of concurrent conversions

**Examples:**
```bash
# Convert all markdown files
md-to-html batch "*.md" --output-dir ./html

# Convert with patterns
md-to-html batch "docs/*.md" "guides/*.md" --output-dir ./build

# With concurrency
md-to-html batch "*.md" --output-dir ./html --concurrency 5
```

## Configuration

### Configuration File

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

### Configuration Options

| Option | Type | Default | Description |
|-------|------|---------|-------------|
| `theme` | string | 'light' | Color theme ('light' or 'dark') |
| `highlight` | boolean | true | Enable syntax highlighting |
| `toc` | boolean | false | Generate table of contents |
| `math` | boolean | false | Enable math expression support |
| `responsive` | boolean | true | Enable responsive design |
| `printStyles` | boolean | true | Include print-optimized styles |
| `outputDir` | string | null | Default output directory |
| `watch` | boolean | false | Watch mode for auto-conversion |
| `verbose` | boolean | false | Enable verbose output |

### Environment Variables

You can also set configuration using environment variables:

```bash
export MD_TO_HTML_THEME=dark
export MD_TO_HTML_HIGHLIGHT=true
export MD_TO_HTML_TOC=true
```

## Examples

### Basic Examples

```bash
# Convert single file
md-to-html convert README.md

# Convert with dark theme
md-to-html convert README.md --theme dark

# Convert with table of contents
md-to-html convert README.md --toc

# Convert directory
md-to-html convert ./docs ./html --theme light
```

### Advanced Examples

```bash
# Watch mode with auto-conversion
md-to-html watch ./docs --output-dir ./html --theme dark

# Batch convert with concurrency
md-to-html batch "docs/*.md" --output-dir ./build --concurrency 3

# Convert with all options
md-to-html convert document.md output.html \
  --theme dark \
  --toc \
  --math \
  --copy-styles
```

### API Usage

```javascript
const MarkdownConverter = require('./src/converter');

// Create converter
const converter = new MarkdownConverter({
  theme: 'dark',
  highlight: true,
  toc: true
});

// Convert text
const html = converter.convert('# Hello World\n\nThis is **bold** text.');

// Convert file
await converter.convertFile('input.md', 'output.html');

// Convert multiple files
const files = [
  { input: 'doc1.md', output: 'doc1.html' },
  { input: 'doc2.md', output: 'doc2.html' }
];
const results = await converter.convertFiles(files);
```

## Troubleshooting

### Common Issues

#### File Not Found

```bash
Error: Input path does not exist: document.md
```

**Solution:** Check that the file path is correct and the file exists.

#### Permission Denied

```bash
Error: EACCES: permission denied, open 'output.html'
```

**Solution:** Check file permissions and ensure you have write access to the output directory.

#### Invalid Markdown

```bash
Error: Conversion failed: Invalid markdown syntax
```

**Solution:** Validate your markdown syntax and fix any errors.

#### Memory Issues

```bash
Error: JavaScript heap out of memory
```

**Solution:** Process files in smaller batches or increase Node.js memory limit:

```bash
node --max-old-space-size=4096 md-to-html convert large-file.md
```

### Debug Mode

Enable verbose output for debugging:

```bash
md-to-html convert document.md --verbose
```

### Performance Tips

1. **Use batch processing** for multiple files
2. **Adjust concurrency** for your system
3. **Use watch mode** for development
4. **Disable features** you don't need (math, toc, etc.)

### Getting Help

- Check the [API Reference](API.md) for detailed documentation
- View [GitHub Issues](https://github.com/your-username/md-to-html/issues) for known issues
- Join [GitHub Discussions](https://github.com/your-username/md-to-html/discussions) for community support

## Best Practices

### File Organization

```
project/
├── docs/
│   ├── *.md          # Source markdown files
│   └── html/         # Generated HTML files
├── styles/           # Custom CSS (optional)
└── config.json       # Configuration file
```

### Workflow

1. **Development**: Use watch mode for real-time conversion
2. **Production**: Use batch processing for final conversion
3. **CI/CD**: Integrate into build pipelines
4. **Version Control**: Commit source markdown, not generated HTML

### Performance

- Use appropriate concurrency levels
- Process files in batches
- Use watch mode for development
- Disable unused features

### Styling

- Customize CSS variables for branding
- Use responsive design principles
- Test on multiple devices
- Optimize for print when needed
