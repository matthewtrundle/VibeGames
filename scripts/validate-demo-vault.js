#!/usr/bin/env node

/**
 * Demo Vault Validation Script
 * Validates the demo-vault/ structure and content for "The Headless Horseman's Quest"
 *
 * Usage: node scripts/validate-demo-vault.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Configuration
// ============================================================================

const VAULT_PATH = path.join(__dirname, '..', 'demo-vault');
const EXPECTED_FILE_COUNT = 15; // Not counting README.md
const REQUIRED_FOLDERS = ['product-logs', 'feedback', 'random-notes'];

// Expected file structure
const EXPECTED_FILES = {
  'product-logs': [
    'bug-report-haunted-ui.md',
    'bug-report-mobile-crashes.md',
    'feature-request-dark-mode.md',
    'sprint-retrospective-oct.md',
    'performance-issues-log.md'
  ],
  'feedback': [
    'user-complaints-sept.md',
    'user-complaints-oct.md',
    'praise-and-kudos.md',
    'survey-results-q3.md',
    'support-tickets-summary.md'
  ],
  'random-notes': [
    'scattered-midnight-thoughts.md',
    'todo-list-from-hell.md',
    'random-product-ideas.md',
    'meeting-notes-rambling.md',
    'inspiration-graveyard.md'
  ]
};

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Check if vault directory exists
 */
function checkVaultExists() {
  if (!fs.existsSync(VAULT_PATH)) {
    console.error('❌ FAIL: demo-vault/ directory not found');
    return false;
  }
  console.log('✅ PASS: demo-vault/ directory exists');
  return true;
}

/**
 * Check required folders exist
 */
function checkRequiredFolders() {
  let allExist = true;

  for (const folder of REQUIRED_FOLDERS) {
    const folderPath = path.join(VAULT_PATH, folder);
    if (!fs.existsSync(folderPath)) {
      console.error(`❌ FAIL: Required folder missing: ${folder}`);
      allExist = false;
    } else {
      console.log(`✅ PASS: Folder exists: ${folder}`);
    }
  }

  return allExist;
}

/**
 * Check all expected files exist
 */
