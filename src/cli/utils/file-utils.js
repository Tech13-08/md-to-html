/**
 * File utilities for CLI operations
 */

const fs = require('fs-extra');
const path = require('path');

class FileUtils {
  /**
   * Get file extension
   * @param {string} filePath - File path
   * @returns {string} File extension
   */
  getExtension(filePath) {
    return path.extname(filePath).toLowerCase();
  }

  /**
   * Check if file has markdown extension
   * @param {string} filePath - File path
   * @returns {boolean} True if markdown file
   */
  isMarkdownFile(filePath) {
    const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn', '.mdtxt', '.mdtext'];
    return markdownExtensions.includes(this.getExtension(filePath));
  }

  /**
   * Generate output filename from input filename
   * @param {string} inputPath - Input file path
   * @param {string} outputDir - Output directory (optional)
   * @returns {string} Output file path
   */
  generateOutputPath(inputPath, outputDir = null) {
    const dir = outputDir || path.dirname(inputPath);
    const name = path.basename(inputPath, this.getExtension(inputPath));
    return path.join(dir, `${name}.html`);
  }

  /**
   * Ensure directory exists
   * @param {string} dirPath - Directory path
   */
  async ensureDir(dirPath) {
    await fs.ensureDir(dirPath);
  }

  /**
   * Check if file exists
   * @param {string} filePath - File path
   * @returns {boolean} True if file exists
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read file content
   * @param {string} filePath - File path
   * @returns {string} File content
   */
  async readFile(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }

  /**
   * Write file content
   * @param {string} filePath - File path
   * @param {string} content - Content to write
   */
  async writeFile(filePath, content) {
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Get all markdown files in directory
   * @param {string} dirPath - Directory path
   * @returns {Array} Array of markdown file paths
   */
  async getMarkdownFiles(dirPath) {
    const files = await fs.readdir(dirPath);
    return files
      .filter(file => this.isMarkdownFile(file))
      .map(file => path.join(dirPath, file));
  }

  /**
   * Copy CSS file to output directory
   * @param {string} outputDir - Output directory
   */
  async copyStyles(outputDir) {
    const stylesPath = path.join(__dirname, '../../styles/styles.css');
    const outputStylesPath = path.join(outputDir, 'styles.css');
    
    if (await this.fileExists(stylesPath)) {
      await fs.copy(stylesPath, outputStylesPath);
    }
  }

  /**
   * Get file stats
   * @param {string} filePath - File path
   * @returns {Object} File stats
   */
  async getFileStats(filePath) {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  }

  /**
   * Create backup of file
   * @param {string} filePath - File path
   * @returns {string} Backup file path
   */
  async createBackup(filePath) {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    await fs.copy(filePath, backupPath);
    return backupPath;
  }

  /**
   * Clean up temporary files
   * @param {Array} filePaths - Array of file paths to clean up
   */
  async cleanup(filePaths) {
    for (const filePath of filePaths) {
      try {
        if (await this.fileExists(filePath)) {
          await fs.remove(filePath);
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }
}

module.exports = FileUtils;
