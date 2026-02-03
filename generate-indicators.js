#!/usr/bin/env node
/**
 * Technical Analysis Pages
 * Popular technical indicators and strategies
 */

const fs = require('fs');
const path = require('path');

const INDICATORS = [
    {
        slug: 'moving-averages',
        name: 'Moving Averages',
        short: 'MA',
        desc: 'Simple and exponential moving averages for trend identification',
        content: `
            <p>Moving averages are the most widely used technical indicators. They smooth out price data to show the underlying trend direction.</p>
            <h3>Simple Moving Average (SMA)</h3>
            <p>The SMA calculates the average price over a specific period. Common periods include 20-day (short-term), 50-day (medium-term), and 200-day (long-term) moving averages.</p>
            <h3>Exponential Moving Average (EMA)</h3>
            <p>The EMA gives more weight to recent prices, making it more responsive to new information. The 12-day and 26-day EMAs are used in MACD calculations.</p>
            <h3>How to Use</h3>
            <p>• Price above MA = Uptrend<br>• Price below MA = Downtrend<br>• Golden Cross (50MA crosses above 200MA) = Bullish signal<br>• Death Cross (50MA crosses below 200MA) = Bearish signal</p>
        `
    },
    {
        slug: 'rsi-indicator',
        name: 'RSI - Relative Strength Index',
        short: 'RSI',
        desc: 'Momentum oscillator measuring speed and change of price movements',
        content: `
            <p>The RSI is a momentum oscillator that measures the speed and magnitude of recent price changes. It oscillates between 0 and 100.</p>
            <h3>Reading RSI</h3>
            <p>• Above 70 = Overbought (potential sell signal)<br>• Below 30 = Oversold (potential buy signal)<br>• 50 = Neutral</p>
            <h3>Divergence</h3>
            <p>Bullish divergence occurs when price makes lower lows but RSI makes higher lows. Bearish divergence occurs when price makes higher highs but RSI makes lower highs.</p>
            <h3>Best Practices</h3>
            <p>Use RSI in conjunction with other indicators. In strong trends, RSI can remain overbought or oversold for extended periods.</p>
        `
    },
    {
        slug: 'macd-indicator',
        name: 'MACD',
        short: 'MACD',
        desc: 'Moving Average Convergence Divergence trend-following momentum indicator',
        content: `
            <p>MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price.</p>
            <h3>Components</h3>
            <p>• MACD Line: 12-day EMA minus 26-day EMA<br>• Signal Line: 9-day EMA of the MACD Line<br>• Histogram: MACD Line minus Signal Line</p>
            <h3>Trading Signals</h3>
            <p>• MACD crosses above signal line = Bullish<br>• MACD crosses below signal line = Bearish<br>• MACD crosses above zero = Bullish trend<br>• MACD crosses below zero = Bearish trend</p>
            <h3>Divergence</h3>
            <p>MACD divergence can signal potential trend reversals before they occur in price action.</p>
        `
    },
    {
        slug: 'bollinger-bands',
        name: 'Bollinger Bands',
        short: 'BB',
        desc: 'Volatility bands placed above and below a moving average',
        content: `
            <p>Bollinger Bands consist of a middle band (20-day SMA) with upper and lower bands (2 standard deviations away from the middle band).</p>
            <h3>Interpretation</h3>
            <p>• Price touching upper band = Potentially overbought<br>• Price touching lower band = Potentially oversold<br>• Squeeze (bands narrowing) = Low volatility, potential breakout ahead<br>• Expansion (bands widening) = High volatility</p>
            <h3>%B Indicator</h3>
            <p>%B measures where price is relative to the bands. Above 1 = above upper band, below 0 = below lower band.</p>
        `
    },
    {
        slug: 'volume-analysis',
        name: 'Volume Analysis',
        short: 'VOL',
        desc: 'Using trading volume to confirm price trends and patterns',
        content: `
            <p>Volume is a crucial indicator that confirms the strength of price movements. High volume confirms trends, while low volume suggests weak moves.</p>
            <h3>Volume Patterns</h3>
            <p>• Rising price + Rising volume = Strong uptrend<br>• Rising price + Falling volume = Weak uptrend (potential reversal)<br>• Falling price + High volume = Strong selling pressure<br>• Breakout on high volume = Valid breakout<br>• Breakout on low volume = False breakout likely</p>
            <h3>Volume Indicators</h3>
            <p>• On-Balance Volume (OBV)<br>• Volume Weighted Average Price (VWAP)<br>• Chaikin Money Flow</p>
        `
    },
    {
        slug: 'support-resistance',
        name: 'Support and Resistance',
        short: 'S/R',
        desc: 'Key price levels where buying or selling pressure concentrates',
        content: `
            <p>Support and resistance are price levels where the market has historically reversed or paused. These are among the most important concepts in technical analysis.</p>
            <h3>Support</h3>
            <p>Support is a price level where buying interest is strong enough to overcome selling pressure. Previous lows, moving averages, and psychological levels often act as support.</p>
            <h3>Resistance</h3>
            <p>Resistance is a price level where selling pressure overcomes buying interest. Previous highs, round numbers, and moving averages often act as resistance.</p>
            <h3>Trading Strategy</h3>
            <p>• Buy near support with stop-loss below<br>• Sell near resistance with stop-loss above<br>• Break above resistance = Buy signal<br>• Break below support = Sell signal</p>
        `
    }
];

