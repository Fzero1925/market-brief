#!/usr/bin/env node
/**
 * Stock Screener - Pre-Market Filter Tool
 * High-value keywords: stock screener, premarket scanner, gap up stocks
 */

const fs = require('fs');
const path = require('path');

async function fetchQuote(symbol) {
    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
        const data = await response.json();
        
        if (!data.chart?.result?.[0]) return null;
        
        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators?.quote?.[0];
        
        if (!quote?.close?.[0]) return null;
        
        const current = quote.close[quote.close.length - 1];
        const previous = meta.previousClose || meta.chartPreviousClose || current;
        const change = current - previous;
        const changePercent = (change / previous) * 100;
        
        return {
            symbol,
            price: current,
            change,
            changePercent,
            volume: meta.regularMarketVolume || 0,
            marketCap: meta.marketCap || 0
        };
    } catch (e) {
        return null;
    }
}

// Screen criteria
const SCREENS = {
    gapUp: { name: 'Gap Up Stocks', minChange: 5 },
    gapDown: { name: 'Gap Down Stocks', maxChange: -5 },
    highVolume: { name: 'High Volume Movers', minVolume: 10000000 },
    pennyStocks: { name: 'Penny Stock Movers', maxPrice: 5 },
    largeCap: { name: 'Large Cap Movers', minMarketCap: 10000000000 }
};

const WATCHLIST = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'NFLX',
    'BABA', 'JD', 'PDD', 'PLTR', 'SOFI', 'COIN', 'HOOD', 'GME', 'AMC',
    'SPY', 'QQQ', 'IWM', 'VIX', 'UVXY', 'SQQQ', 'TQQQ',
    'F', 'GE', 'T', 'BAC', 'XOM', 'CVX', 'OXY', 'MSTR'
];

