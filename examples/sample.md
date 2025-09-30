# Markdown to HTML Converter

A powerful tool for converting Markdown files to beautifully styled HTML documents.

## Features

- **Full Markdown Support**: Complete GitHub Flavored Markdown support
- **Syntax Highlighting**: Beautiful code highlighting with multiple themes
- **Responsive Design**: Mobile-first responsive layouts
- **Multiple Themes**: Light and dark theme support
- **CLI Interface**: Easy-to-use command-line tool

## Installation

```bash
npm install -g md-to-html
```

## Usage

### Basic Conversion

```bash
# Convert single file
md-to-html convert document.md

# Convert with custom output
md-to-html convert document.md output.html

# Convert with dark theme
md-to-html convert document.md --theme dark
```

### Batch Processing

```bash
# Convert all markdown files in directory
md-to-html batch "*.md" --output-dir ./html

# Convert with specific patterns
md-to-html batch "docs/*.md" "guides/*.md" --output-dir ./build
```

### Watch Mode

```bash
# Auto-convert on file changes
md-to-html watch document.md

# Watch entire directory
md-to-html watch ./docs --output-dir ./html
```

## Code Examples

### JavaScript

```javascript
const converter = new MarkdownConverter({
  theme: 'dark',
  highlight: true
});

const html = converter.convert(markdown);
```

### Python

```python
import md_to_html

converter = md_to_html.Converter(theme='dark')
html = converter.convert(markdown)
```

### CSS

```css
/* Custom styling */
.markdown-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.markdown-content h1 {
  color: #333;
  border-bottom: 2px solid #eee;
}
```

## Tables

| Feature | Support | Notes |
|---------|---------|-------|
| Headers | ✅ | H1-H6 supported |
| Lists | ✅ | Ordered and unordered |
| Code | ✅ | With syntax highlighting |
| Tables | ✅ | Responsive design |
| Links | ✅ | Auto-detection |
| Images | ✅ | Optimized loading |

## Blockquotes

> This is a blockquote example. It can contain multiple paragraphs and other markdown elements.
> 
> - Lists work inside blockquotes
> - **Bold text** and *italic text*
> - `Inline code` is also supported

## Math Expressions

Inline math: $E = mc^2$

Block math:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Links and Images

- [GitHub Repository](https://github.com/example/md-to-html)
- [Documentation](https://docs.example.com)
- [API Reference](https://api.example.com)

![Sample Image](https://via.placeholder.com/400x200?text=Sample+Image)

## Configuration

Create a config file at `~/.md-to-html/config.json`:

```json
{
  "theme": "light",
  "highlight": true,
  "toc": false,
  "math": true,
  "responsive": true,
  "printStyles": true
}
```

## Advanced Usage

### Custom Themes

You can create custom themes by extending the base CSS:

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --link-color: #0066cc;
  /* ... more variables */
}
```

### Plugin System

The converter supports plugins for extended functionality:

```javascript
const converter = new MarkdownConverter({
  plugins: [
    'toc',
    'math',
    'emoji',
    'footnotes'
  ]
});
```

## Performance

- **Fast Conversion**: Optimized parsing and rendering
- **Memory Efficient**: Stream processing for large files
- **Concurrent Processing**: Batch operations with configurable concurrency
- **Caching**: Smart caching for repeated operations

## Troubleshooting

### Common Issues

1. **File not found**: Check file path and permissions
2. **Syntax errors**: Validate markdown syntax
3. **Theme issues**: Ensure CSS files are accessible
4. **Performance**: Use batch processing for large files

### Debug Mode

Enable verbose output for debugging:

```bash
md-to-html convert document.md --verbose
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for the developer community*
