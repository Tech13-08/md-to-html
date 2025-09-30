# API Reference

## MarkdownConverter

The main converter class for converting Markdown to HTML.

### Constructor

```javascript
new MarkdownConverter(options)
```

**Parameters:**
- `options` (Object, optional): Configuration options
  - `theme` (string): Color theme ('light' or 'dark')
  - `highlight` (boolean): Enable syntax highlighting
  - `toc` (boolean): Generate table of contents
  - `math` (boolean): Enable math expressions
  - `responsive` (boolean): Enable responsive design
  - `printStyles` (boolean): Include print styles

### Methods

#### convert(markdown, options)

Convert markdown text to HTML.

**Parameters:**
- `markdown` (string): Markdown text to convert
- `options` (Object, optional): Conversion options

**Returns:** `string` - HTML string

**Example:**
```javascript
const converter = new MarkdownConverter();
const html = converter.convert('# Hello World\n\nThis is **bold** text.');
```

#### convertFile(inputPath, outputPath, options)

Convert a markdown file to HTML file.

**Parameters:**
- `inputPath` (string): Path to input markdown file
- `outputPath` (string): Path to output HTML file
- `options` (Object, optional): Conversion options

**Returns:** `Promise<Object>` - Result object with success status

**Example:**
```javascript
const result = await converter.convertFile('input.md', 'output.html');
if (result.success) {
  console.log('Conversion successful');
}
```

#### convertFiles(files, options)

Convert multiple markdown files.

**Parameters:**
- `files` (Array): Array of file objects with input/output paths
- `options` (Object, optional): Conversion options

**Returns:** `Promise<Array>` - Array of result objects

**Example:**
```javascript
const files = [
  { input: 'doc1.md', output: 'doc1.html' },
  { input: 'doc2.md', output: 'doc2.html' }
];
const results = await converter.convertFiles(files);
```

#### getSupportedExtensions()

Get list of supported file extensions.

**Returns:** `Array<string>` - Array of supported extensions

#### validateFile(filePath)

Validate if a file is a supported markdown file.

**Parameters:**
- `filePath` (string): Path to file to validate

**Returns:** `Promise<boolean>` - True if valid markdown file

## MarkdownLexer

Tokenizes markdown text into tokens.

### Constructor

```javascript
new MarkdownLexer()
```

### Methods

#### tokenize(text)

Tokenize markdown text into tokens.

**Parameters:**
- `text` (string): Markdown text to tokenize

**Returns:** `Array<Object>` - Array of token objects

## MarkdownParser

Parses tokens into an Abstract Syntax Tree (AST).

### Constructor

```javascript
new MarkdownParser()
```

### Methods

#### parse(tokens)

Parse tokens into AST.

**Parameters:**
- `tokens` (Array): Array of tokens from lexer

**Returns:** `Object` - AST root node

## HTMLRenderer

Renders AST to HTML.

### Constructor

```javascript
new HTMLRenderer(options)
```

**Parameters:**
- `options` (Object, optional): Renderer options
  - `highlight` (boolean): Enable syntax highlighting
  - `theme` (string): Color theme

### Methods

#### render(ast)

Render AST to HTML.

**Parameters:**
- `ast` (Object): AST to render

**Returns:** `string` - HTML string

## FileUtils

Utility class for file operations.

### Methods

#### getExtension(filePath)

Get file extension.

**Parameters:**
- `filePath` (string): File path

**Returns:** `string` - File extension

#### isMarkdownFile(filePath)

Check if file is a markdown file.

**Parameters:**
- `filePath` (string): File path

**Returns:** `boolean` - True if markdown file

#### generateOutputPath(inputPath, outputDir)

Generate output path from input path.

**Parameters:**
- `inputPath` (string): Input file path
- `outputDir` (string, optional): Output directory

**Returns:** `string` - Generated output path

#### ensureDir(dirPath)

Ensure directory exists.

**Parameters:**
- `dirPath` (string): Directory path

**Returns:** `Promise<void>`

#### fileExists(filePath)

Check if file exists.

