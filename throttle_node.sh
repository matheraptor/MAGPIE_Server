#!/bin/bash
# throttle_node v5
cd /home/hamedahastral/MAGPIE_Server

CPU_LIMIT=80

echo "Passive MAGPIE Governor loaded. Waiting for manual node start..."

while true; do
    # 1. Look for any active node process running SERVER.js
    NODE_PID=$(pgrep -f "node SERVER.js")
    
    if [ ! -z "$NODE_PID" ]; then
        # 2. Check if cpulimit is already attached to this specific PID
        if ! ps aux | grep "cpulimit" | grep -q " -p $NODE_PID"; then
            echo "Manual Node process detected (PID: $NODE_PID). Applying 30% CPU throttle..."
            cpulimit -p $NODE_PID -l $CPU_LIMIT -b
        fi
    fi
    
    # 3. Rest quietly for 2 seconds before checking again to use 0% idle CPU
    sleep 2
done