function generateIndicatorPage(indicator) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${indicator.name} | Technical Analysis Guide</title>
    <meta name="description" content="Learn how to use ${indicator.name} (${indicator.short}) in technical analysis. Complete guide with examples and trading strategies.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e1a; color: #e8eaed; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        nav { background: #111827; padding: 15px 20px; border-bottom: 1px solid #1e3a5f; margin: -20px -20px 30px; }
        nav a { color: #00d4aa; text-decoration: none; }
        header { text-align: center; padding: 40px 0; border-bottom: 1px solid #1e3a5f; margin-bottom: 30px; }
        h1 { font-size: 2.2em; background: linear-gradient(135deg, #00d4aa, #00a8e8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .tagline { color: #8b92a8; margin-top: 10px; }
        h2 { color: #00d4aa; margin: 30px 0 15px; font-size: 1.3em; }
        h3 { color: #00a8e8; margin: 20px 0 10px; font-size: 1.1em; }
        p { color: #8b92a8; margin-bottom: 15px; line-height: 1.8; }
        .content { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; padding: 30px; }
        footer { text-align: center; padding: 40px 0; color: #4a5568; border-top: 1px solid #1e3a5f; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <nav><a href="/">← Home</a> <a href="/indicators.html">All Indicators</a></nav>
        <header>
            <h1>${indicator.name}</h1>
            <p class="tagline">${indicator.desc}</p>
        </header>
        <div class="content">
            ${indicator.content}
        </div>
        <footer><p>© ${new Date().getFullYear()} Pre-Market Brief | Educational content only</p></footer>
    </div>
</body>
</html>`;
}

function generateIndicatorsIndex() {
    const links = INDICATORS.map(i => `
        <div class="indicator-card">
            <h3><a href="/indicators/${i.slug}.html">${i.name}</a></h3>
            <p>${i.desc}</p>
            <span class="badge">${i.short}</span>
        </div>
    `).join('');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Technical Indicators | Pre-Market Brief</title>
    <meta name="description" content="Learn technical analysis indicators. Moving averages, RSI, MACD, Bollinger Bands, and more explained.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e1a; color: #e8eaed; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
        nav { background: #111827; padding: 15px 20px; border-bottom: 1px solid #1e3a5f; margin: -20px -20px 30px; }
        nav a { color: #00d4aa; text-decoration: none; }
        header { text-align: center; padding: 40px 0; }
        h1 { font-size: 2.2em; background: linear-gradient(135deg, #00d4aa, #00a8e8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
        .indicator-card { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; padding: 25px; }
        .indicator-card h3 { margin-bottom: 10px; }
        .indicator-card h3 a { color: #00d4aa; text-decoration: none; }
        .indicator-card p { color: #8b92a8; margin-bottom: 10px; }
        .badge { background: rgba(0, 212, 170, 0.2); color: #00d4aa; padding: 4px 10px; border-radius: 4px; font-size: 0.8em; }
        footer { text-align: center; padding: 40px 0; color: #4a5568; border-top: 1px solid #1e3a5f; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <nav><a href="/">← Home</a></nav>
        <header>
            <h1>📊 Technical Indicators</h1>
            <p style="color: #8b92a8; margin-top: 10px;">Learn essential technical analysis tools</p>
        </header>
        <div class="grid">${links}</div>
        <footer><p>© ${new Date().getFullYear()} Pre-Market Brief</p></footer>
    </div>
</body>
</html>`;
}

// Generate pages
const indicatorsDir = path.join(__dirname, 'indicators');
if (!fs.existsSync(indicatorsDir)) fs.mkdirSync(indicatorsDir, { recursive: true });

INDICATORS.forEach(i => {
    fs.writeFileSync(path.join(indicatorsDir, `${i.slug}.html`), generateIndicatorPage(i));
});

fs.writeFileSync(path.join(__dirname, 'indicators.html'), generateIndicatorsIndex());

console.log(`✅ Generated ${INDICATORS.length} indicator pages`);
console.log('✅ Generated indicators index page');
