#!/bin/bash

# --- PERMANENT TASKS ON SERVER START ---
# 1. Ensure production mode is flagged (Reduces RAM footprint up to 30%)
export NODE_ENV=production

# 2. Automatically kickstart the Governor loop if it ever gets closed
if ! pgrep -f "throttle_node.sh" > /dev/null; then
    /home/hamedahastral/MAGPIE_Server/throttle_node.sh >> /home/hamedahastral/MAGPIE_Server/logs/governor_boot.log 2>&1 &
fi

# 3. Clear temporary file builds right before boot to free up physical RAM
/usr/bin/find /tmp -type f -mtime +3 -delete 2>/dev/null

echo -e "\e[32m--- System environments verified. Booting MAGPIE Engine... ---\e[0m"
# ---------------------------------------

while true; do
    # Run server with the critical 512MB memory boundary safeguard
    node --max-old-space-size=512 SERVER.js
    
    # Capture exit code
    exitCode=$?
    
    # Decide what to do
    if [ "$exitCode" -eq 2 ]; then
        echo -e "\e[36m--- Restart signal received CODE[2]: rebooting MAGPIE... ---\e[0m"
        sleep 1 # Brief pause to allow OS file handles to release smoothly
    elif [ "$exitCode" -eq 0 ]; then
        echo -e "\e[32m--- Server shut down normally CODE[0]. Exiting loop. ---\e[0m"
        break
    else
        echo -e "\e[31m--- Server crashed or stopped CODE[$exitCode]. ---\e[0m"
        break
    fi
done
