# Useful bash commands

[TOC]

## MONITORS

### AUTH.LOG

```bash
sudo tail -n 50 /var/log/auth.log | grep -E "Failed|Invalid"
```

### CPU MONITOR

```bash
while true; do ps -eo pid,%cpu,comm --sort=-%cpu | head -n 4; sleep 1; clear; done
```
