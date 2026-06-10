#!/bin/bash
# throttle_node v7 (Fixed for GCP e2-micro)

if [ $(pgrep -f "$(basename "$0")" | wc -l) -gt 2 ]; then
    exit 0
fi

cd /home/hamedahastral/MAGPIE_Server
CPU_LIMIT=20  # Dropped to 20% to respect e2-micro sustained limits
CPULIMIT_PID=""

echo "Passive MAGPIE Governor v7 loaded. Waiting for manual node start..."

while true; do
    NODE_PID=$(pgrep -f "node.*SERVER.js")

    if [ ! -z "$NODE_PID" ]; then
        # If Node is running but we haven't spawned cpulimit yet, or if our spawned cpulimit died
        if [ -z "$CPULIMIT_PID" ] || ! kill -0 "$CPULIMIT_PID" 2>/dev/null; then
            
            # Wipe any orphaned cpulimit instances just in case
            pkill -f "cpulimit" 2>/dev/null

            echo "Manual Node process detected (PID: $NODE_PID). Applying ${CPU_LIMIT}% CPU throttle..."
            
            # Launch cpulimit and grab its exact PID ($!)
            /usr/bin/cpulimit -p "$NODE_PID" -l "$CPU_LIMIT" -b
            sleep 0.5
            CPULIMIT_PID=$(pgrep -f "cpulimit.*-p $NODE_PID")
        fi
    else
        # If Node stopped, kill our tracked cpulimit process
        if [ ! -z "$CPULIMIT_PID" ]; then
            echo "Node stopped. Cleaning up cpulimit..."
            pkill -f "cpulimit" 2>/dev/null
            CPULIMIT_PID=""
        fi
    fi

    sleep 5 # Increased to 5 seconds to reduce CPU wakeups on your e2-micro
done
