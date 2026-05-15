#!/bin/bash
CPU_LIMIT=30

while true; do
  for NODE_PID in $(pgrep -x node); do
    # Check if a cpulimit process is already targeting THIS specific Node PID
    if ! ps aux | grep "cpulimit" | grep -q " -p $NODE_PID"; then
      cpulimit -p $NODE_PID -l $CPU_LIMIT -b
    fi
  done
  sleep 10
done
