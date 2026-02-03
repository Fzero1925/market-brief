#!/usr/bin/env node
/**
 * Stats Tracker - Monitor website growth
 */

const fs = require('fs');
const path = require('path');

function countFiles(dir, ext) {
    try {
        return fs.readdirSync(dir).filter(f => f.endsWith(ext)).length;
    } catch {
        return 0;
    }
}

function getStats() {
    return {
        total: countFiles('.', '.html') + countFiles('stock', '.html') + countFiles('etf', '.html') + countFiles('sectors', '.html') + countFiles('pages', '.html') + countFiles('archive', '.html'),
        stocks: countFiles('stock', '.html'),
        etfs: countFiles('etf', '.html'),
        sectors: countFiles('sectors', '.html'),
        seo: countFiles('pages', '.html'),
        archive: countFiles('archive', '.html'),
        main: countFiles('.', '.html')
    };
}

const stats = getStats();
const timestamp = new Date().toISOString();

console.log(`
╔════════════════════════════════════════╗
║     PRE-MARKET BRIEF - GROWTH STATS    ║
╠════════════════════════════════════════╣
║  Total Pages:     ${String(stats.total).padEnd(23)}║
║  Stock Pages:     ${String(stats.stocks).padEnd(23)}║
║  ETF Pages:       ${String(stats.etfs).padEnd(23)}║
║  Sector Pages:    ${String(stats.sectors).padEnd(23)}║
║  SEO Pages:       ${String(stats.seo).padEnd(23)}║
║  Archive:         ${String(stats.archive).padEnd(23)}║
║  Main Pages:      ${String(stats.main).padEnd(23)}║
╚════════════════════════════════════════╝
Generated: ${timestamp}
`);

// Append to log
const logLine = `${timestamp},${stats.total},${stats.stocks},${stats.etfs}\n`;
fs.appendFileSync('stats.log', logLine);
