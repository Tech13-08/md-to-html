/**
 * Batch command implementation
 */

const ConvertCommand = require('./convert');
const FileUtils = require('../utils/file-utils');
const chalk = require('chalk');
const path = require('path');
const glob = require('glob');

class BatchCommand {
  constructor() {
    this.convertCommand = new ConvertCommand();
    this.fileUtils = new FileUtils();
  }

  /**
   * Execute batch conversion
   * @param {Object} options - Batch options
   * @param {Array} inputs - Array of input patterns
   * @param {string} outputDir - Output directory
   */
  async execute(options, inputs, outputDir) {
    try {
      console.log(chalk.blue('Starting batch conversion...'));
      
      // Expand glob patterns
      const files = await this.expandPatterns(inputs);
      
      if (files.length === 0) {
        console.log(chalk.yellow('No files found matching the patterns'));
        return;
      }

      console.log(chalk.gray(`Found ${files.length} files to convert`));

      // Ensure output directory exists
      if (outputDir) {
        await this.fileUtils.ensureDir(outputDir);
      }

      // Convert files in parallel (with concurrency limit)
      const concurrency = options.concurrency || 5;
      const results = await this.convertFilesInBatches(files, outputDir, options, concurrency);

      // Print summary
      this.printSummary(results);

    } catch (error) {
      console.error(chalk.red(`Batch conversion failed: ${error.message}`));
      process.exit(1);
    }
  }

  /**
   * Expand glob patterns to file paths
   * @param {Array} patterns - Array of glob patterns
   * @returns {Array} Array of file paths
   */
  async expandPatterns(patterns) {
    const files = new Set();
    
    for (const pattern of patterns) {
      try {
        const matches = await this.globAsync(pattern);
        matches.forEach(file => {
          if (this.fileUtils.isMarkdownFile(file)) {
            files.add(file);
          }
        });
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not process pattern "${pattern}": ${error.message}`));
      }
    }
    
    return Array.from(files);
  }

  /**
   * Async glob function
   * @param {string} pattern - Glob pattern
   * @returns {Promise<Array>} Array of matching files
   */
  globAsync(pattern) {
    return new Promise((resolve, reject) => {
      glob(pattern, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  /**
   * Convert files in batches to control concurrency
   * @param {Array} files - Array of file paths
   * @param {string} outputDir - Output directory
   * @param {Object} options - Conversion options
   * @param {number} concurrency - Number of concurrent conversions
   * @returns {Array} Array of conversion results
   */
  async convertFilesInBatches(files, outputDir, options, concurrency) {
    const results = [];
    
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      const batchPromises = batch.map(file => this.convertFile(file, outputDir, options));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            success: false,
            input: batch[index],
            error: result.reason.message
          });
        }
      });
      
      // Progress indicator
      const processed = Math.min(i + concurrency, files.length);
      console.log(chalk.gray(`Processed ${processed}/${files.length} files`));
    }
    
    return results;
  }

  /**
   * Convert a single file
   * @param {string} filePath - File path to convert
   * @param {string} outputDir - Output directory
   * @param {Object} options - Conversion options
   * @returns {Object} Conversion result
   */
  async convertFile(filePath, outputDir, options) {
    try {
      const outputPath = outputDir ? 
        path.join(outputDir, path.basename(filePath, path.extname(filePath)) + '.html') :
        this.fileUtils.generateOutputPath(filePath, options.outputDir);
      
      const result = await this.convertCommand.converter.convertFile(filePath, outputPath, options);
      
      if (result.success) {
        console.log(chalk.green(`✓ ${path.basename(filePath)}`));
      }
      
      return { ...result, input: filePath, output: outputPath };
    } catch (error) {
      console.error(chalk.red(`✗ ${path.basename(filePath)}: ${error.message}`));
      return {
        success: false,
        input: filePath,
        error: error.message
      };
    }
  }

  /**
   * Print conversion summary
   * @param {Array} results - Array of conversion results
   */
  printSummary(results) {
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    console.log(chalk.blue('\nBatch conversion complete:'));
    console.log(chalk.green(`  ✓ ${successful} successful`));
    
    if (failed > 0) {
      console.log(chalk.red(`  ✗ ${failed} failed`));
      
      // List failed files
      const failedFiles = results.filter(r => !r.success);
      console.log(chalk.red('\nFailed files:'));
      failedFiles.forEach(result => {
        console.log(chalk.red(`  - ${result.input}: ${result.error}`));
      });
    }
    
    // Performance stats
    const totalTime = results.reduce((sum, r) => sum + (r.duration || 0), 0);
    if (totalTime > 0) {
      console.log(chalk.gray(`\nTotal time: ${totalTime}ms`));
      console.log(chalk.gray(`Average time per file: ${Math.round(totalTime / results.length)}ms`));
    }
  }
}

module.exports = BatchCommand;
