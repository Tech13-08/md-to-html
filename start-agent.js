#!/usr/bin/env node

/**
 * Startup script for the Markdown Background Agent
 * This provides a simple way to start the background agent with common configurations
 */

const MarkdownBackgroundAgent = require('./background-agent');
const chalk = require('chalk');

// Configuration options
const config = {
  // Theme options: 'light' or 'dark'
  theme: process.env.MD_THEME || 'light',
  
  // Enable syntax highlighting
  highlight: process.env.MD_HIGHLIGHT !== 'false',
  
  // Generate table of contents
  toc: process.env.MD_TOC === 'true',
  
  // Enable math expressions
  math: process.env.MD_MATH === 'true',
  
  // Output directory
  outputDir: process.env.MD_OUTPUT_DIR || './dist',
  
  // Responsive design
  responsive: process.env.MD_RESPONSIVE !== 'false',
  
  // Print styles
  printStyles: process.env.MD_PRINT !== 'false',
  
  // Debounce time for file changes (ms)
  debounceTime: parseInt(process.env.MD_DEBOUNCE) || 300
};

async function startAgent() {
  console.log(chalk.blue.bold('🚀 Markdown Background Agent Startup'));
  console.log(chalk.gray('Configuration:'));
  console.log(chalk.gray(`  Theme: ${config.theme}`));
  console.log(chalk.gray(`  Syntax Highlighting: ${config.highlight ? 'enabled' : 'disabled'}`));
  console.log(chalk.gray(`  Table of Contents: ${config.toc ? 'enabled' : 'disabled'}`));
  console.log(chalk.gray(`  Math Support: ${config.math ? 'enabled' : 'disabled'}`));
  console.log(chalk.gray(`  Output Directory: ${config.outputDir}`));
  console.log(chalk.gray(`  Debounce Time: ${config.debounceTime}ms\n`));

  const agent = new MarkdownBackgroundAgent(config);
  await agent.start();
}

// Handle startup
if (require.main === module) {
  startAgent().catch(error => {
    console.error(chalk.red('❌ Failed to start agent:'), error.message);
    process.exit(1);
  });
}

module.exports = { startAgent, config };
