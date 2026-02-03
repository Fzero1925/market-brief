#!/usr/bin/env node
/**
 * Dividend Calendar
 * Track upcoming dividend payments
 */

const fs = require('fs');
const path = require('path');

// Top dividend stocks
const DIVIDEND_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc', dividend: 0.25, yield: 0.5, date: '2025-02-15' },
    { symbol: 'MSFT', name: 'Microsoft Corp', dividend: 0.75, yield: 0.7, date: '2025-02-20' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', dividend: 1.19, yield: 2.9, date: '2025-02-18' },
    { symbol: 'JPM', name: 'JPMorgan Chase', dividend: 1.05, yield: 2.4, date: '2025-02-10' },
    { symbol: 'V', name: 'Visa Inc', dividend: 0.52, yield: 0.7, date: '2025-02-25' },
    { symbol: 'PG', name: 'Procter & Gamble', dividend: 0.94, yield: 2.4, date: '2025-02-22' },
    { symbol: 'UNH', name: 'UnitedHealth Group', dividend: 1.88, yield: 1.4, date: '2025-02-12' },
    { symbol: 'HD', name: 'Home Depot', dividend: 2.09, yield: 2.1, date: '2025-02-28' },
    { symbol: 'BAC', name: 'Bank of America', dividend: 0.24, yield: 2.6, date: '2025-02-08' },
    { symbol: 'MA', name: 'Mastercard Inc', dividend: 0.57, yield: 0.6, date: '2025-02-14' },
    { symbol: 'ABBV', name: 'AbbVie Inc', dividend: 1.55, yield: 3.4, date: '2025-02-16' },
    { symbol: 'PFE', name: 'Pfizer Inc', dividend: 0.42, yield: 5.8, date: '2025-02-26' },
    { symbol: 'KO', name: 'Coca-Cola Co', dividend: 0.46, yield: 3.1, date: '2025-02-24' },
    { symbol: 'PEP', name: 'PepsiCo Inc', dividend: 1.26, yield: 3.0, date: '2025-02-19' },
    { symbol: 'WMT', name: 'Walmart Inc', dividend: 0.21, yield: 1.4, date: '2025-02-11' },
    { symbol: 'MRK', name: 'Merck & Co', dividend: 0.77, yield: 2.8, date: '2025-02-13' },
    { symbol: 'CSCO', name: 'Cisco Systems', dividend: 0.40, yield: 3.2, date: '2025-02-21' },
    { symbol: 'VZ', name: 'Verizon', dividend: 0.67, yield: 6.5, date: '2025-02-27' },
    { symbol: 'ADBE', name: 'Adobe Inc', dividend: 0.00, yield: 0.0, date: 'N/A' },
    { symbol: 'NKE', name: 'Nike Inc', dividend: 0.37, yield: 1.5, date: '2025-02-23' }
];

function generateDividendCalendar() {
    const today = new Date();
    const upcoming = DIVIDEND_STOCKS.filter(s => new Date(s.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));
    const highYield = [...DIVIDEND_STOCKS].sort((a, b) => b.yield - a.yield).slice(0, 10);
    
    const formatDate = (dateStr) => {
        if (dateStr === 'N/A') return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const upcomingRows = upcoming.map(s => `
        <tr>
            <td class="date">${formatDate(s.date)}</td>
            <td class="symbol">${s.symbol}</td>
            <td class="company">${s.name}</td>
            <td class="dividend">$${s.dividend.toFixed(2)}</td>
            <td class="yield ${s.yield >= 4 ? 'high' : s.yield >= 2 ? 'medium' : 'low'}">${s.yield.toFixed(2)}%</td>
        </tr>
    `).join('');
    
    const highYieldRows = highYield.map(s => `
        <tr>
            <td class="symbol">${s.symbol}</td>
            <td class="company">${s.name}</td>
            <td class="dividend">$${s.dividend.toFixed(2)}</td>
            <td class="yield high">${s.yield.toFixed(2)}%</td>
            <td class="date">${formatDate(s.date)}</td>
        </tr>
    `).join('');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dividend Calendar 2025 | Upcoming Dividend Payments</title>
    <meta name="description" content="Dividend calendar for 2025. Track upcoming dividend payments from AAPL, MSFT, JNJ, and top dividend stocks.">
    <meta name="keywords" content="dividend calendar, dividend stocks, upcoming dividends, dividend yield">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e1a; color: #e8eaed; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
        nav { background: #111827; padding: 15px 20px; border-bottom: 1px solid #1e3a5f; margin: -20px -20px 30px; }
        nav a { color: #00d4aa; text-decoration: none; margin-right: 20px; }
        header { text-align: center; padding: 40px 0; }
        h1 { font-size: 2.2em; background: linear-gradient(135deg, #2ecc71, #3498db); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-box { background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(52, 152, 219, 0.1)); border: 1px solid #1e3a5f; border-radius: 12px; padding: 25px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #2ecc71; }
        .stat-label { color: #8b92a8; margin-top: 5px; }
        .card { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; overflow: hidden; margin-bottom: 30px; }
        .card-header { background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(52, 152, 219, 0.1)); padding: 20px 25px; border-bottom: 1px solid #1e3a5f; }
        .card-header h2 { color: #2ecc71; font-size: 1.2em; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #1e3a5f; }
        th { background: #0d1117; color: #8b92a8; font-size: 0.8em; text-transform: uppercase; }
        td.date { color: #2ecc71; font-weight: bold; }
        td.symbol { font-weight: bold; color: #fff; }
        td.yield { font-weight: bold; }
        .yield.high { color: #2ecc71; }
        .yield.medium { color: #f1c40f; }
        .yield.low { color: #e74c3c; }
        tr:hover { background: rgba(46, 204, 113, 0.05); }
        footer { text-align: center; padding: 40px 0; color: #4a5568; border-top: 1px solid #1e3a5f; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <nav><a href="/">← Home</a></nav>
        <header>
            <h1>💰 Dividend Calendar</h1>
            <p style="color: #8b92a8; margin-top: 10px;">Upcoming dividend payments & yield leaders</p>
        </header>
        
        <div class="stats">
            <div class="stat-box">
                <div class="stat-number">${upcoming.length}</div>
                <div class="stat-label">Upcoming Payments</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${highYield[0]?.yield.toFixed(1)}%</div>
                <div class="stat-label">Highest Yield</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">$${(upcoming.reduce((a, s) => a + s.dividend, 0)).toFixed(2)}</div>
                <div class="stat-label">Total Dividends</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h2>📅 Upcoming Dividend Payments</h2></div>
            <table>
                <thead><tr><th>Ex-Date</th><th>Symbol</th><th>Company</th><th>Dividend</th><th>Yield</th></tr></thead>
                <tbody>${upcomingRows}</tbody>
            </table>
        </div>

        <div class="card">
            <div class="card-header"><h2>🏆 Top Dividend Yields</h2></div>
            <table>
                <thead><tr><th>Symbol</th><th>Company</th><th>Dividend</th><th>Yield</th><th>Ex-Date</th></tr></thead>
                <tbody>${highYieldRows}</tbody>
            </table>
        </div>

        <footer><p>© ${new Date().getFullYear()} Pre-Market Brief | Dividend data for informational purposes only</p></footer>
    </div>
</body>
</html>`;
}

const html = generateDividendCalendar();
fs.writeFileSync(path.join(__dirname, 'dividend-calendar.html'), html);
console.log('✅ dividend-calendar.html generated');
console.log(`   Tracked: ${DIVIDEND_STOCKS.length} dividend stocks`);
