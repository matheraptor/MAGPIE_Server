#!/bin/bash
# run_server.sh - Master Booter for MAGPIE Server
# Orchestrates the server and monitor in detached screen sessions

echo -e "\e[34m--- Initializing MAGPIE Boot Sequence... ---\e[0m"

# 1. Boot the Server Engine
echo "Launching Server Session..."
screen -S magpie -d bash -c "cd /home/hamedahastral/MAGPIE_Server && ./scripts/start.sh"

# 2. Boot the Resource Monitor
echo "Launching Monitor Session..."
screen -S monitor -d bash -c "cd /home/hamedahastral/MAGPIE_Server && ./scripts/monitor.sh"

echo -e "\e[32m--- Boot Sequence Complete ---\e[0m"
echo "Sessions created: 'magpie' (Server) and 'monitor' (Resources)"
echo "Use 'screen -r magpie' or 'screen -r monitor' to attach."