**Parameters:**
- `filePath` (string): File path

**Returns:** `Promise<boolean>` - True if file exists

#### readFile(filePath)

Read file content.

**Parameters:**
- `filePath` (string): File path

**Returns:** `Promise<string>` - File content

#### writeFile(filePath, content)

Write content to file.

**Parameters:**
- `filePath` (string): File path
- `content` (string): Content to write

**Returns:** `Promise<void>`

#### getMarkdownFiles(dirPath)

Get all markdown files in directory.

**Parameters:**
- `dirPath` (string): Directory path

**Returns:** `Promise<Array<string>>` - Array of markdown file paths

#### copyStyles(outputDir)

Copy CSS styles to output directory.

**Parameters:**
- `outputDir` (string): Output directory

**Returns:** `Promise<void>`

## Config

Configuration management class.

### Constructor

```javascript
new Config()
```

### Methods

#### load()

Load configuration from file.

**Returns:** `Promise<Object>` - Configuration object

#### save(config)

Save configuration to file.

**Parameters:**
- `config` (Object): Configuration to save

**Returns:** `Promise<void>`

#### get(key, defaultValue)

Get configuration value.

**Parameters:**
- `key` (string): Configuration key
- `defaultValue` (any, optional): Default value

**Returns:** `Promise<any>` - Configuration value

#### set(key, value)

Set configuration value.

**Parameters:**
- `key` (string): Configuration key
- `value` (any): Value to set

**Returns:** `Promise<void>`

#### reset()

Reset configuration to defaults.

**Returns:** `Promise<void>`

#### validate(config)

Validate configuration.

**Parameters:**
- `config` (Object): Configuration to validate

**Returns:** `Object` - Validation result

#### getAvailableThemes()

Get available themes.

**Returns:** `Array<string>` - Array of available themes

#### getSchema()

Get configuration schema.

**Returns:** `Object` - Configuration schema

## CLI Commands

### ConvertCommand

Handles file conversion operations.

#### execute(options, input, output)

Execute convert command.

**Parameters:**
- `options` (Object): Command options
- `input` (string): Input file or directory
- `output` (string, optional): Output file or directory

**Returns:** `Promise<void>`

### WatchCommand

Handles file watching operations.

#### execute(options, input, output)

Execute watch command.

**Parameters:**
- `options` (Object): Command options
- `input` (string): Input file or directory
- `output` (string, optional): Output file or directory

**Returns:** `Promise<void>`

#### stop()

Stop watching.

**Returns:** `void`

#### getStatus()

Get watch status.

**Returns:** `boolean` - True if watching

### BatchCommand

Handles batch conversion operations.

#### execute(options, inputs, outputDir)

Execute batch command.

**Parameters:**
- `options` (Object): Command options
- `inputs` (Array): Array of input patterns
- `outputDir` (string): Output directory

**Returns:** `Promise<void>`

## Error Handling

All methods that can fail throw errors with descriptive messages. Common error types:

- `Error`: General conversion errors
- `TypeError`: Invalid parameter types
- `ReferenceError`: Missing required parameters
- `SyntaxError`: Invalid markdown syntax

## Examples

### Basic Usage

```javascript
const MarkdownConverter = require('./src/converter');

const converter = new MarkdownConverter({
  theme: 'dark',
  highlight: true
});

// Convert text
const html = converter.convert('# Hello World');

// Convert file
await converter.convertFile('input.md', 'output.html');
```

### Advanced Usage

```javascript
const converter = new MarkdownConverter();

// Convert with options
const html = converter.convert(markdown, {
  theme: 'light',
  toc: true,
  math: true
});

// Batch convert
const files = [
  { input: 'doc1.md', output: 'doc1.html' },
  { input: 'doc2.md', output: 'doc2.html' }
];

const results = await converter.convertFiles(files, {
  theme: 'dark',
  highlight: true
});
```

### Custom Renderer

```javascript
const HTMLRenderer = require('./src/parser/renderer');

const renderer = new HTMLRenderer({
  theme: 'dark',
  highlight: true
});

const html = renderer.render(ast);
```
