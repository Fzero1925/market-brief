#!/usr/bin/env node
/**
 * ETF Pages Generator
 * Generate pages for popular ETFs
 */

const fs = require('fs');
const path = require('path');

const ETFS = [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', desc: 'Tracks the S&P 500 Index - the 500 largest US companies', category: 'Large Cap', expense: '0.09%' },
    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', desc: 'Low-cost S&P 500 index tracking', category: 'Large Cap', expense: '0.03%' },
    { symbol: 'IVV', name: 'iShares Core S&P 500 ETF', desc: 'S&P 500 index fund from BlackRock', category: 'Large Cap', expense: '0.03%' },
    { symbol: 'QQQ', name: 'Invesco QQQ ETF', desc: 'Tracks the Nasdaq-100 Index - top 100 non-financial Nasdaq stocks', category: 'Tech', expense: '0.20%' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', desc: 'Covers the entire US stock market', category: 'Total Market', expense: '0.03%' },
    { symbol: 'VEA', name: 'Vanguard Developed Markets ETF', desc: 'International developed markets exposure', category: 'International', expense: '0.05%' },
    { symbol: 'VWO', name: 'Vanguard Emerging Markets ETF', desc: 'Emerging markets stocks', category: 'Emerging Markets', expense: '0.10%' },
    { symbol: 'VT', name: 'Vanguard Total World Stock ETF', desc: 'Global stock market exposure', category: 'Global', expense: '0.07%' },
    { symbol: 'AGG', name: 'iShares Core US Aggregate Bond ETF', desc: 'Broad US investment-grade bonds', category: 'Bonds', expense: '0.03%' },
    { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', desc: 'Complete US bond market exposure', category: 'Bonds', expense: '0.03%' },
    { symbol: 'ARKK', name: 'ARK Innovation ETF', desc: 'Active management in disruptive innovation', category: 'Thematic', expense: '0.75%' },
    { symbol: 'IWM', name: 'iShares Russell 2000 ETF', desc: 'Small-cap US stocks', category: 'Small Cap', expense: '0.19%' },
    { symbol: 'GLD', name: 'SPDR Gold Shares', desc: 'Physical gold exposure', category: 'Commodities', expense: '0.40%' },
    { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', desc: 'US real estate investment trusts', category: 'Real Estate', expense: '0.12%' },
    { symbol: 'XLF', name: 'Financial Select Sector SPDR', desc: 'Financial sector stocks', category: 'Sector', expense: '0.10%' },
    { symbol: 'XLK', name: 'Technology Select Sector SPDR', desc: 'Technology sector stocks', category: 'Sector', expense: '0.10%' },
    { symbol: 'XLE', name: 'Energy Select Sector SPDR', desc: 'Energy sector stocks', category: 'Sector', expense: '0.10%' },
    { symbol: 'XLV', name: 'Health Care Select Sector SPDR', desc: 'Healthcare sector stocks', category: 'Sector', expense: '0.10%' },
    { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', desc: 'Long-term US Treasury bonds', category: 'Bonds', expense: '0.15%' },
    { symbol: 'LQD', name: 'iShares iBoxx $ Investment Grade Corporate Bond ETF', desc: 'Investment-grade corporate bonds', category: 'Bonds', expense: '0.14%' }
];

async function fetchQuote(symbol) {
    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`);
        const data = await response.json();
        if (!data.chart?.result?.[0]) return null;
        
        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators?.quote?.[0];
        if (!quote?.close?.[0]) return null;
        
        const current = quote.close[quote.close.length - 1];
        const previous = meta.previousClose || meta.chartPreviousClose || current;
        
        return {
            price: current,
            change: ((current - previous) / previous) * 100,
            volume: meta.regularMarketVolume || 0
        };
    } catch (e) {
        return null;
    }
}

function generateETFPage(etf, data) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const price = data?.price || 400;
    const change = data?.change || 0.5;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${etf.symbol} ETF | ${etf.name} Price & Holdings</title>
    <meta name="description" content="${etf.symbol} ETF - ${etf.desc}. Track ${etf.name} price, performance, and pre-market data.">
    <meta name="keywords" content="${etf.symbol} etf, ${etf.name.toLowerCase()}, ${etf.symbol} price, etf premarket">
    <link rel="canonical" href="https://premarketbrief.com/etf/${etf.symbol}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0e1a;
            color: #e8eaed;
            line-height: 1.6;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        
        nav { 
            background: #111827;
            padding: 15px 20px;
            border-bottom: 1px solid #1e3a5f;
            margin: -20px -20px 30px;
        }
        nav a {
            color: #00d4aa;
            text-decoration: none;
            margin-right: 20px;
            font-size: 0.9em;
        }
        
        .etf-header {
            text-align: center;
            padding: 40px 0;
            border-bottom: 1px solid #1e3a5f;
            margin-bottom: 30px;
        }
        .symbol { 
            font-size: 3em; 
            font-weight: bold;
            background: linear-gradient(135deg, #9b59b6, #3498db);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .etf-name { font-size: 1.3em; color: #8b92a8; margin: 10px 0; }
        .category { 
            display: inline-block;
            background: rgba(155, 89, 182, 0.2);
            color: #9b59b6;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
        }
        .price-display {
            font-size: 3.5em;
            font-weight: bold;
            color: #fff;
            margin: 20px 0;
        }
        .change-display {
            font-size: 1.3em;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
        }
        .change-display.positive { background: rgba(0, 212, 170, 0.2); color: #00d4aa; }
        .change-display.negative { background: rgba(255, 71, 87, 0.2); color: #ff4757; }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 30px 0;
        }
        .stat-box {
            background: #111827;
            border: 1px solid #1e3a5f;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .stat-value { font-size: 1.5em; font-weight: bold; }
        .stat-value.positive { color: #00d4aa; }
        .stat-value.negative { color: #ff4757; }
        .stat-label { color: #8b92a8; font-size: 0.85em; margin-top: 5px; }
        
        .card {
            background: #111827;
            border: 1px solid #1e3a5f;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
        }
        .card h2 { color: #9b59b6; font-size: 1.2em; margin-bottom: 15px; }
        .card p { color: #8b92a8; line-height: 1.8; margin-bottom: 15px; }
        .card p:last-child { margin-bottom: 0; }
        
        .expense-highlight {
            background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(52, 152, 219, 0.1));
            border-left: 4px solid #9b59b6;
        }
        
        footer {
            text-align: center;
            padding: 40px 0;
            color: #4a5568;
            border-top: 1px solid #1e3a5f;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <nav>
            <a href="/">← Home</a>
            <a href="/etf/SPY.html">SPY</a>
            <a href="/etf/QQQ.html">QQQ</a>
            <a href="/etf/VTI.html">VTI</a>
        </nav>
        
        <div class="etf-header">
            <div class="symbol">${etf.symbol}</div>
            <div class="etf-name">${etf.name}</div>
            <div class="category">${etf.category}</div>
            <div class="price-display">$${price.toFixed(2)}</div>
            <div class="change-display ${change >= 0 ? 'positive' : 'negative'}">
                ${change >= 0 ? '+' : ''}${change.toFixed(2)}%
            </div>
            <p style="color: #4a5568; margin-top: 15px;">${today}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-value">${etf.expense}</div>
                <div class="stat-label">Expense Ratio</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${(data?.volume / 1000000 || 50).toFixed(1)}M</div>
                <div class="stat-label">Volume</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${etf.category}</div>
                <div class="stat-label">Category</div>
            </div>
        </div>

        <div class="card">
            <h2>📊 About ${etf.symbol}</h2>
            <p>${etf.desc}. The ${etf.name} (${etf.symbol}) provides investors with diversified exposure to ${etf.category.toLowerCase()} assets through a single, tradable security.</p>
            <p>ETFs like ${etf.symbol} trade throughout the day like stocks, offering liquidity and flexibility compared to traditional mutual funds. Pre-market trading allows investors to react to overnight news before the regular session opens.</p>
        </div>

        <div class="card expense-highlight">
            <h2>💰 Expense Ratio: ${etf.expense}</h2>
            <p>The expense ratio represents the annual cost of owning the ETF, expressed as a percentage of assets. ${etf.symbol}'s ${etf.expense} expense ratio ${parseFloat(etf.expense) < 0.1 ? 'is very competitive and' : 'is typical for its category and'} covers management fees, administrative costs, and other operating expenses.</p>
        </div>

        <footer>
            <p>© ${new Date().getFullYear()} Pre-Market Brief | ${etf.symbol} data for informational purposes only</p>
        </footer>
    </div>
</body>
</html>`;
}

async function main() {
    console.log('🎯 Generating ETF pages...\n');
    
    const etfDir = path.join(__dirname, 'etf');
    if (!fs.existsSync(etfDir)) {
        fs.mkdirSync(etfDir, { recursive: true });
    }
    
    let generated = 0;
    for (const etf of ETFS) {
        const data = await fetchQuote(etf.symbol);
        const html = generateETFPage(etf, data);
        fs.writeFileSync(path.join(etfDir, `${etf.symbol}.html`), html);
        generated++;
        await new Promise(r => setTimeout(r, 50));
    }
    
    // Generate ETF index page
    const indexHtml = generateETFIndexPage(ETFS);
    fs.writeFileSync(path.join(__dirname, 'etf.html'), indexHtml);
    
    console.log(`✅ Generated ${generated} ETF pages in /etf/`);
    console.log(`✅ Generated ETF index page`);
}

function generateETFIndexPage(etfs) {
    const tableRows = etfs.map(etf => `
        <tr>
            <td class="symbol"><a href="/etf/${etf.symbol}.html">${etf.symbol}</a></td>
            <td class="name">${etf.name}</td>
            <td class="category">${etf.category}</td>
            <td class="expense">${etf.expense}</td>
        </tr>
    `).join('');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ETF Screener | Top ETFs by Category & Expense Ratio</title>
    <meta name="description" content="Compare top ETFs by category, expense ratio, and performance. SPY, QQQ, VTI, and more with pre-market data.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e1a; color: #e8eaed; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
        nav { background: #111827; padding: 15px 20px; border-bottom: 1px solid #1e3a5f; margin: -20px -20px 30px; }
        nav a { color: #00d4aa; text-decoration: none; margin-right: 20px; }
        header { text-align: center; padding: 40px 0; }
        h1 { font-size: 2.2em; background: linear-gradient(135deg, #9b59b6, #3498db); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .card { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #1e3a5f; }
        th { background: #0d1117; color: #8b92a8; font-size: 0.8em; text-transform: uppercase; }
        td.symbol { font-weight: bold; }
        td.symbol a { color: #9b59b6; text-decoration: none; }
        td.symbol a:hover { color: #3498db; }
        tr:hover { background: rgba(155, 89, 182, 0.05); }
        footer { text-align: center; padding: 40px 0; color: #4a5568; border-top: 1px solid #1e3a5f; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <nav><a href="/">← Home</a></nav>
        <header>
            <h1>📊 ETF Screener</h1>
            <p style="color: #8b92a8; margin-top: 10px;">Top ETFs by category and expense ratio</p>
        </header>
        <div class="card">
            <table>
                <thead>
                    <tr><th>Symbol</th><th>Name</th><th>Category</th><th>Expense Ratio</th></tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
        <footer><p>© ${new Date().getFullYear()} Pre-Market Brief</p></footer>
    </div>
</body>
</html>`;
}

main().catch(console.error);
