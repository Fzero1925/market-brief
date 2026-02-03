#!/usr/bin/env node
/**
 * Futures Market Page
 * Track stock futures, commodities, and bond futures
 */

const fs = require('fs');
const path = require('path');

const FUTURES = [
    { symbol: 'ES=F', name: 'E-mini S&P 500', unit: 'Index', tick: '0.25' },
    { symbol: 'NQ=F', name: 'E-mini Nasdaq-100', unit: 'Index', tick: '0.25' },
    { symbol: 'YM=F', name: 'E-mini Dow', unit: 'Index', tick: '1.00' },
    { symbol: 'RTY=F', name: 'E-mini Russell 2000', unit: 'Index', tick: '0.10' },
    { symbol: 'GC=F', name: 'Gold', unit: 'Troy Oz', tick: '0.10' },
    { symbol: 'SI=F', name: 'Silver', unit: 'Troy Oz', tick: '0.005' },
    { symbol: 'CL=F', name: 'Crude Oil (WTI)', unit: 'Barrel', tick: '0.01' },
    { symbol: 'NG=F', name: 'Natural Gas', unit: 'MMBtu', tick: '0.001' },
    { symbol: 'ZB=F', name: '30-Year T-Bond', unit: '$100k', tick: '1/32' },
    { symbol: 'ZN=F', name: '10-Year T-Note', unit: '$100k', tick: '1/64' },
    { symbol: '6E=F', name: 'Euro FX', unit: '€125k', tick: '0.0001' },
    { symbol: '6J=F', name: 'Japanese Yen', unit: '¥12.5M', tick: '0.0001' }
];

async function fetchFuturesData(symbol) {
    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`);
        const data = await response.json();
        if (!data.chart?.result?.[0]) return null;
        
        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators?.quote?.[0];
        if (!quote?.close?.[0]) return null;
        
        const prices = quote.close.filter(p => p !== null);
        const current = prices[prices.length - 1];
        const previous = meta.previousClose || current;
        
        return {
            price: current,
            change: ((current - previous) / previous) * 100,
            volume: meta.regularMarketVolume || 0
        };
    } catch (e) {
        return null;
    }
}

async function main() {
    console.log('📈 Generating futures page...\n');
    
    const futuresData = [];
    for (const future of FUTURES) {
        const data = await fetchFuturesData(future.symbol);
        futuresData.push({ ...future, ...data });
        await new Promise(r => setTimeout(r, 50));
    }
    
    const html = generateFuturesPage(futuresData);
    fs.writeFileSync(path.join(__dirname, 'futures.html'), html);
    console.log('✅ futures.html generated');
}

function generateFuturesPage(futures) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const rows = futures.map(f => `
        <tr class="${(f.change || 0) >= 0 ? 'positive' : 'negative'}">
            <td class="symbol">${f.name}</td>
            <td class="ticker">${f.symbol.replace('=F', '')}</td>
            <td class="price">${f.price ? f.price.toFixed(2) : '-'}</td>
            <td class="change">${f.change ? (f.change >= 0 ? '+' : '') + f.change.toFixed(2) + '%' : '-'}</td>
            <td class="unit">${f.unit}</td>
        </tr>
    `).join('');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Futures Market Today | Stock Futures, Gold, Oil & Bond Futures</title>
    <meta name="description" content="Futures market data today. Track S&P 500 futures, Nasdaq futures, gold, crude oil, and bond futures before market open.">
    <meta name="keywords" content="futures market, stock futures, gold futures, oil futures, s&p 500 futures">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e1a; color: #e8eaed; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
        nav { background: #111827; padding: 15px 20px; border-bottom: 1px solid #1e3a5f; margin: -20px -20px 30px; }
        nav a { color: #f39c12; text-decoration: none; margin-right: 20px; }
        header { text-align: center; padding: 40px 0; }
        h1 { font-size: 2.2em; background: linear-gradient(135deg, #f39c12, #e74c3c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .date { color: #f39c12; font-family: monospace; margin-top: 10px; }
        
        .card { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; overflow: hidden; margin-bottom: 30px; }
        .card-header { background: linear-gradient(135deg, rgba(243, 156, 18, 0.1), rgba(231, 76, 60, 0.1)); padding: 20px 25px; border-bottom: 1px solid #1e3a5f; }
        .card-header h2 { color: #f39c12; }
        
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #1e3a5f; }
        th { background: #0d1117; color: #8b92a8; font-size: 0.8em; text-transform: uppercase; }
        td.symbol { font-weight: bold; color: #fff; }
        td.ticker { color: #8b92a8; font-family: monospace; }
        td.price { font-family: monospace; font-size: 1.1em; }
        td.change { font-weight: bold; }
        td.unit { color: #8b92a8; font-size: 0.9em; }
        tr.positive td.change { color: #00d4aa; }
        tr.negative td.change { color: #ff4757; }
        tr:hover { background: rgba(243, 156, 18, 0.05); }
        
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin: 30px 0; }
        .info-card { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; padding: 25px; }
        .info-card h3 { color: #f39c12; margin-bottom: 15px; }
        .info-card p { color: #8b92a8; line-height: 1.8; }
        
        footer { text-align: center; padding: 40px 0; color: #4a5568; border-top: 1px solid #1e3a5f; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <nav><a href="/">← Home</a></nav>
        <header>
            <h1>📈 Futures Market</h1>
            <p class="date">${today}</p>
        </header>

        <div class="card">
            <div class="card-header"><h2>Stock Index Futures</h2></div>
            <table>
                <thead><tr><th>Contract</th><th>Symbol</th><th>Price</th><th>Change</th><th>Unit</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <h3>🌅 Pre-Market Indicator</h3>
                <p>Stock futures trade nearly 24 hours a day, providing an early indication of how the stock market will open. S&P 500 futures (ES) and Nasdaq futures (NQ) are the most closely watched.</p>
            </div>
            <div class="info-card">
                <h3>🛢️ Commodity Futures</h3>
                <p>Crude oil and gold futures react to global events, inflation expectations, and currency movements. These can impact energy and mining stocks significantly.</p>
            </div>
            <div class="info-card">
                <h3>📊 Bond Futures</h3>
                <p>Treasury bond futures reflect interest rate expectations. When yields rise, bond futures fall, affecting financial stocks and mortgage rates.</p>
            </div>
        </div>

        <footer><p>© ${new Date().getFullYear()} Pre-Market Brief | Futures data for informational purposes only</p></footer>
    </div>
</body>
</html>`;
}

main().catch(console.error);