function checkExpectedFiles() {
  let allExist = true;
  let totalFiles = 0;

  for (const [folder, files] of Object.entries(EXPECTED_FILES)) {
    for (const file of files) {
      const filePath = path.join(VAULT_PATH, folder, file);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ FAIL: Expected file missing: ${folder}/${file}`);
        allExist = false;
      } else {
        totalFiles++;
      }
    }
  }

  console.log(`✅ PASS: Found ${totalFiles}/${EXPECTED_FILE_COUNT} expected files`);

  if (totalFiles !== EXPECTED_FILE_COUNT) {
    console.error(`❌ FAIL: Expected ${EXPECTED_FILE_COUNT} files, found ${totalFiles}`);
    return false;
  }

  return allExist;
}

/**
 * Validate frontmatter structure in markdown files
 */
function validateFrontmatter() {
  let validCount = 0;
  let totalCount = 0;
  const issues = [];

  for (const [folder, files] of Object.entries(EXPECTED_FILES)) {
    for (const file of files) {
      totalCount++;
      const filePath = path.join(VAULT_PATH, folder, file);

      if (!fs.existsSync(filePath)) {
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for frontmatter
      const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
      const match = content.match(frontmatterRegex);

      if (!match) {
        issues.push(`${folder}/${file}: Missing frontmatter`);
        continue;
      }

      const frontmatter = match[1];

      // Check for required fields
      const hasTitle = /^title:/m.test(frontmatter);
      const hasTags = /^tags:/m.test(frontmatter);
      const hasDate = /^date:/m.test(frontmatter);

      if (!hasTitle) {
        issues.push(`${folder}/${file}: Missing 'title' field`);
      }
      if (!hasTags) {
        issues.push(`${folder}/${file}: Missing 'tags' field`);
      }
      if (!hasDate) {
        issues.push(`${folder}/${file}: Missing 'date' field`);
      }

      if (hasTitle && hasTags && hasDate) {
        validCount++;
      }
    }
  }

  if (issues.length > 0) {
    console.log('\n⚠️  Frontmatter Issues:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  }

  console.log(`\n✅ PASS: ${validCount}/${totalCount} files have valid frontmatter`);
  return issues.length === 0;
}

/**
 * Check for file interconnections (wikilinks)
 */
function checkFileInterconnections() {
  const wikiLinkPattern = /\[\[([^\]]+)\]\]/g;
  let totalLinks = 0;
  const linksByFile = {};
  const brokenLinks = [];

  // Build file lookup
  const allFiles = new Set();
  for (const [folder, files] of Object.entries(EXPECTED_FILES)) {
    files.forEach(file => {
      allFiles.add(file.replace('.md', ''));
    });
  }

  // Check each file for wikilinks
  for (const [folder, files] of Object.entries(EXPECTED_FILES)) {
    for (const file of files) {
      const filePath = path.join(VAULT_PATH, folder, file);

      if (!fs.existsSync(filePath)) {
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = [...content.matchAll(wikiLinkPattern)];

      if (matches.length > 0) {
        linksByFile[`${folder}/${file}`] = matches.length;
        totalLinks += matches.length;

        // Check if linked files exist
        matches.forEach(match => {
          const linkedFile = match[1];
          if (!allFiles.has(linkedFile)) {
            brokenLinks.push(`${folder}/${file} → [[${linkedFile}]]`);
          }
        });
      }
    }
  }

  console.log(`\n📎 File Interconnections:`);
  console.log(`   Total wikilinks found: ${totalLinks}`);

  if (Object.keys(linksByFile).length > 0) {
    console.log('\n   Files with wikilinks:');
    Object.entries(linksByFile).forEach(([file, count]) => {
      console.log(`   - ${file}: ${count} link(s)`);
    });
  }

  if (brokenLinks.length > 0) {
    console.log('\n   ⚠️  Broken links:');
    brokenLinks.forEach(link => console.log(`   - ${link}`));
  }

  if (totalLinks > 0) {
    console.log('\n✅ PASS: Files have interconnections');
    return true;
  } else {
    console.log('\n⚠️  WARNING: No wikilinks found (files not interconnected)');
    return true; // Not a critical failure
  }
}

/**
 * Check content quality (minimum length, non-empty)
 */
function checkContentQuality() {
  const MIN_CONTENT_LENGTH = 100; // characters
  const issues = [];
  let validCount = 0;

  for (const [folder, files] of Object.entries(EXPECTED_FILES)) {
    for (const file of files) {
      const filePath = path.join(VAULT_PATH, folder, file);

      if (!fs.existsSync(filePath)) {
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');

      // Remove frontmatter for content length check
      const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

      if (contentWithoutFrontmatter.trim().length < MIN_CONTENT_LENGTH) {
        issues.push(`${folder}/${file}: Content too short (< ${MIN_CONTENT_LENGTH} chars)`);
      } else {
        validCount++;
      }
    }
  }

  if (issues.length > 0) {
    console.log('\n⚠️  Content Quality Issues:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  }

  console.log(`\n✅ PASS: ${validCount}/${EXPECTED_FILE_COUNT} files have sufficient content`);
  return issues.length === 0;
}

/**
 * Generate summary statistics
 */
function generateSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 DEMO VAULT SUMMARY');
  console.log('='.repeat(60));

  let totalWords = 0;
  let totalChars = 0;
  const tagCounts = {};

  for (const [folder, files] of Object.entries(EXPECTED_FILES)) {
    for (const file of files) {
      const filePath = path.join(VAULT_PATH, folder, file);

      if (!fs.existsSync(filePath)) {
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

      // Count words and chars
      const words = contentWithoutFrontmatter.split(/\s+/).filter(w => w.length > 0).length;
      totalWords += words;
      totalChars += contentWithoutFrontmatter.length;

      // Extract tags
      const tagsMatch = content.match(/^tags:\s*\[(.*?)\]/m);
      if (tagsMatch) {
        const tags = tagsMatch[1].split(',').map(t => t.trim());
        tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    }
  }

  console.log(`Total Files: ${EXPECTED_FILE_COUNT}`);
  console.log(`Total Folders: ${REQUIRED_FOLDERS.length}`);
  console.log(`Total Words: ${totalWords.toLocaleString()}`);
  console.log(`Total Characters: ${totalChars.toLocaleString()}`);
  console.log(`Average Words/File: ${Math.round(totalWords / EXPECTED_FILE_COUNT)}`);

  console.log('\nTop Tags:');
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([tag, count]) => {
      console.log(`   - ${tag}: ${count}`);
    });
}

// ============================================================================
// Main Validation Runner
// ============================================================================

function main() {
  console.log('🎃 The Headless Horseman\'s Quest - Demo Vault Validation');
  console.log('='.repeat(60));
  console.log('');

  const results = {
    vaultExists: checkVaultExists(),
    foldersExist: checkRequiredFolders(),
    filesExist: checkExpectedFiles(),
    frontmatterValid: validateFrontmatter(),
    interconnections: checkFileInterconnections(),
    contentQuality: checkContentQuality()
  };

  generateSummary();

  console.log('\n' + '='.repeat(60));
  console.log('🎯 VALIDATION RESULTS');
  console.log('='.repeat(60));

  const allPassed = Object.values(results).every(r => r === true);

  if (allPassed) {
    console.log('\n✅ ALL CHECKS PASSED! Demo vault is ready for the hackathon! 🎉');
    process.exit(0);
  } else {
    console.log('\n❌ SOME CHECKS FAILED. Please review the issues above.');
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = {
  checkVaultExists,
  checkRequiredFolders,
  checkExpectedFiles,
  validateFrontmatter,
  checkFileInterconnections,
  checkContentQuality
};
