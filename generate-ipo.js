#!/usr/bin/env node
/**
 * IPO Calendar - Upcoming IPOs
 * High-value keywords: IPO calendar, upcoming IPOs, new stock listings
 */

const fs = require('fs');
const path = require('path');

// Mock IPO data (real data would come from a financial API)
const UPCOMING_IPOS = [
    { 
        company: 'TechFlow AI', 
        symbol: 'TFAI', 
        date: '2025-02-10',
        priceRange: '$18-22',
        shares: '15M',
        marketCap: '$450M',
        exchange: 'NASDAQ',
        sector: 'Artificial Intelligence',
        underwriters: ['Goldman Sachs', 'Morgan Stanley']
    },
    { 
        company: 'GreenEnergy Solutions', 
        symbol: 'GRES', 
        date: '2025-02-12',
        priceRange: '$12-15',
        shares: '20M',
        marketCap: '$300M',
        exchange: 'NYSE',
        sector: 'Clean Energy',
        underwriters: ['JP Morgan', 'Bank of America']
    },
    { 
        company: 'CloudMatrix Systems', 
        symbol: 'CMSY', 
        date: '2025-02-15',
        priceRange: '$25-28',
        shares: '12M',
        marketCap: '$650M',
        exchange: 'NASDAQ',
        sector: 'Cloud Computing',
        underwriters: ['Deutsche Bank', 'Credit Suisse']
    },
    { 
        company: 'BioGenetics Labs', 
        symbol: 'BGLX', 
        date: '2025-02-18',
        priceRange: '$8-10',
        shares: '8M',
        marketCap: '$150M',
        exchange: 'NASDAQ',
        sector: 'Biotechnology',
        underwriters: ['Jefferies', 'Piper Sandler']
    },
    { 
        company: 'RoboTech Industries', 
        symbol: 'ROTI', 
        date: '2025-02-20',
        priceRange: '$15-18',
        shares: '18M',
        marketCap: '$400M',
        exchange: 'NYSE',
        sector: 'Robotics',
        underwriters: ['Citigroup', 'Barclays']
    },
    { 
        company: 'FinServe Digital', 
        symbol: 'FSDG', 
        date: '2025-02-25',
        priceRange: '$20-24',
        shares: '10M',
        marketCap: '$350M',
        exchange: 'NASDAQ',
        sector: 'Fintech',
        underwriters: ['Goldman Sachs', 'UBS']
    },
    { 
        company: 'HealthPulse Medical', 
        symbol: 'HPME', 
        date: '2025-03-01',
        priceRange: '$14-17',
        shares: '14M',
        marketCap: '$280M',
        exchange: 'NYSE',
        sector: 'Healthcare',
        underwriters: ['Morgan Stanley', 'Wells Fargo']
    },
    { 
        company: 'DataSecure Corp', 
        symbol: 'DTSC', 
        date: '2025-03-05',
        priceRange: '$22-26',
        shares: '11M',
        marketCap: '$520M',
        exchange: 'NASDAQ',
        sector: 'Cybersecurity',
        underwriters: ['JP Morgan', 'Deutsche Bank']
    }
];

const RECENT_IPOS = [
    { company: 'SpaceVehicles Inc', symbol: 'SPVI', date: '2025-01-28', price: '$24.00', current: '$28.50', change: '+18.75%' },
    { company: 'QuantumLeap AI', symbol: 'QNTM', date: '2025-01-22', price: '$19.00', current: '$17.20', change: '-9.47%' },
    { company: 'EduTech Global', symbol: 'EDUT', date: '2025-01-15', price: '$15.00', current: '$16.80', change: '+12.00%' },
    { company: 'MedDevice Pro', symbol: 'MDVP', date: '2025-01-10', price: '$21.00', current: '$23.40', change: '+11.43%' },
];

