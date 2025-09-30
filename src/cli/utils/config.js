/**
 * Configuration management for CLI
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

class Config {
  constructor() {
    this.configDir = path.join(os.homedir(), '.md-to-html');
    this.configFile = path.join(this.configDir, 'config.json');
    this.defaultConfig = {
      theme: 'light',
      highlight: true,
      toc: false,
      math: false,
      responsive: true,
      printStyles: true,
      outputDir: null,
      watch: false,
      verbose: false
    };
  }

  /**
   * Load configuration from file or return defaults
   * @returns {Object} Configuration object
   */
  async load() {
    try {
      if (await fs.pathExists(this.configFile)) {
        const configData = await fs.readJson(this.configFile);
        return { ...this.defaultConfig, ...configData };
      }
    } catch (error) {
      console.warn('Warning: Could not load config file, using defaults');
    }
    
    return { ...this.defaultConfig };
  }

  /**
   * Save configuration to file
   * @param {Object} config - Configuration object
   */
  async save(config) {
    try {
      await fs.ensureDir(this.configDir);
      await fs.writeJson(this.configFile, config, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to save config: ${error.message}`);
    }
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Configuration value
   */
  async get(key, defaultValue = null) {
    const config = await this.load();
    return config[key] !== undefined ? config[key] : defaultValue;
  }

  /**
   * Set configuration value
   * @param {string} key - Configuration key
   * @param {*} value - Value to set
   */
  async set(key, value) {
    const config = await this.load();
    config[key] = value;
    await this.save(config);
  }

  /**
   * Reset configuration to defaults
   */
  async reset() {
    await this.save(this.defaultConfig);
  }

  /**
   * Validate configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validation result
   */
  validate(config) {
    const errors = [];
    const warnings = [];

    // Validate theme
    if (config.theme && !['light', 'dark'].includes(config.theme)) {
      errors.push('Theme must be "light" or "dark"');
    }

    // Validate boolean options
    const booleanOptions = ['highlight', 'toc', 'math', 'responsive', 'printStyles', 'watch', 'verbose'];
    for (const option of booleanOptions) {
      if (config[option] !== undefined && typeof config[option] !== 'boolean') {
        errors.push(`${option} must be a boolean value`);
      }
    }

    // Validate output directory
    if (config.outputDir && typeof config.outputDir !== 'string') {
      errors.push('outputDir must be a string');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get available themes
   * @returns {Array} Array of available themes
   */
  getAvailableThemes() {
    return ['light', 'dark'];
  }

  /**
   * Get configuration schema
   * @returns {Object} Configuration schema
   */
  getSchema() {
    return {
      theme: {
        type: 'string',
        enum: ['light', 'dark'],
        default: 'light',
        description: 'Color theme for the output'
      },
      highlight: {
        type: 'boolean',
        default: true,
        description: 'Enable syntax highlighting for code blocks'
      },
      toc: {
        type: 'boolean',
        default: false,
        description: 'Generate table of contents'
      },
      math: {
        type: 'boolean',
        default: false,
        description: 'Enable math expression support'
      },
      responsive: {
        type: 'boolean',
        default: true,
        description: 'Enable responsive design'
      },
      printStyles: {
        type: 'boolean',
        default: true,
        description: 'Include print-optimized styles'
      },
      outputDir: {
        type: 'string',
        default: null,
        description: 'Default output directory'
      },
      watch: {
        type: 'boolean',
        default: false,
        description: 'Watch mode for auto-conversion'
      },
      verbose: {
        type: 'boolean',
        default: false,
        description: 'Enable verbose output'
      }
    };
  }
}

module.exports = Config;
