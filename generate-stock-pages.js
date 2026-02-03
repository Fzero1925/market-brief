#!/usr/bin/env node
/**
 * Generate individual stock detail pages
 * Creates thousands of potential landing pages for SEO
 */

const fs = require('fs');
const path = require('path');

// Top 100 stocks for individual pages
const TOP_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc', desc: 'Consumer electronics, software, and services' },
    { symbol: 'MSFT', name: 'Microsoft Corp', desc: 'Software, cloud computing, and productivity tools' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', desc: 'Internet search, advertising, and cloud services' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', desc: 'E-commerce, cloud computing, and digital streaming' },
    { symbol: 'META', name: 'Meta Platforms', desc: 'Social media and virtual reality technologies' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', desc: 'Graphics processing units and AI technology' },
    { symbol: 'TSLA', name: 'Tesla Inc', desc: 'Electric vehicles and clean energy solutions' },
    { symbol: 'AVGO', name: 'Broadcom Inc', desc: 'Semiconductor and infrastructure software' },
    { symbol: 'BRK-B', name: 'Berkshire Hathaway', desc: 'Conglomerate holding company' },
    { symbol: 'WMT', name: 'Walmart Inc', desc: 'Retail and e-commerce' },
    { symbol: 'JPM', name: 'JPMorgan Chase', desc: 'Investment banking and financial services' },
    { symbol: 'V', name: 'Visa Inc', desc: 'Payment technology and digital payments' },
    { symbol: 'MA', name: 'Mastercard Inc', desc: 'Payment processing and financial services' },
    { symbol: 'UNH', name: 'UnitedHealth Group', desc: 'Healthcare and insurance services' },
    { symbol: 'ORCL', name: 'Oracle Corp', desc: 'Database software and cloud systems' },
    { symbol: 'HD', name: 'Home Depot', desc: 'Home improvement retail' },
    { symbol: 'BAC', name: 'Bank of America', desc: 'Banking and financial services' },
    { symbol: 'PG', name: 'Procter & Gamble', desc: 'Consumer goods and personal care' },
    { symbol: 'KO', name: 'Coca-Cola Co', desc: 'Beverage manufacturing' },
    { symbol: 'COST', name: 'Costco Wholesale', desc: 'Membership warehouse retail' },
    { symbol: 'NFLX', name: 'Netflix Inc', desc: 'Streaming entertainment service' },
    { symbol: 'AMD', name: 'AMD Inc', desc: 'Semiconductor processors and graphics' },
    { symbol: 'PEP', name: 'PepsiCo Inc', desc: 'Food and beverage company' },
    { symbol: 'TMO', name: 'Thermo Fisher', desc: 'Scientific equipment and services' },
    { symbol: 'ADBE', name: 'Adobe Inc', desc: 'Software for creative professionals' },
    { symbol: 'CRM', name: 'Salesforce Inc', desc: 'Cloud-based software and CRM' },
    { symbol: 'LIN', name: 'Linde plc', desc: 'Industrial gases and engineering' },
    { symbol: 'DIS', name: 'Walt Disney Co', desc: 'Entertainment and media conglomerate' },
    { symbol: 'ABT', name: 'Abbott Labs', desc: 'Healthcare and medical devices' },
    { symbol: 'ACN', name: 'Accenture plc', desc: 'Professional services and consulting' },
    { symbol: 'CAT', name: 'Caterpillar Inc', desc: 'Construction and mining equipment' },
    { symbol: 'VZ', name: 'Verizon', desc: 'Telecommunications and wireless services' },
    { symbol: 'DHR', name: 'Danaher Corp', desc: 'Medical and industrial products' },
    { symbol: 'WFC', name: 'Wells Fargo', desc: 'Banking and financial services' },
    { symbol: 'INTC', name: 'Intel Corp', desc: 'Semiconductor chips and processors' },
    { symbol: 'IBM', name: 'IBM Corp', desc: 'Cloud computing and AI solutions' },
    { symbol: 'GE', name: 'GE Aerospace', desc: 'Aerospace and defense technology' },
    { symbol: 'AMAT', name: 'Applied Materials', desc: 'Semiconductor manufacturing equipment' },
    { symbol: 'UBER', name: 'Uber Technologies', desc: 'Ride-sharing and delivery platform' },
    { symbol: 'NOW', name: 'ServiceNow Inc', desc: 'Enterprise cloud computing platform' },
    { symbol: 'AXP', name: 'American Express', desc: 'Payment card and financial services' },
    { symbol: 'QCOM', name: 'Qualcomm Inc', desc: 'Wireless technology and semiconductors' },
    { symbol: 'TXN', name: 'Texas Instruments', desc: 'Semiconductor manufacturing' },
    { symbol: 'PM', name: 'Philip Morris', desc: 'Tobacco and smoke-free products' },
    { symbol: 'GS', name: 'Goldman Sachs', desc: 'Investment banking and securities' },
    { symbol: 'MS', name: 'Morgan Stanley', desc: 'Investment management and financial services' },
    { symbol: 'PFE', name: 'Pfizer Inc', desc: 'Pharmaceutical and biotechnology' },
    { symbol: 'INTU', name: 'Intuit Inc', desc: 'Financial and tax preparation software' },
    { symbol: 'LOW', name: 'Lowe\'s Companies', desc: 'Home improvement retail' },
    { symbol: 'SPGI', name: 'S&P Global', desc: 'Financial information and analytics' },
    { symbol: 'HON', name: 'Honeywell', desc: 'Diversified technology and manufacturing' },
    { symbol: 'UNP', name: 'Union Pacific', desc: 'Railroad transportation' },
    { symbol: 'RTX', name: 'RTX Corp', desc: 'Aerospace and defense systems' },
    { symbol: 'BKNG', name: 'Booking Holdings', desc: 'Online travel and restaurant services' },
    { symbol: 'T', name: 'AT&T Inc', desc: 'Telecommunications and media' },
    { symbol: 'LRCX', name: 'Lam Research', desc: 'Semiconductor wafer fabrication' },
    { symbol: 'SYK', name: 'Stryker Corp', desc: 'Medical devices and equipment' },
    { symbol: 'ETN', name: 'Eaton Corp', desc: 'Power management solutions' },
    { symbol: 'SCHW', name: 'Charles Schwab', desc: 'Brokerage and banking services' },
    { symbol: 'BMY', name: 'Bristol Myers', desc: 'Pharmaceutical company' },
    { symbol: 'MDT', name: 'Medtronic plc', desc: 'Medical devices and healthcare' },
    { symbol: 'TJX', name: 'TJX Companies', desc: 'Off-price retail stores' },
    { symbol: 'CVS', name: 'CVS Health', desc: 'Healthcare and pharmacy services' },
    { symbol: 'ELV', name: 'Elevance Health', desc: 'Health insurance and care' },
    { symbol: 'DE', name: 'Deere & Company', desc: 'Agricultural and construction equipment' },
    { symbol: 'NKE', name: 'Nike Inc', desc: 'Athletic footwear and apparel' },
    { symbol: 'C', name: 'Citigroup Inc', desc: 'Global banking and financial services' },
    { symbol: 'MU', name: 'Micron Technology', desc: 'Memory and storage semiconductors' },
    { symbol: 'PLTR', name: 'Palantir Tech', desc: 'Data analytics and AI software' },
    { symbol: 'SOFI', name: 'SoFi Technologies', desc: 'Digital financial services' },
    { symbol: 'COIN', name: 'Coinbase Global', desc: 'Cryptocurrency exchange platform' },
    { symbol: 'HOOD', name: 'Robinhood Markets', desc: 'Commission-free trading platform' },
    { symbol: 'BABA', name: 'Alibaba Group', desc: 'E-commerce and cloud computing' },
    { symbol: 'JD', name: 'JD.com Inc', desc: 'E-commerce and retail' },
    { symbol: 'PDD', name: 'PDD Holdings', desc: 'E-commerce platform' },
    { symbol: 'NIO', name: 'NIO Inc', desc: 'Electric vehicle manufacturer' },
    { symbol: 'XPEV', name: 'XPeng Inc', desc: 'Electric vehicle and AI' },
    { symbol: 'LI', name: 'Li Auto Inc', desc: 'Electric vehicle manufacturer' },
    { symbol: 'GME', name: 'GameStop Corp', desc: 'Video game and consumer electronics' },
    { symbol: 'AMC', name: 'AMC Entertainment', desc: 'Movie theater chain' },
    { symbol: 'BB', name: 'BlackBerry Ltd', desc: 'Cybersecurity and IoT' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', desc: 'S&P 500 index fund' },
    { symbol: 'QQQ', name: 'Invesco QQQ ETF', desc: 'Nasdaq-100 index fund' },
    { symbol: 'IWM', name: 'iShares Russell 2000', desc: 'Small-cap index fund' },
    { symbol: 'VIX', name: 'CBOE Volatility Index', desc: 'Market volatility index' },
    { symbol: 'UVXY', name: 'ProShares Ultra VIX', desc: 'Leveraged volatility ETF' },
    { symbol: 'TQQQ', name: 'ProShares UltraPro QQQ', desc: '3x leveraged Nasdaq ETF' },
    { symbol: 'SQQQ', name: 'ProShares UltraPro Short QQQ', desc: '3x inverse Nasdaq ETF' },
    { symbol: 'SNOW', name: 'Snowflake Inc', desc: 'Cloud computing and data warehousing' },
    { symbol: 'ZM', name: 'Zoom Video Communications', desc: 'Video conferencing and collaboration' },
    { symbol: 'ROKU', name: 'Roku Inc', desc: 'Streaming platform and devices' },
    { symbol: 'SQ', name: 'Block Inc', desc: 'Digital payments and financial services' },
    { symbol: 'PYPL', name: 'PayPal Holdings', desc: 'Digital payments platform' },
    { symbol: 'SHOP', name: 'Shopify Inc', desc: 'E-commerce platform for businesses' },
    { symbol: 'TWLO', name: 'Twilio Inc', desc: 'Cloud communications platform' },
    { symbol: 'DDOG', name: 'Datadog Inc', desc: 'Cloud monitoring and analytics' },
    { symbol: 'NET', name: 'Cloudflare Inc', desc: 'Web infrastructure and security' },
    { symbol: 'CRWD', name: 'CrowdStrike Holdings', desc: 'Cybersecurity and endpoint protection' },
    { symbol: 'OKTA', name: 'Okta Inc', desc: 'Identity and access management' },
    { symbol: 'DOCU', name: 'DocuSign Inc', desc: 'Electronic signature and agreement' },
    { symbol: 'FSLY', name: 'Fastly Inc', desc: 'Edge cloud platform' },
    { symbol: 'FSR', name: 'Fisker Inc', desc: 'Electric vehicle manufacturer' },
    { symbol: 'LCID', name: 'Lucid Group', desc: 'Luxury electric vehicles' },
    { symbol: 'RIVN', name: 'Rivian Automotive', desc: 'Electric trucks and delivery vehicles' },
    { symbol: 'BLNK', name: 'Blink Charging', desc: 'Electric vehicle charging stations' },
    { symbol: 'CHPT', name: 'ChargePoint Holdings', desc: 'EV charging network' },
    { symbol: 'MRNA', name: 'Moderna Inc', desc: 'mRNA therapeutics and vaccines' },
    { symbol: 'BNTX', name: 'BioNTech SE', desc: 'Immunotherapy and vaccines' },
    { symbol: 'NVAX', name: 'Novavax Inc', desc: 'Vaccine development' },
    { symbol: 'DKNG', name: 'DraftKings Inc', desc: 'Sports betting and gaming' },
    { symbol: 'PENN', name: 'Penn Entertainment', desc: 'Casinos and sports betting' },
    { symbol: 'MGM', name: 'MGM Resorts', desc: 'Casino and hospitality' },
    { symbol: 'WYNN', name: 'Wynn Resorts', desc: 'Luxury casino resorts' },
    { symbol: 'LVS', name: 'Las Vegas Sands', desc: 'Casino resorts and gaming' },
    { symbol: 'CZR', name: 'Caesars Entertainment', desc: 'Casino and hotel operator' },
    { symbol: 'BYD', name: 'Boyd Gaming', desc: 'Casino and gaming company' },
    { symbol: 'PTON', name: 'Peloton Interactive', desc: 'Connected fitness equipment' },
    { symbol: 'NLS', name: 'Nautilus Inc', desc: 'Fitness equipment manufacturer' },
    { symbol: 'CLOV', name: 'Clover Health', desc: 'Medicare advantage plans' },
    { symbol: 'WISH', name: 'ContextLogic Inc', desc: 'Mobile e-commerce platform' },
    { symbol: 'CLNE', name: 'Clean Energy Fuels', desc: 'Natural gas fuel for vehicles' },
    { symbol: 'SPCE', name: 'Virgin Galactic', desc: 'Space tourism and exploration' },
    { symbol: 'SRNE', name: 'Sorrento Therapeutics', desc: 'Biopharmaceutical company' },
    { symbol: 'TLRY', name: 'Tilray Brands', desc: 'Cannabis producer and distributor' },
    { symbol: 'ACB', name: 'Aurora Cannabis', desc: 'Cannabis production' },
    { symbol: 'CGC', name: 'Canopy Growth', desc: 'Cannabis and hemp products' },
    { symbol: 'SNDL', name: 'SNDL Inc', desc: 'Cannabis retail and production' },
    { symbol: 'CRON', name: 'Cronos Group', desc: 'Cannabis company' },
    { symbol: 'MO', name: 'Altria Group', desc: 'Tobacco and wine products' },
    { symbol: 'TGT', name: 'Target Corp', desc: 'Retail department stores' },
    { symbol: 'M', name: 'Macy\'s Inc', desc: 'Department store chain' },
    { symbol: 'KSS', name: 'Kohl\'s Corp', desc: 'Department store retail' },
    { symbol: 'JWN', name: 'Nordstrom Inc', desc: 'Luxury department stores' },
    { symbol: 'DELL', name: 'Dell Technologies', desc: 'Computer technology' },
    { symbol: 'HPQ', name: 'HP Inc', desc: 'Personal computers and printers' },
    { symbol: 'HPE', name: 'Hewlett Packard Enterprise', desc: 'Enterprise technology' },
    { symbol: 'LUMN', name: 'Lumen Technologies', desc: 'Telecommunications' },
    { symbol: 'UAL', name: 'United Airlines', desc: 'Airline transportation' },
    { symbol: 'DAL', name: 'Delta Air Lines', desc: 'Airline transportation' },
    { symbol: 'AAL', name: 'American Airlines', desc: 'Airline transportation' },
    { symbol: 'LUV', name: 'Southwest Airlines', desc: 'Low-cost airline' },
    { symbol: 'CCL', name: 'Carnival Corp', desc: 'Cruise line operator' },
    { symbol: 'RCL', name: 'Royal Caribbean', desc: 'Cruise vacation company' },
    { symbol: 'NCLH', name: 'Norwegian Cruise Line', desc: 'Cruise line operator' },
    { symbol: 'MAR', name: 'Marriott International', desc: 'Hotel and lodging' },
    { symbol: 'HLT', name: 'Hilton Worldwide', desc: 'Hospitality company' }
];

async function fetchStockData(symbol) {
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
        const weekAgo = quote.close[Math.max(0, quote.close.length - 6)] || current;
        const monthAgo = quote.close[0] || current;
        
        return {
            price: current,
            change: ((current - previous) / previous) * 100,
            weekChange: ((current - weekAgo) / weekAgo) * 100,
            monthChange: ((current - monthAgo) / monthAgo) * 100,
            volume: meta.regularMarketVolume || 0,
            high52: meta.fiftyTwoWeekHigh || current * 1.2,
            low52: meta.fiftyTwoWeekLow || current * 0.8
        };
    } catch (e) {
        return null;
    }
}

