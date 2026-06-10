#!/bin/bash
# monitor.sh - Resource monitoring loop for MAGPIE Server
# Uses the customized top-like view for server, governor, and limiter

while true; do
    clear
    echo "=== MAGPIE RESOURCE MONITOR ==="
    echo "Timestamp: $(date)"
    echo "----------------------------------------------------------------"
    # Monitor only the server, the governor, and the cpulimit process
    top -p $(pgrep -f "node.*SERVER.js|cpulimit|throttle_node.sh" | paste -sd, -) -n 1
    echo "----------------------------------------------------------------"
    echo "Press Ctrl+C to exit"
    sleep 2
done
