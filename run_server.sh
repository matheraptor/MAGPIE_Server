#!/bin/bash
while true; do
    node SERVER.js
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 2 ]; then
        echo -e "\e[36m--- Restart signal received CODE[2]: rebooting MAGPIE... ---\e[0m"
        sleep 1
    elif [ $EXIT_CODE -eq 0 ]; then
        echo -e "\e[32m--- Server shut down normally CODE[0]. Exiting loop. ---\e[0m"
        break
    else
        echo -e "\e[31m--- Server crashed or stopped CODE[$EXIT_CODE]. ---\e[0m"
        break
    fi
done
