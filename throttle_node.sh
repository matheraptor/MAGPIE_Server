#!/bin/bash
# throttle_node v4
cd /home/hamedahastral/MAGPIE_Server

CPU_LIMIT=30

while true; do
    # 1. Start Node in the background
    node SERVER.js &
    NODE_PID=$!
    
    # 2. Critical: Wait 1 second for the OS to fully register the process ID
    sleep 1
    
    # 3. Attach cpulimit directly to the registered PID
    if ps -p $NODE_PID > /dev/null; then
        cpulimit -p $NODE_PID -l $CPU_LIMIT -b
    fi
    
    # 4. Stay active until this specific Node process finishes or exits
    wait $NODE_PID
    exitCode=$?
    
    if [ "$exitCode" -eq 0 ]; then
        break
    fi
done
