/**
 * Convert command implementation
 */

const MarkdownConverter = require('../../converter');
const FileUtils = require('../utils/file-utils');
const Config = require('../utils/config');
const chalk = require('chalk');
const path = require('path');

class ConvertCommand {
  constructor() {
    this.converter = new MarkdownConverter();
    this.fileUtils = new FileUtils();
    this.config = new Config();
  }

  /**
   * Execute convert command
   * @param {Object} options - Command options
   * @param {string} input - Input file or directory
   * @param {string} output - Output file or directory
   */
  async execute(options, input, output) {
    try {
      // Load configuration
      const config = await this.config.load();
      const finalOptions = { ...config, ...options };

      // Validate options
      const validation = this.config.validate(finalOptions);
      if (!validation.valid) {
        console.error(chalk.red('Configuration errors:'));
        validation.errors.forEach(error => console.error(chalk.red(`  - ${error}`)));
        process.exit(1);
      }

      if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => console.warn(chalk.yellow(`Warning: ${warning}`)));
      }

      // Process input
      if (await this.fileUtils.fileExists(input)) {
        const stats = await this.fileUtils.getFileStats(input);
        
        if (stats.isFile) {
          await this.convertFile(input, output, finalOptions);
        } else if (stats.isDirectory) {
          await this.convertDirectory(input, output, finalOptions);
        }
      } else {
        console.error(chalk.red(`Input path does not exist: ${input}`));
        process.exit(1);
      }

    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      if (finalOptions.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Convert single file
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {Object} options - Conversion options
   */
  async convertFile(inputPath, outputPath, options) {
    // Validate input file
    if (!this.fileUtils.isMarkdownFile(inputPath)) {
      console.error(chalk.red(`Not a markdown file: ${inputPath}`));
      return;
    }

    // Generate output path if not provided
    if (!outputPath) {
      outputPath = this.fileUtils.generateOutputPath(inputPath, options.outputDir);
    }

    // Ensure output directory exists
    await this.fileUtils.ensureDir(path.dirname(outputPath));

    console.log(chalk.blue(`Converting: ${inputPath} -> ${outputPath}`));

    try {
      // Convert file
      const result = await this.converter.convertFile(inputPath, outputPath, options);
      
      if (result.success) {
        console.log(chalk.green(`✓ Successfully converted: ${path.basename(inputPath)}`));
        
        // Copy styles if needed
        if (options.copyStyles !== false) {
          await this.fileUtils.copyStyles(path.dirname(outputPath));
          console.log(chalk.gray('  Styles copied to output directory'));
        }
      }
    } catch (error) {
      console.error(chalk.red(`✗ Failed to convert: ${path.basename(inputPath)}`));
      console.error(chalk.red(`  Error: ${error.message}`));
    }
  }

  /**
   * Convert directory of files
   * @param {string} inputDir - Input directory
   * @param {string} outputDir - Output directory
   * @param {Object} options - Conversion options
   */
  async convertDirectory(inputDir, outputDir, options) {
    console.log(chalk.blue(`Converting directory: ${inputDir}`));
    
    // Get all markdown files
    const markdownFiles = await this.fileUtils.getMarkdownFiles(inputDir);
    
    if (markdownFiles.length === 0) {
      console.log(chalk.yellow('No markdown files found in directory'));
      return;
    }

    console.log(chalk.gray(`Found ${markdownFiles.length} markdown files`));

    // Ensure output directory exists
    if (outputDir) {
      await this.fileUtils.ensureDir(outputDir);
    }

    // Convert each file
    const results = [];
    for (const filePath of markdownFiles) {
      const relativePath = path.relative(inputDir, filePath);
      const outputPath = outputDir ? 
        path.join(outputDir, path.basename(filePath, path.extname(filePath)) + '.html') :
        this.fileUtils.generateOutputPath(filePath, options.outputDir);
      
      try {
        const result = await this.converter.convertFile(filePath, outputPath, options);
        results.push({ ...result, input: filePath, output: outputPath });
        
        if (result.success) {
          console.log(chalk.green(`✓ ${relativePath}`));
        }
      } catch (error) {
        console.error(chalk.red(`✗ ${relativePath}: ${error.message}`));
        results.push({ success: false, input: filePath, error: error.message });
      }
    }

    // Copy styles to output directory
    if (options.copyStyles !== false && outputDir) {
      await this.fileUtils.copyStyles(outputDir);
      console.log(chalk.gray('Styles copied to output directory'));
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    console.log(chalk.blue(`\nConversion complete:`));
    console.log(chalk.green(`  ✓ ${successful} successful`));
    if (failed > 0) {
      console.log(chalk.red(`  ✗ ${failed} failed`));
    }
  }
}

module.exports = ConvertCommand;