async function generateScreener() {
    console.log('Fetching stocks for screener...\n');
    
    const stocks = [];
    for (const symbol of WATCHLIST) {
        const data = await fetchQuote(symbol);
        if (data) {
            // Fetch company info
            try {
                const summaryRes = await fetch(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=quoteType,assetProfile`);
                const summary = await summaryRes.json();
                const quoteType = summary.quoteSummary?.result?.[0]?.quoteType;
                data.name = quoteType?.longName || quoteType?.shortName || symbol;
                data.sector = summary.quoteSummary?.result?.[0]?.assetProfile?.industry || 'N/A';
            } catch {
                data.name = symbol;
                data.sector = 'N/A';
            }
            stocks.push(data);
        }
        await new Promise(r => setTimeout(r, 50));
    }
    
    // Apply screens
    const gapUp = stocks.filter(s => s.changePercent >= 5).sort((a, b) => b.changePercent - a.changePercent);
    const gapDown = stocks.filter(s => s.changePercent <= -5).sort((a, b) => a.changePercent - b.changePercent);
    const highVolume = stocks.filter(s => s.volume > 10000000).sort((a, b) => b.volume - a.volume);
    const pennyMovers = stocks.filter(s => s.price < 5 && Math.abs(s.changePercent) > 2).sort((a, b) => b.changePercent - a.changePercent);
    
    const generateStockList = (items) => items.slice(0, 20).map(s => `
        <div class="stock-card ${s.changePercent >= 0 ? 'up' : 'down'}">
            <div class="stock-header">
                <span class="symbol">${s.symbol}</span>
                <span class="sector">${s.sector}</span>
            </div>
            <div class="stock-name">${s.name}</div>
            <div class="stock-metrics">
                <div class="metric">
                    <span class="label">Price</span>
                    <span class="value">$${s.price.toFixed(2)}</span>
                </div>
                <div class="metric">
                    <span class="label">Change</span>
                    <span class="value change ${s.changePercent >= 0 ? 'positive' : 'negative'}">${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%</span>
                </div>
                <div class="metric">
                    <span class="label">Volume</span>
                    <span class="value">${(s.volume / 1000000).toFixed(1)}M</span>
                </div>
            </div>
        </div>
    `).join('');
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock Screener | Pre-Market Gap Up & High Volume Scanner</title>
    <meta name="description" content="Free pre-market stock screener. Find gap up stocks, high volume movers, and premarket gainers before the market opens.">
    <meta name="keywords" content="stock screener, premarket scanner, gap up stocks, high volume stocks, pre market filter">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0e1a;
            color: #e8eaed;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        
        header { text-align: center; padding: 40px 0; }
        h1 { 
            font-size: 2.2em; 
            background: linear-gradient(135deg, #00d4aa, #00a8e8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .tagline { color: #8b92a8; }
        
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
        
        .filters {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 30px;
            padding: 20px;
            background: #111827;
            border-radius: 12px;
            border: 1px solid #1e3a5f;
        }
        .filter-btn {
            background: #1a1f2e;
            border: 1px solid #2d3748;
            color: #8b92a8;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .filter-btn:hover, .filter-btn.active {
            background: rgba(0, 212, 170, 0.1);
            border-color: #00d4aa;
            color: #00d4aa;
        }
        
        .screen-section {
            margin-bottom: 40px;
        }
        .screen-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .screen-header h2 {
            color: #00d4aa;
            font-size: 1.3em;
        }
        .count-badge {
            background: rgba(0, 212, 170, 0.2);
            color: #00d4aa;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
        }
        
        .stock-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        .stock-card {
            background: #111827;
            border: 1px solid #1e3a5f;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.2s;
        }
        .stock-card:hover {
            border-color: #00d4aa;
            transform: translateY(-2px);
        }
        .stock-card.up { border-left: 4px solid #00d4aa; }
        .stock-card.down { border-left: 4px solid #ff4757; }
        
        .stock-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .symbol { font-size: 1.3em; font-weight: bold; color: #fff; }
        .sector { font-size: 0.75em; color: #8b92a8; background: #1a1f2e; padding: 3px 8px; border-radius: 4px; }
        .stock-name { color: #8b92a8; font-size: 0.9em; margin-bottom: 15px; }
        
        .stock-metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }
        .metric { text-align: center; }
        .metric .label { display: block; font-size: 0.7em; color: #4a5568; text-transform: uppercase; }
        .metric .value { display: block; font-size: 1.1em; font-weight: bold; margin-top: 5px; }
        .positive { color: #00d4aa; }
        .negative { color: #ff4757; }
        
        .ad-container {
            background: #1a1f2e;
            border: 2px dashed #2d3748;
            border-radius: 12px;
            padding: 60px 20px;
            text-align: center;
            margin: 30px 0;
            color: #4a5568;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px;
            color: #4a5568;
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
            <a href="/earnings-calendar.html">Earnings</a>
            <a href="/screener.html">Screener</a>
            <a href="/crypto.html">Crypto</a>
        </nav>
        
        <header>
            <h1>🔍 Pre-Market Screener</h1>
            <p class="tagline">Find gap up stocks and high volume movers</p>
        </header>

        <div class="ad-container">
            AdSense Header Ad<br>
            <small>Stock Trading Keywords</small>
        </div>

        <div class="filters">
            <button class="filter-btn active">All Stocks</button>
            <button class="filter-btn">Gap Up >5%</button>
            <button class="filter-btn">Gap Down >5%</button>
            <button class="filter-btn">High Volume</button>
            <button class="filter-btn">Penny Stocks</button>
        </div>

        <div class="screen-section">
            <div class="screen-header">
                <h2>🚀 Gap Up Stocks (>5%)</h2>
                <span class="count-badge">${gapUp.length} Results</span>
            </div>
            <div class="stock-grid">
                ${gapUp.length > 0 ? generateStockList(gapUp) : '<div class="empty-state">No stocks gapping up more than 5% in pre-market</div>'}
            </div>
        </div>

        <div class="ad-container">
            AdSense In-Feed Ad
        </div>

        <div class="screen-section">
            <div class="screen-header">
                <h2>📉 Gap Down Stocks (<-5%)</h2>
                <span class="count-badge">${gapDown.length} Results</span>
            </div>
            <div class="stock-grid">
                ${gapDown.length > 0 ? generateStockList(gapDown) : '<div class="empty-state">No stocks gapping down more than 5% in pre-market</div>'}
            </div>
        </div>

        <div class="screen-section">
            <div class="screen-header">
                <h2>🔥 High Volume Movers</h2>
                <span class="count-badge">${highVolume.length} Results</span>
            </div>
            <div class="stock-grid">
                ${highVolume.length > 0 ? generateStockList(highVolume) : '<div class="empty-state">No high volume stocks found</div>'}
            </div>
        </div>

        <div class="screen-section">
            <div class="screen-header">
                <h2>💰 Penny Stock Movers (<$5)</h2>
                <span class="count-badge">${pennyMovers.length} Results</span>
            </div>
            <div class="stock-grid">
                ${pennyMovers.length > 0 ? generateStockList(pennyMovers) : '<div class="empty-state">No penny stocks moving significantly</div>'}
            </div>
        </div>

        <footer>
            <p>© ${new Date().getFullYear()} Pre-Market Brief | Real-time stock screening</p>
            <p style="margin-top: 10px; font-size: 0.8em;">Data delayed. Not investment advice.</p>
        </footer>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(__dirname, 'screener.html'), html);
    console.log('✅ screener.html generated');
    console.log(`   Gap Up: ${gapUp.length}`);
    console.log(`   Gap Down: ${gapDown.length}`);
    console.log(`   High Volume: ${highVolume.length}`);
}

generateScreener().catch(console.error);
