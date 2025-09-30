#!/usr/bin/env node

/**
 * Main CLI entry point for md-to-html
 */

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');

// Import commands
const ConvertCommand = require('./commands/convert');
const WatchCommand = require('./commands/watch');
const BatchCommand = require('./commands/batch');
const Config = require('./utils/config');

// Import package info
const packageJson = require('../../package.json');

class CLI {
  constructor() {
    this.program = new Command();
    this.config = new Config();
    this.setupCommands();
  }

  /**
   * Setup CLI commands and options
   */
  setupCommands() {
    this.program
      .name('md-to-html')
      .description('Convert Markdown files to stylized HTML')
      .version(packageJson.version)
      .option('-v, --verbose', 'Enable verbose output')
      .option('-c, --config <path>', 'Path to config file')
      .option('--theme <theme>', 'Color theme (light|dark)', 'light')
      .option('--no-highlight', 'Disable syntax highlighting')
      .option('--toc', 'Generate table of contents')
      .option('--math', 'Enable math expression support')
      .option('--no-responsive', 'Disable responsive design')
      .option('--no-print', 'Disable print styles')
      .option('-o, --output <path>', 'Output file or directory')
      .option('--output-dir <dir>', 'Output directory for batch operations')
      .option('--copy-styles', 'Copy CSS styles to output directory');

    // Convert command
    this.program
      .command('convert <input> [output]')
      .description('Convert a markdown file to HTML')
      .action(async (input, output, options) => {
        const convertCommand = new ConvertCommand();
        const cliOptions = this.getOptions(options);
        await convertCommand.execute(cliOptions, input, output);
      });

    // Watch command
    this.program
      .command('watch <input> [output]')
      .description('Watch markdown files and auto-convert on changes')
      .option('-d, --debounce <ms>', 'Debounce time in milliseconds', '100')
      .action(async (input, output, options) => {
        const watchCommand = new WatchCommand();
        const cliOptions = this.getOptions(options);
        await watchCommand.execute(cliOptions, input, output);
      });

    // Batch command
    this.program
      .command('batch <patterns...>')
      .description('Convert multiple files using glob patterns')
      .option('-o, --output-dir <dir>', 'Output directory', './html')
      .option('--concurrency <number>', 'Number of concurrent conversions', '5')
      .action(async (patterns, options) => {
        const batchCommand = new BatchCommand();
        const cliOptions = this.getOptions(options);
        await batchCommand.execute(cliOptions, patterns, options.outputDir);
      });

    // Config command
    this.program
      .command('config')
      .description('Manage configuration')
      .option('--get <key>', 'Get configuration value')
      .option('--set <key=value>', 'Set configuration value')
      .option('--list', 'List all configuration')
      .option('--reset', 'Reset to default configuration')
      .action(async (options) => {
        await this.handleConfig(options);
      });

    // Init command
    this.program
      .command('init')
      .description('Initialize configuration file')
      .action(async () => {
        await this.handleInit();
      });

    // Help command
    this.program
      .command('help')
      .description('Show help information')
      .action(() => {
        this.showHelp();
      });
  }

  /**
   * Get options from CLI and config
   * @param {Object} cliOptions - CLI options
   * @returns {Object} Merged options
   */
  getOptions(cliOptions) {
    const config = this.config.load();
    return { ...config, ...cliOptions };
  }

  /**
   * Handle configuration commands
   * @param {Object} options - Config options
   */
  async handleConfig(options) {
    try {
      if (options.get) {
        const value = await this.config.get(options.get);
        console.log(value);
      } else if (options.set) {
        const [key, value] = options.set.split('=');
        const parsedValue = this.parseConfigValue(value);
        await this.config.set(key, parsedValue);
        console.log(chalk.green(`Set ${key} = ${parsedValue}`));
      } else if (options.list) {
        const config = await this.config.load();
        console.log(JSON.stringify(config, null, 2));
      } else if (options.reset) {
        await this.config.reset();
        console.log(chalk.green('Configuration reset to defaults'));
      } else {
        console.log(chalk.yellow('Use --help to see config options'));
      }
    } catch (error) {
      console.error(chalk.red(`Config error: ${error.message}`));
      process.exit(1);
    }
  }

  /**
   * Parse configuration value
   * @param {string} value - String value to parse
   * @returns {*} Parsed value
   */
  parseConfigValue(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (!isNaN(value)) return Number(value);
    return value;
  }

  /**
   * Handle initialization
   */
  async handleInit() {
    try {
      await this.config.save(await this.config.load());
      console.log(chalk.green('Configuration initialized'));
      console.log(chalk.gray(`Config file: ${this.config.configFile}`));
    } catch (error) {
      console.error(chalk.red(`Init failed: ${error.message}`));
      process.exit(1);
    }
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log(chalk.blue('Markdown to HTML Converter'));
    console.log(chalk.gray('Convert Markdown files to beautifully styled HTML'));
    console.log('');
    console.log(chalk.yellow('Examples:'));
    console.log('  md-to-html convert document.md');
    console.log('  md-to-html convert document.md output.html');
    console.log('  md-to-html convert ./docs ./html --theme dark');
    console.log('  md-to-html watch document.md');
    console.log('  md-to-html batch "*.md" --output-dir ./html');
    console.log('');
    console.log(chalk.yellow('Configuration:'));
    console.log('  md-to-html config --set theme=dark');
    console.log('  md-to-html config --get theme');
    console.log('  md-to-html config --list');
  }

  /**
   * Run the CLI
   */
  async run() {
    try {
      await this.program.parseAsync(process.argv);
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      if (this.program.opts().verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  const cli = new CLI();
  cli.run();
}

module.exports = CLI;
