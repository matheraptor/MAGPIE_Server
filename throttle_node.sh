#!/bin/bash
cd /home/hamedahastral/MAGPIE_Server

CPU_LIMIT=30

while true; do
    echo -e "\e[36m--- Launching MAGPIE Server Core... ---\e[0m"
    
    # 1. Run Node natively in the background
    node SERVER.js &
    NODE_PID=$!
    
    # 2. Immediately throttle this exact process ID to 30% CPU
    cpulimit -p $NODE_PID -l $CPU_LIMIT -b
    
    # 3. Wait for this specific Node instance to exit or crash
    wait $NODE_PID
    exitCode=$?
    
    # 4. Evaluate exit codes
    if [ "$exitCode" -eq 2 ]; then
        echo -e "\e[36m--- Restart signal received CODE[2]: rebooting... ---\e[0m"
    elif [ "$exitCode" -eq 0 ]; then
        echo -e "\e[32m--- Server shut down normally CODE[0]. Exiting wrapper loop. ---\e[0m"
        break
    else
        echo -e "\e[31m--- Server crashed or stopped CODE[$exitCode]. Graceful pause... ---\e[0m"
        sleep 2
    fi
done
