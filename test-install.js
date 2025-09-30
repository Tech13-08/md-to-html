#!/usr/bin/env node

/**
 * Test script to verify installation
 */

const path = require('path');

async function testInstallation() {
  console.log('🧪 Testing md-to-html installation...\n');

  const tests = [
    {
      name: 'Check Node.js version',
      test: () => {
        const version = process.version;
        const major = parseInt(version.slice(1).split('.')[0]);
        if (major < 14) {
          throw new Error(`Node.js 14+ required, found ${version}`);
        }
        return `✅ Node.js ${version}`;
      }
    },
    {
      name: 'Check required modules',
      test: () => {
        const modules = [
          'marked',
          'highlight.js',
          'commander',
          'chokidar',
          'fs-extra',
          'chalk'
        ];
        
        const missing = [];
        for (const module of modules) {
          try {
            require(module);
          } catch (error) {
            missing.push(module);
          }
        }
        
        if (missing.length > 0) {
          throw new Error(`Missing modules: ${missing.join(', ')}`);
        }
        
        return `✅ All required modules found`;
      }
    },
    {
      name: 'Check project structure',
      test: () => {
        const requiredFiles = [
          'src/converter.js',
          'src/parser/lexer.js',
          'src/parser/parser.js',
          'src/parser/renderer.js',
          'src/cli/index.js',
          'src/styles/styles.css',
          'package.json'
        ];
        
        const missing = [];
        for (const file of requiredFiles) {
          const filePath = path.join(__dirname, file);
          if (!require('fs').existsSync(filePath)) {
            missing.push(file);
          }
        }
        
        if (missing.length > 0) {
          throw new Error(`Missing files: ${missing.join(', ')}`);
        }
        
        return `✅ Project structure complete`;
      }
    },
    {
      name: 'Test converter instantiation',
      test: () => {
        const MarkdownConverter = require('./src/converter');
        const converter = new MarkdownConverter();
        return `✅ Converter instantiated successfully`;
      }
    },
    {
      name: 'Test basic conversion',
      test: () => {
        const MarkdownConverter = require('./src/converter');
        const converter = new MarkdownConverter();
        const html = converter.convert('# Test\n\nThis is a **test**.');
        
        if (!html.includes('<h1>Test</h1>')) {
          throw new Error('Basic conversion failed');
        }
        
        return `✅ Basic conversion working`;
      }
    },
    {
      name: 'Test CLI availability',
      test: () => {
        const CLI = require('./src/cli/index');
        if (typeof CLI !== 'function') {
          throw new Error('CLI module not found');
        }
        return `✅ CLI module loaded`;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = test.test();
      console.log(`${result}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Installation is working correctly.');
    console.log('\n🚀 You can now use md-to-html:');
    console.log('   node src/cli/index.js convert examples/sample.md');
    console.log('   node demo.js');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testInstallation();
}

module.exports = testInstallation;
