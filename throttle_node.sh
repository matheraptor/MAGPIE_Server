#!/bin/bash
# throttle_node v3
cd /home/hamedahastral/MAGPIE_Server

CPU_LIMIT=30

while true; do
    echo "Launching MAGPIE Server Core with native throttling..."
    
    # Launch node directly INSIDE cpulimit. 
    # This guarantees it is throttled from the exact millisecond it boots.
    cpulimit -l $CPU_LIMIT -- node SERVER.js
    exitCode=$?
    
    # Evaluate exit codes smoothly
    if [ "$exitCode" -eq 2 ]; then
        echo "Restart signal received CODE[2]: rebooting..."
    elif [ "$exitCode" -eq 0 ]; then
        echo "Normal shutdown. Exiting."
        break
    else
        echo "Server crashed with CODE[$exitCode]. Pausing before restart..."
        sleep 2
    fi
done
