#!/usr/bin/env node
/**
 * 7x24 Auto-Update Script
 * Runs continuously to update website content
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCRIPTS = [
    'generate.js',
    'generate-pages.js', 
    'generate-crypto.js',
    'generate-earnings.js',
    'generate-ipo.js',
    'generate-rss.js',
    'generate-screener.js',
    'generate-stock-pages.js',
    'generate-etfs.js',
    'generate-sectors.js',
    'generate-dividends.js',
    'generate-economic.js',
    'generate-futures.js'
];

function log(msg) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${msg}`);
}

async function update() {
    log('🚀 Starting auto-update cycle...\n');
    
    // Run all generators
    for (const script of SCRIPTS) {
        try {
            log(`Running ${script}...`);
            execSync(`node ${script}`, { stdio: 'inherit' });
        } catch (e) {
            log(`❌ ${script} failed: ${e.message}`);
        }
    }
    
    // Check for changes
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        
        if (status.trim()) {
            log('📝 Changes detected, committing...');
            execSync('git add -A');
            const date = new Date().toISOString().split('T')[0];
            const time = new Date().toTimeString().split(' ')[0];
            execSync(`git commit -m "Auto-update: ${date} ${time}"`);
            
            log('📤 Pushing to GitHub...');
            execSync('git push origin main');
            log('✅ Pushed successfully');
        } else {
            log('ℹ️ No changes to commit');
        }
    } catch (e) {
        log(`❌ Git operations failed: ${e.message}`);
    }
    
    log('\n✅ Update cycle complete\n');
}

// Run immediately if called directly
if (require.main === module) {
    update().catch(e => {
        log(`Fatal error: ${e.message}`);
        process.exit(1);
    });
}

module.exports = { update };