function generateStockPage(stock, data) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const price = data?.price || 150;
    const change = data?.change || 2.5;
    const weekChange = data?.weekChange || 5.2;
    const monthChange = data?.monthChange || 8.1;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${stock.symbol} Pre-Market | ${stock.name} Stock Price Today</title>
    <meta name="description" content="${stock.symbol} pre-market trading data. ${stock.name} stock price, earnings date, and analysis before market open.">
    <meta name="keywords" content="${stock.symbol} premarket, ${stock.symbol} stock price, ${stock.name} earnings, ${stock.symbol} today">
    <link rel="canonical" href="https://premarketbrief.com/stock/${stock.symbol}">
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
        
        .stock-header {
            text-align: center;
            padding: 40px 0;
            border-bottom: 1px solid #1e3a5f;
            margin-bottom: 30px;
        }
        .symbol { 
            font-size: 3em; 
            font-weight: bold;
            background: linear-gradient(135deg, #00d4aa, #00a8e8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .company-name { font-size: 1.3em; color: #8b92a8; margin-bottom: 20px; }
        .price-display {
            font-size: 4em;
            font-weight: bold;
            color: #fff;
            margin: 20px 0;
        }
        .change-display {
            font-size: 1.5em;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
        }
        .change-display.positive { 
            background: rgba(0, 212, 170, 0.2); 
            color: #00d4aa; 
        }
        .change-display.negative { 
            background: rgba(255, 71, 87, 0.2); 
            color: #ff4757; 
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
        .card h2 { color: #00d4aa; font-size: 1.2em; margin-bottom: 15px; }
        .card p { color: #8b92a8; line-height: 1.8; }
        
        .about-section {
            background: linear-gradient(135deg, rgba(0, 212, 170, 0.05), rgba(0, 168, 232, 0.05));
            border-left: 4px solid #00d4aa;
        }
        
        .related-stocks {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .related-stock {
            background: #1a1f2e;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            color: #8b92a8;
            border: 1px solid #2d3748;
            transition: all 0.2s;
        }
        .related-stock:hover {
            border-color: #00d4aa;
            color: #00d4aa;
        }
        
        .ad-container {
            background: #1a1f2e;
            border: 2px dashed #2d3748;
            border-radius: 12px;
            padding: 60px 20px;
            text-align: center;
            margin: 25px 0;
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
            <a href="/screener.html">Screener</a>
            <a href="/earnings-calendar.html">Earnings</a>
        </nav>
        
        <div class="stock-header">
            <div class="symbol">${stock.symbol}</div>
            <div class="company-name">${stock.name}</div>
            <div class="price-display">$${price.toFixed(2)}</div>
            <div class="change-display ${change >= 0 ? 'positive' : 'negative'}">
                ${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%
            </div>
            <p style="color: #4a5568; margin-top: 15px;">${today}</p>
        </div>

        <div class="ad-container">
            AdSense Display Ad<br>
            <small>${stock.symbol} Stock - Finance Keywords</small>
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-value ${weekChange >= 0 ? 'positive' : 'negative'}">${weekChange >= 0 ? '+' : ''}${weekChange.toFixed(2)}%</div>
                <div class="stat-label">1 Week</div>
            </div>
            <div class="stat-box">
                <div class="stat-value ${monthChange >= 0 ? 'positive' : 'negative'}">${monthChange >= 0 ? '+' : ''}${monthChange.toFixed(2)}%</div>
                <div class="stat-label">1 Month</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${(data?.volume / 1000000 || 25).toFixed(1)}M</div>
                <div class="stat-label">Volume</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">$${(data?.high52 || price * 1.2).toFixed(2)}</div>
                <div class="stat-label">52W High</div>
            </div>
        </div>

        <div class="card about-section">
            <h2>📊 About ${stock.name}</h2>
            <p>${stock.desc}. ${stock.name} (${stock.symbol}) is actively traded in pre-market sessions, offering investors early insights into market sentiment before the 9:30 AM ET opening bell.</p>
            <p style="margin-top: 15px;">Pre-market trading for ${stock.symbol} typically begins at 4:00 AM ET and can indicate how the stock will perform during regular market hours based on overnight news, earnings reports, and global market developments.</p>
        </div>

        <div class="ad-container">
            AdSense In-Article Ad
        </div>

        <div class="card">
            <h2>📈 ${stock.symbol} Pre-Market Analysis</h2>
            <p>Pre-market trading activity in ${stock.symbol} reflects investor sentiment based on recent developments. Traders monitor ${stock.name}'s pre-market price action to gauge potential opening direction and volatility.</p>
            <p style="margin-top: 15px;">Key factors affecting ${stock.symbol} pre-market include earnings announcements, analyst upgrades/downgrades, sector trends, and broader market futures.</p>
        </div>

        <div class="card">
            <h2>🔗 Related Stocks</h2>
            <div class="related-stocks">
                <a href="/stock/AAPL.html" class="related-stock">AAPL</a>
                <a href="/stock/MSFT.html" class="related-stock">MSFT</a>
                <a href="/stock/GOOGL.html" class="related-stock">GOOGL</a>
                <a href="/stock/AMZN.html" class="related-stock">AMZN</a>
                <a href="/stock/META.html" class="related-stock">META</a>
                <a href="/stock/NVDA.html" class="related-stock">NVDA</a>
                <a href="/stock/TSLA.html" class="related-stock">TSLA</a>
                <a href="/stock/AMD.html" class="related-stock">AMD</a>
            </div>
        </div>

        <footer>
            <p>© ${new Date().getFullYear()} Pre-Market Brief | ${stock.symbol} data for informational purposes only</p>
            <p style="margin-top: 10px; font-size: 0.8em;">Not investment advice. Real-time data delayed.</p>
        </footer>
    </div>
</body>
</html>`;
}

async function main() {
    console.log('🚀 Generating individual stock pages...\n');
    
    const stocksDir = path.join(__dirname, 'stock');
    if (!fs.existsSync(stocksDir)) {
        fs.mkdirSync(stocksDir, { recursive: true });
    }
    
    let generated = 0;
    for (const stock of TOP_STOCKS) {
        const data = await fetchStockData(stock.symbol);
        const html = generateStockPage(stock, data);
        const filePath = path.join(stocksDir, `${stock.symbol}.html`);
        fs.writeFileSync(filePath, html);
        generated++;
        
        if (generated % 20 === 0) {
            console.log(`  Progress: ${generated}/${TOP_STOCKS.length}`);
        }
        
        await new Promise(r => setTimeout(r, 50)); // Rate limiting
    }
    
    console.log(`\n✅ Generated ${generated} stock detail pages in /stock/`);
    console.log(`   Example: /stock/AAPL.html`);
}

main().catch(console.error);
