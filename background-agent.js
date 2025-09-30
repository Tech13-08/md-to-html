#!/usr/bin/env node

/**
 * Background Agent - Markdown to HTML File Watcher
 * Watches for changes to .md files in the root folder and converts them to HTML in the dist/ folder
 */

const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const MarkdownConverter = require('./src/converter');

class MarkdownBackgroundAgent {
  constructor(options = {}) {
    this.options = {
      theme: 'light',
      highlight: true,
      toc: false,
      math: false,
      responsive: true,
      printStyles: true,
      outputDir: './dist',
      debounceTime: 300,
      ...options
    };

    this.converter = new MarkdownConverter(this.options);
    this.watcher = null;
    this.isWatching = false;
    this.processingFiles = new Set();
  }

  /**
   * Start the background agent
   */
  async start() {
    try {
      console.log(chalk.blue.bold('🚀 Starting Markdown Background Agent'));
      console.log(chalk.gray(`📁 Watching: ${path.resolve('.')}`));
      console.log(chalk.gray(`📤 Output: ${path.resolve(this.options.outputDir)}`));
      
      // Ensure output directory exists
      await this.ensureOutputDir();

      // Set up file watcher for .md files in root directory
      this.watcher = chokidar.watch('*.md', {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: false, // process existing files on startup
        cwd: process.cwd()
      });

      // Handle file changes
      this.watcher.on('change', (filePath) => {
        this.debounceConvert(filePath, 'changed');
      });

      // Handle new files
      this.watcher.on('add', (filePath) => {
        this.debounceConvert(filePath, 'added');
      });

      // Handle file removal
      this.watcher.on('unlink', (filePath) => {
        console.log(chalk.red(`🗑️  File removed: ${filePath}`));
        this.removeOutputFile(filePath);
      });

      // Handle errors
      this.watcher.on('error', (error) => {
        console.error(chalk.red(`❌ Watcher error: ${error.message}`));
      });

      // Ready event
      this.watcher.on('ready', () => {
        this.isWatching = true;
        console.log(chalk.green.bold('✅ Background agent is now active!'));
        console.log(chalk.yellow('📝 Any changes to .md files will be automatically converted to HTML'));
        console.log(chalk.gray('Press Ctrl+C to stop the agent\n'));
      });

      // Graceful shutdown
      process.on('SIGINT', () => {
        this.stop();
      });

      process.on('SIGTERM', () => {
        this.stop();
      });

    } catch (error) {
      console.error(chalk.red(`❌ Failed to start background agent: ${error.message}`));
      process.exit(1);
    }
  }

  /**
   * Debounced conversion to prevent multiple rapid conversions
   */
  debounceConvert(filePath, action) {
    if (this.processingFiles.has(filePath)) {
      return;
    }

    this.processingFiles.add(filePath);
    setTimeout(() => {
      this.convertFile(filePath, action);
      this.processingFiles.delete(filePath);
    }, this.options.debounceTime);
  }

  /**
   * Convert a single markdown file to HTML
   */
  async convertFile(filePath, action = 'changed') {
    try {
      const startTime = Date.now();
      const fullPath = path.resolve(filePath);
      
      // Check if file still exists (might have been deleted)
      if (!await fs.pathExists(fullPath)) {
        return;
      }

      // Generate output path
      const fileName = path.basename(filePath, path.extname(filePath));
      const outputPath = path.join(this.options.outputDir, `${fileName}.html`);

      console.log(chalk.blue(`🔄 File ${action}: ${filePath}`));
      
      // Convert the file
      await this.converter.convertFile(fullPath, outputPath, this.options);
      
      const duration = Date.now() - startTime;
      console.log(chalk.green(`✨ Converted to ${outputPath} (${duration}ms)`));
      
      // Show notification
      this.showNotification(`Successfully converted ${filePath}`, 'success');
      
    } catch (error) {
      console.error(chalk.red(`❌ Failed to convert ${filePath}: ${error.message}`));
      this.showNotification(`Failed to convert ${filePath}: ${error.message}`, 'error');
    }
  }

  /**
   * Remove corresponding HTML file when markdown is deleted
   */
  async removeOutputFile(filePath) {
    try {
      const fileName = path.basename(filePath, path.extname(filePath));
      const outputPath = path.join(this.options.outputDir, `${fileName}.html`);
      
      if (await fs.pathExists(outputPath)) {
        await fs.remove(outputPath);
        console.log(chalk.yellow(`🗑️  Removed corresponding HTML: ${outputPath}`));
        this.showNotification(`Removed ${outputPath}`, 'info');
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to remove output file: ${error.message}`));
    }
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDir() {
    try {
      await fs.ensureDir(this.options.outputDir);
      console.log(chalk.green(`📁 Output directory ready: ${path.resolve(this.options.outputDir)}`));
    } catch (error) {
      throw new Error(`Failed to create output directory: ${error.message}`);
    }
  }

  /**
   * Show desktop notification (if available)
   */
  showNotification(message, type = 'info') {
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };

    const colors = {
      success: chalk.green,
      error: chalk.red,
      info: chalk.blue,
      warning: chalk.yellow
    };

    const coloredMessage = colors[type] || chalk.white;
    console.log(coloredMessage(`${icons[type]} ${message}`));

    // Try to show system notification (optional, requires node-notifier)
    try {
      const notifier = require('node-notifier');
      notifier.notify({
        title: 'Markdown Background Agent',
        message: message,
        icon: type === 'error' ? false : undefined,
        timeout: 3
      });
    } catch (error) {
      // node-notifier not available, just continue with console output
    }
  }

  /**
   * Stop the background agent
   */
  async stop() {
    if (this.watcher && this.isWatching) {
      console.log(chalk.yellow('\n🛑 Stopping background agent...'));
      await this.watcher.close();
      this.isWatching = false;
      console.log(chalk.green('✅ Background agent stopped successfully'));
      process.exit(0);
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isWatching: this.isWatching,
      outputDir: this.options.outputDir,
      watchedFiles: this.watcher ? this.watcher.getWatched() : {}
    };
  }

  /**
   * Convert all existing .md files in the root directory
   */
  async convertAllExisting() {
    try {
      const mdFiles = await fs.readdir(process.cwd()).then(files => 
        files.filter(file => path.extname(file).toLowerCase() === '.md')
      );

      if (mdFiles.length === 0) {
        console.log(chalk.yellow('📄 No .md files found in root directory'));
        return;
      }

      console.log(chalk.blue(`🔄 Converting ${mdFiles.length} existing .md files...`));

      for (const file of mdFiles) {
        await this.convertFile(file, 'processed');
      }

      console.log(chalk.green(`✨ Converted all ${mdFiles.length} existing files`));
    } catch (error) {
      console.error(chalk.red(`❌ Failed to convert existing files: ${error.message}`));
    }
  }
}

// Create and start the background agent
async function main() {
  // Parse command line arguments for options
  const args = process.argv.slice(2);
  const options = {};

  // Simple argument parsing
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    
    switch (key) {
      case 'theme':
        options.theme = value;
        break;
      case 'output-dir':
        options.outputDir = value;
        break;
      case 'toc':
        options.toc = true;
        i--; // No value for boolean flags
        break;
      case 'math':
        options.math = true;
        i--; // No value for boolean flags
        break;
      case 'no-highlight':
        options.highlight = false;
        i--; // No value for boolean flags
        break;
    }
  }

  const agent = new MarkdownBackgroundAgent(options);
  await agent.start();
}

// Export for programmatic use
module.exports = MarkdownBackgroundAgent;

// Run if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Fatal error:'), error.message);
    process.exit(1);
  });
}
