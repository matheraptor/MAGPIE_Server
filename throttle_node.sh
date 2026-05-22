#!/bin/bash
# throttle_node v6 (Optimized for GCP e2-micro)

# 1. PREVENT DUPLICATES: Exit immediately if another copy of this script is running
if [ $(pgrep -f "$(basename "$0")" | wc -l) -gt 2 ]; then
    exit 0
fi

cd /home/hamedahastral/MAGPIE_Server
CPU_LIMIT=30
LAST_THROTTLED_PID=""

echo "Passive MAGPIE Governor v6 loaded. Waiting for manual node start..."

while true; do
    # 2. Look for the active Node process safely
    NODE_PID=$(pgrep -f "node SERVER.js")

    if [ ! -z "$NODE_PID" ]; then
        # 3. Check if cpulimit is already attached to this specific PID using pgrep
        if ! pgrep -f "cpulimit.*-p $NODE_PID" > /dev/null; then
            
            # Kill any orphaned cpulimit processes left over from old server runs
            pkill -f "cpulimit" 2>/dev/null
            
            echo "Manual Node process detected (PID: $NODE_PID). Applying 30% CPU throttle..."
            # Launch cpulimit in the background securely
            /usr/bin/cpulimit -p "$NODE_PID" -l "$CPU_LIMIT" -b
            LAST_THROTTLED_PID="$NODE_PID"
        fi
    else
        # If the Node server stopped, clean up the running cpulimit process immediately
        if [ ! -z "$LAST_THROTTLED_PID" ]; then
            pkill -f "cpulimit" 2>/dev/null
            LAST_THROTTLED_PID=""
        fi
    fi

    # Rest quietly for 2 seconds using zero idle CPU
    sleep 2
done
