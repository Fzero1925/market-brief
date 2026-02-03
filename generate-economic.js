#!/usr/bin/env node
/**
 * Economic Calendar - Fed meetings, jobs reports, inflation data
 * High-value keywords: economic calendar, fed meeting schedule, jobs report
 */

const fs = require('fs');
const path = require('path');

const ECONOMIC_EVENTS = [
    { date: '2025-02-05', time: '8:30 AM ET', event: 'ADP Employment Report', impact: 'high', forecast: '155K', previous: '163K' },
    { date: '2025-02-07', time: '8:30 AM ET', event: 'Nonfarm Payrolls', impact: 'high', forecast: '180K', previous: '256K' },
    { date: '2025-02-07', time: '8:30 AM ET', event: 'Unemployment Rate', impact: 'high', forecast: '4.1%', previous: '4.1%' },
    { date: '2025-02-12', time: '8:30 AM ET', event: 'CPI Inflation Data', impact: 'high', forecast: '2.9%', previous: '2.9%' },
    { date: '2025-02-13', time: '8:30 AM ET', event: 'PPI Producer Price Index', impact: 'medium', forecast: '0.2%', previous: '0.2%' },
    { date: '2025-02-14', time: '8:30 AM ET', event: 'Retail Sales', impact: 'medium', forecast: '0.3%', previous: '0.4%' },
    { date: '2025-02-18', time: '9:15 AM ET', event: 'Industrial Production', impact: 'low', forecast: '0.2%', previous: '0.3%' },
    { date: '2025-02-19', time: '2:00 PM ET', event: 'FOMC Meeting Minutes', impact: 'high', forecast: '-', previous: '-' },
    { date: '2025-02-20', time: '8:30 AM ET', event: 'Jobless Claims', impact: 'medium', forecast: '215K', previous: '217K' },
    { date: '2025-02-21', time: '10:00 AM ET', event: 'Existing Home Sales', impact: 'low', forecast: '4.2M', previous: '4.2M' },
    { date: '2025-02-25', time: '8:30 AM ET', event: 'Durable Goods Orders', impact: 'medium', forecast: '0.5%', previous: '-0.2%' },
    { date: '2025-02-27', time: '8:30 AM ET', event: 'GDP Q4 Final', impact: 'high', forecast: '2.3%', previous: '2.3%' },
    { date: '2025-02-28', time: '8:30 AM ET', event: 'Core PCE Price Index', impact: 'high', forecast: '0.2%', previous: '0.2%' },
    { date: '2025-03-07', time: '8:30 AM ET', event: 'Nonfarm Payrolls', impact: 'high', forecast: '175K', previous: 'TBD' },
    { date: '2025-03-12', time: '8:30 AM ET', event: 'CPI Inflation Data', impact: 'high', forecast: '2.8%', previous: 'TBD' },
    { date: '2025-03-18', time: '2:00 PM ET', event: 'FOMC Interest Rate Decision', impact: 'high', forecast: '4.25-4.50%', previous: '4.25-4.50%' },
    { date: '2025-03-18', time: '2:30 PM ET', event: 'Fed Chair Powell Press Conference', impact: 'high', forecast: '-', previous: '-' },
    { date: '2025-03-20', time: '8:30 AM ET', event: 'Jobless Claims', impact: 'medium', forecast: 'TBD', previous: 'TBD' },
    { date: '2025-03-28', time: '8:30 AM ET', event: 'Core PCE Price Index', impact: 'high', forecast: 'TBD', previous: 'TBD' }
];