function generateIPOPage() {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };
    
    const upcomingTable = UPCOMING_IPOS.map(ipo => `
        <tr>
            <td class="date">${formatDate(ipo.date)}</td>
            <td class="company">
                <div class="company-name">${ipo.company}</div>
                <div class="company-symbol">${ipo.symbol}</div>
            </td>
            <td class="exchange"><span class="tag exchange-${ipo.exchange.toLowerCase()}">${ipo.exchange}</span></td>
            <td class="sector">${ipo.sector}</td>
            <td class="price">${ipo.priceRange}</td>
            <td class="shares">${ipo.shares}</td>
            <td class="market-cap">${ipo.marketCap}</td>
        </tr>
    `).join('');
    
    const recentTable = RECENT_IPOS.map(ipo => `
        <tr>
            <td class="date">${formatDate(ipo.date)}</td>
            <td class="company">
                <div class="company-name">${ipo.company}</div>
                <div class="company-symbol">${ipo.symbol}</div>
            </td>
            <td class="price">${ipo.price}</td>
            <td class="current">${ipo.current}</td>
            <td class="performance ${ipo.change.startsWith('+') ? 'positive' : 'negative'}">${ipo.change}</td>
        </tr>
    `).join('');
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IPO Calendar 2025 | Upcoming IPOs & New Stock Listings</title>
    <meta name="description" content="IPO calendar for 2025. Track upcoming IPOs, new stock listings, and recent IPO performance. Stay informed on the latest public offerings.">
    <meta name="keywords" content="IPO calendar, upcoming IPOs, new stock listings, IPO schedule, initial public offering">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0e1a;
            color: #e8eaed;
            line-height: 1.6;
        }
        .container { max-width: 1100px; margin: 0 auto; padding: 20px; }
        
        header { text-align: center; padding: 40px 0 30px; }
        h1 { 
            font-size: 2.2em; 
            background: linear-gradient(135deg, #9b59b6, #3498db);
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
            color: #9b59b6;
            text-decoration: none;
            margin-right: 20px;
            font-size: 0.9em;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-box {
            background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(52, 152, 219, 0.1));
            border: 1px solid #1e3a5f;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
        }
        .stat-number { font-size: 2.5em; font-weight: bold; color: #9b59b6; }
        .stat-label { color: #8b92a8; margin-top: 5px; }
        
        .card {
            background: #111827;
            border: 1px solid #1e3a5f;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 30px;
        }
        .card-header {
            background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(52, 152, 219, 0.1));
            padding: 20px 25px;
            border-bottom: 1px solid #1e3a5f;
        }
        .card-header h2 { color: #9b59b6; font-size: 1.2em; }
        
        table { width: 100%; border-collapse: collapse; }
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #1e3a5f;
        }
        th {
            background: #0d1117;
            color: #8b92a8;
            font-weight: 600;
            font-size: 0.8em;
            text-transform: uppercase;
        }
        tr:hover { background: rgba(155, 89, 182, 0.05); }
        
        td.date { color: #9b59b6; font-weight: bold; }
        td.company { font-weight: bold; }
        td.company .company-symbol { color: #8b92a8; font-size: 0.85em; font-weight: normal; }
        td.exchange { text-align: center; }
        td.price { font-family: monospace; }
        td.performance { font-weight: bold; }
        .positive { color: #00d4aa; }
        .negative { color: #ff4757; }
        
        .tag {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.75em;
            font-weight: bold;
        }
        .tag.exchange-nasdaq { background: rgba(0, 212, 170, 0.2); color: #00d4aa; }
        .tag.exchange-nyse { background: rgba(52, 152, 219, 0.2); color: #3498db; }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin: 30px 0;
        }
        .info-card {
            background: #111827;
            border: 1px solid #1e3a5f;
            border-radius: 12px;
            padding: 25px;
        }
        .info-card h3 {
            color: #9b59b6;
            margin-bottom: 15px;
            font-size: 1.1em;
        }
        .info-card p {
            color: #8b92a8;
            line-height: 1.8;
            margin-bottom: 10px;
        }
        .info-card p:last-child { margin-bottom: 0; }
        
        .ad-container {
            background: #1a1f2e;
            border: 2px dashed #2d3748;
            border-radius: 12px;
            padding: 60px 20px;
            text-align: center;
            margin: 30px 0;
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
            <a href="/ipo-calendar.html">IPO Calendar</a>
        </nav>
        
        <header>
            <h1>🚀 IPO Calendar 2025</h1>
            <p class="tagline">Upcoming IPOs & new stock listings</p>
        </header>

        <div class="ad-container">
            AdSense Display Ad<br>
            <small>Investment & Finance Keywords</small>
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-number">${UPCOMING_IPOS.length}</div>
                <div class="stat-label">Upcoming IPOs</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${RECENT_IPOS.length}</div>
                <div class="stat-label">Recent Listings</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${UPCOMING_IPOS.filter(i => i.exchange === 'NASDAQ').length}</div>
                <div class="stat-label">NASDAQ IPOs</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${UPCOMING_IPOS.filter(i => i.exchange === 'NYSE').length}</div>
                <div class="stat-label">NYSE IPOs</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>📅 Upcoming IPOs</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Company</th>
                        <th>Exchange</th>
                        <th>Sector</th>
                        <th>Price Range</th>
                        <th>Shares</th>
                        <th>Market Cap</th>
                    </tr>
                </thead>
                <tbody>
                    ${upcomingTable}
                </tbody>
            </table>
        </div>

        <div class="ad-container">
            AdSense In-Article Ad
        </div>

        <div class="card">
            <div class="card-header">
                <h2>📈 Recent IPO Performance</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Company</th>
                        <th>IPO Price</th>
                        <th>Current</th>
                        <th>Performance</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentTable}
                </tbody>
            </table>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <h3>📖 What is an IPO?</h3>
                <p>An Initial Public Offering (IPO) is when a private company first sells shares to the public. This process transforms a private company into a publicly traded one.</p>
                <p>IPOs allow companies to raise capital from public investors while giving early investors and employees a way to monetize their equity.</p>
            </div>
            <div class="info-card">
                <h3>💡 IPO Investment Tips</h3>
                <p>• Research the company's financials and growth prospects</p>
                <p>• Understand the lock-up period (typically 180 days)</p>
                <p>• Be aware of IPO volatility - first day swings can be extreme</p>
                <p>• Consider waiting for the initial hype to settle</p>
            </div>
            <div class="info-card">
                <h3>📊 2025 IPO Market</h3>
                <p>The IPO market in 2025 is seeing renewed activity after a quiet 2023-2024. Technology, AI, and clean energy companies are leading the pipeline.</p>
                <p>Investor appetite for growth stocks has improved, making conditions favorable for new listings.</p>
            </div>
        </div>

        <footer>
            <p>© ${new Date().getFullYear()} Pre-Market Brief | IPO data for informational purposes</p>
            <p style="margin-top: 10px; font-size: 0.8em;">Not investment advice. IPO dates subject to change.</p>
        </footer>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(__dirname, 'ipo-calendar.html'), html);
    console.log('✅ ipo-calendar.html generated');
    console.log(`   Upcoming: ${UPCOMING_IPOS.length} IPOs`);
    console.log(`   Recent: ${RECENT_IPOS.length} IPOs`);
}

generateIPOPage();
