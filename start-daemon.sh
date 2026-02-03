#!/bin/bash
# Start 7x24 auto-update daemon

cd /root/.openclaw/workspace/projects/stock-brief

echo "🤖 Starting 7x24 Auto-Updater"
echo "Updates every 3 hours"
echo "Press Ctrl+C to stop"
echo ""

while true; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Running update..."
    node auto-update.js
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sleeping for 3 hours..."
    echo ""
    
    # Sleep for 3 hours (10800 seconds)
    sleep 10800
done