function generateEconomicCalendar() {
    const today = new Date();
    const upcoming = ECONOMIC_EVENTS.filter(e => new Date(e.date) >= today);
    const highImpact = upcoming.filter(e => e.impact === 'high');
    
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    const rows = upcoming.map(e => `
        <tr>
            <td class="date">${formatDate(e.date)}</td>
            <td class="time">${e.time}</td>
            <td class="event">${e.event}</td>
            <td class="impact"><span class="impact-badge ${e.impact}">${e.impact.toUpperCase()}</span></td>
            <td class="forecast">${e.forecast}</td>
            <td class="previous">${e.previous}</td>
        </tr>
    `).join('');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Economic Calendar 2025 | Fed Meetings, Jobs Report & CPI Data</title>
    <meta name="description" content="Economic calendar for 2025. Track Fed meetings, jobs reports, CPI inflation data, and major economic events affecting the stock market.">
    <meta name="keywords" content="economic calendar, fed meeting schedule, jobs report, CPI data, inflation report">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e1a; color: #e8eaed; line-height: 1.6; }
        .container { max-width: 1100px; margin: 0 auto; padding: 20px; }
        nav { background: #111827; padding: 15px 20px; border-bottom: 1px solid #1e3a5f; margin: -20px -20px 30px; }
        nav a { color: #e74c3c; text-decoration: none; margin-right: 20px; }
        header { text-align: center; padding: 40px 0; }
        h1 { font-size: 2.2em; background: linear-gradient(135deg, #e74c3c, #f39c12); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .alert-box {
            background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(243, 156, 18, 0.1));
            border: 1px solid #e74c3c;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
        }
        .alert-box h3 { color: #e74c3c; margin-bottom: 10px; }
        .alert-box p { color: #8b92a8; }
        
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-box { background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(243, 156, 18, 0.1)); border: 1px solid #1e3a5f; border-radius: 12px; padding: 25px; text-align: center; }
        .stat-number { font-size: 2.5em; font-weight: bold; color: #e74c3c; }
        .stat-label { color: #8b92a8; margin-top: 5px; }
        
        .card { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; overflow: hidden; margin-bottom: 30px; }
        .card-header { background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(243, 156, 18, 0.1)); padding: 20px 25px; border-bottom: 1px solid #1e3a5f; }
        .card-header h2 { color: #e74c3c; font-size: 1.2em; }
        
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #1e3a5f; }
        th { background: #0d1117; color: #8b92a8; font-size: 0.8em; text-transform: uppercase; }
        td.date { color: #e74c3c; font-weight: bold; }
        td.time { color: #8b92a8; font-family: monospace; }
        td.event { font-weight: bold; color: #fff; }
        .impact-badge { padding: 4px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; }
        .impact-badge.HIGH { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }
        .impact-badge.MEDIUM { background: rgba(243, 156, 18, 0.2); color: #f39c12; }
        .impact-badge.LOW { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
        td.forecast { color: #3498db; }
        td.previous { color: #8b92a8; }
        tr:hover { background: rgba(231, 76, 60, 0.05); }
        
        .fed-section { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; padding: 25px; margin-bottom: 30px; }
        .fed-section h3 { color: #e74c3c; margin-bottom: 15px; }
        .fed-section p { color: #8b92a8; line-height: 1.8; margin-bottom: 10px; }
        
        footer { text-align: center; padding: 40px 0; color: #4a5568; border-top: 1px solid #1e3a5f; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <nav><a href="/">← Home</a></nav>
        <header>
            <h1>📊 Economic Calendar</h1>
            <p style="color: #8b92a8; margin-top: 10px;">Fed meetings, jobs reports & market-moving events</p>
        </header>

        <div class="alert-box">
            <h3>⚠️ Next High-Impact Event</h3>
            <p>${highImpact[0]?.event || 'Nonfarm Payrolls'} - ${highImpact[0] ? new Date(highImpact[0].date).toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'}) : 'Coming Soon'}</p>
        </div>
        
        <div class="stats">
            <div class="stat-box">
                <div class="stat-number">${upcoming.length}</div>
                <div class="stat-label">Upcoming Events</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${highImpact.length}</div>
                <div class="stat-label">High Impact</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${upcoming.filter(e => e.event.includes('Fed') || e.event.includes('FOMC')).length}</div>
                <div class="stat-label">Fed Events</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h2>📅 Upcoming Economic Events</h2></div>
            <table>
                <thead><tr><th>Date</th><th>Time</th><th>Event</th><th>Impact</th><th>Forecast</th><th>Previous</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>

        <div class="fed-section">
            <h3>🏛️ About Fed Meetings</h3>
            <p>The Federal Open Market Committee (FOMC) meets 8 times per year to set interest rates. These meetings are the most market-moving events on the economic calendar.</p>
            <p style="margin-top: 15px;"><strong>Next FOMC Meeting:</strong> March 18-19, 2025. Markets expect the Fed to hold rates steady at 4.25-4.50%, but any change in forward guidance can cause significant volatility.</p>
        </div>

        <div class="fed-section">
            <h3>📈 Jobs Report Importance</h3>
            <p>The monthly Nonfarm Payrolls report, released on the first Friday of each month, is the most closely watched economic indicator. Strong job growth can lead to higher interest rates, while weak data may prompt rate cuts.</p>
        </div>

        <div class="fed-section">
            <h3>💹 CPI & Inflation Data</h3>
            <p>The Consumer Price Index (CPI) measures inflation. The Fed targets 2% annual inflation. Higher readings pressure the Fed to raise rates, while lower readings may allow for cuts.</p>
        </div>

        <footer><p>© ${new Date().getFullYear()} Pre-Market Brief | Economic data for informational purposes only</p></footer>
    </div>
</body>
</html>`;
}

const html = generateEconomicCalendar();
fs.writeFileSync(path.join(__dirname, 'economic-calendar.html'), html);
console.log('✅ economic-calendar.html generated');
console.log(`   Events: ${ECONOMIC_EVENTS.length} economic events`);
console.log(`   High Impact: ${ECONOMIC_EVENTS.filter(e => e.impact === 'high').length} events`);
