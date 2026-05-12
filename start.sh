#!/bin/bash

while true; do
    # Run server
    node SERVER.js
    
    # Capture exit code
    exitCode=$?
    
    # Decide what to do
    if [ "$exitCode" -eq 2 ]; then
        echo -e "\e[36m--- Restart signal received CODE[2]: rebooting MAGPIE... ---\e[0m"
    elif [ "$exitCode" -eq 0 ]; then
        echo -e "\e[32m--- Server shut down normally CODE[0]. Exiting loop. ---\e[0m"
        break
    else
        echo -e "\e[31m--- Server crashed or stopped CODE[$exitCode]. ---\e[0m"
        break
    fi
done
