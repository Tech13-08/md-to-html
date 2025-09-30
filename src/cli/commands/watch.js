/**
 * Watch command implementation
 */

const chokidar = require('chokidar');
const ConvertCommand = require('./convert');
const chalk = require('chalk');
const path = require('path');

class WatchCommand {
  constructor() {
    this.convertCommand = new ConvertCommand();
    this.watcher = null;
    this.isWatching = false;
  }

  /**
   * Start watching files for changes
   * @param {Object} options - Watch options
   * @param {string} input - Input file or directory
   * @param {string} output - Output file or directory
   */
  async execute(options, input, output) {
    try {
      console.log(chalk.blue('Starting watch mode...'));
      console.log(chalk.gray(`Watching: ${input}`));
      
      if (output) {
        console.log(chalk.gray(`Output: ${output}`));
      }

      // Set up file watcher
      this.watcher = chokidar.watch(input, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: true
      });

      // Handle file changes
      this.watcher.on('change', async (filePath) => {
        if (this.convertCommand.fileUtils.isMarkdownFile(filePath)) {
          console.log(chalk.yellow(`File changed: ${filePath}`));
          await this.convertFile(filePath, output, options);
        }
      });

      // Handle new files
      this.watcher.on('add', async (filePath) => {
        if (this.convertCommand.fileUtils.isMarkdownFile(filePath)) {
          console.log(chalk.blue(`New file detected: ${filePath}`));
          await this.convertFile(filePath, output, options);
        }
      });

      // Handle file removal
      this.watcher.on('unlink', (filePath) => {
        console.log(chalk.red(`File removed: ${filePath}`));
      });

      // Handle errors
      this.watcher.on('error', (error) => {
        console.error(chalk.red(`Watcher error: ${error.message}`));
      });

      this.isWatching = true;
      console.log(chalk.green('✓ Watch mode active. Press Ctrl+C to stop.'));

      // Keep the process running
      process.on('SIGINT', () => {
        this.stop();
      });

      // Wait for the watcher to be ready
      await new Promise((resolve) => {
        this.watcher.on('ready', resolve);
      });

    } catch (error) {
      console.error(chalk.red(`Error starting watch mode: ${error.message}`));
      process.exit(1);
    }
  }

  /**
   * Convert a single file (called by watcher)
   * @param {string} filePath - File path to convert
   * @param {string} output - Output path
   * @param {Object} options - Conversion options
   */
  async convertFile(filePath, output, options) {
    try {
      const startTime = Date.now();
      
      // Determine output path
      let outputPath = output;
      if (!outputPath) {
        outputPath = this.convertCommand.fileUtils.generateOutputPath(filePath, options.outputDir);
      } else if (await this.convertCommand.fileUtils.getFileStats(output).then(s => s.isDirectory)) {
        // If output is a directory, generate filename
        const fileName = path.basename(filePath, path.extname(filePath)) + '.html';
        outputPath = path.join(output, fileName);
      }

      // Convert the file
      await this.convertCommand.convertFile(filePath, outputPath, options);
      
      const duration = Date.now() - startTime;
      console.log(chalk.green(`✓ Converted in ${duration}ms`));
      
    } catch (error) {
      console.error(chalk.red(`✗ Conversion failed: ${error.message}`));
    }
  }

  /**
   * Stop watching
   */
  stop() {
    if (this.watcher && this.isWatching) {
      console.log(chalk.yellow('\nStopping watch mode...'));
      this.watcher.close();
      this.isWatching = false;
      console.log(chalk.green('✓ Watch mode stopped'));
      process.exit(0);
    }
  }

  /**
   * Get watch status
   * @returns {boolean} True if currently watching
   */
  getStatus() {
    return this.isWatching;
  }

  /**
   * Get watched files
   * @returns {Array} Array of watched file paths
   */
  getWatchedFiles() {
    if (this.watcher) {
      return this.watcher.getWatched();
    }
    return {};
  }
}

module.exports = WatchCommand;
