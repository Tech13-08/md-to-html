# Markdown Background Agent

A powerful background service that automatically watches for changes to `.md` files in the root directory and converts them to styled HTML files in the `dist/` folder.

## ✨ Features

- **Auto-Detection**: Automatically processes existing `.md` files on startup
- **Real-time Watching**: Monitors file changes, additions, and deletions
- **Smart Conversion**: Uses the built-in markdown-to-html converter with full styling
- **Notifications**: Shows clear progress notifications and completion status
- **Error Handling**: Graceful error handling with helpful error messages
- **Configurable**: Supports themes, table of contents, math expressions, and more
- **Debounced Processing**: Prevents multiple rapid conversions of the same file
- **Automatic Cleanup**: Removes HTML files when corresponding markdown files are deleted

## 🚀 Quick Start

### Method 1: Direct Execution
```bash
node background-agent.js
```

### Method 2: Using npm Scripts
```bash
# Basic start
npm run agent

# With configuration
npm run start-agent
```

### Method 3: With Command Line Options
```bash
# With custom theme
node background-agent.js --theme dark

# With table of contents
node background-agent.js --toc

# With custom output directory
node background-agent.js --output-dir ./output

# With math support
node background-agent.js --math
```

## ⚙️ Configuration Options

### Command Line Arguments
- `--theme <light|dark>` - Color theme for HTML output
- `--output-dir <path>` - Output directory (default: ./dist)
- `--toc` - Generate table of contents
- `--math` - Enable math expression support  
- `--no-highlight` - Disable syntax highlighting

### Environment Variables
```bash
export MD_THEME=dark              # Theme selection
export MD_OUTPUT_DIR=./output     # Output directory
export MD_TOC=true               # Enable table of contents
export MD_MATH=true              # Enable math support
export MD_HIGHLIGHT=false        # Disable highlighting
export MD_DEBOUNCE=500           # Debounce time in ms
```

## 📁 File Structure

When running, the agent will:

1. **Watch**: All `.md` files in the root directory
2. **Convert**: Each file to HTML with full styling
3. **Output**: Save HTML files to `dist/` folder with same name

```
project/
├── README.md              # Source markdown
├── PROJECT_PLAN.md        # Source markdown  
├── background-agent.js    # The background agent
└── dist/                  # Generated HTML files
    ├── README.html        # ← Auto-generated
    └── PROJECT_PLAN.html  # ← Auto-generated
```

## 🔄 How It Works

1. **Startup**: Agent starts and scans for existing `.md` files
2. **Initial Conversion**: Converts all found files to HTML
3. **Watching**: Monitors root directory for changes
4. **Auto-Convert**: When files are modified, automatically reconverts
5. **Cleanup**: Removes HTML files when markdown files are deleted
6. **Notifications**: Shows status updates in real-time

## 📝 Usage Examples

### Basic Usage
```bash
# Start the agent (converts existing files and watches for changes)
node background-agent.js

# Output:
# 🚀 Starting Markdown Background Agent
# 📁 Watching: /your/project/path
# 📤 Output: /your/project/path/dist
# ✅ Background agent is now active!
# 🔄 File added: README.md
# ✨ Converted to dist/README.html (28ms)
# ✅ Successfully converted README.md
```

### With Custom Configuration
```bash
# Dark theme with table of contents
node background-agent.js --theme dark --toc --output-dir ./build

# Math support enabled
node background-agent.js --math --theme light
```

### Programmatic Usage
```javascript
const MarkdownBackgroundAgent = require('./background-agent');

const agent = new MarkdownBackgroundAgent({
  theme: 'dark',
  toc: true,
  outputDir: './dist',
  math: false
});

await agent.start();
```

## 🎯 Real-time Notifications

The agent provides clear feedback for all operations:

- **🔄 File changed**: When a file is modified
- **✨ Converted**: Successful conversion with timing
- **✅ Success**: Conversion completed notification  
- **🗑️ File removed**: When files are deleted
- **❌ Error**: Clear error messages when conversion fails

## 🛠️ Advanced Features

### Debounced Processing
Prevents multiple rapid conversions when files are saved multiple times quickly.

### Smart Output Management
- Creates output directory if it doesn't exist
- Handles file name conflicts gracefully
- Cleans up orphaned HTML files

### Error Recovery
- Continues running even if individual conversions fail
- Provides helpful error messages
- Doesn't crash on permission issues or malformed markdown

## 🔧 Troubleshooting

### Common Issues

**Agent won't start**
```bash
# Check if dependencies are installed
npm install

# Check for syntax errors
node -c background-agent.js
```

**No HTML files generated**
```bash
# Check if .md files exist in root directory
ls *.md

# Check output directory permissions
ls -la dist/
```

**Conversion errors**
```bash
# Run with verbose output to see errors
node background-agent.js --verbose
```

## 🚀 Performance

- **Fast**: Typical conversion time: 25-50ms per file
- **Efficient**: Only processes changed files
- **Memory-friendly**: Minimal memory footprint
- **Scalable**: Handles large numbers of files efficiently

## 🔐 Security

- Only processes `.md` files in the root directory
- No external network access required
- Safe file operations with proper error handling
- Respects file system permissions

---

**Built with ❤️ for developers who love markdown!**