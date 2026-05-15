# Useful bash commands

[TOC]

## ADMIN

### reboot gracefully

```bash
sudo reboot
```

### hard reboot

```bash
sudo reboot -f
```

### update

```bash
pkill -f throttle_node.sh
home
cd MAGPIE_Server
rm throttle_node.sh
git pull
git restore throttle_node.sh
throttle_node.sh >/dev/null 2>&1 &
home
```

## MONITORS

### AUTH.LOG

```bash
sudo tail -n 50 /var/log/auth.log | grep -E "Failed|Invalid"
```

### CPU MONITOR

```bash
while true; do ps -eo pid,%cpu,comm --sort=-%cpu | head -n 4; sleep 1; clear; done
```

#### process check

```bash
ps aux | grep -E "throttle_node|cpulimit|node"
```

### TASK MANAGER

#### kill node processes

```bash
pkill -f node
```

#### kill throttle_node.sh

```bash
    pkill -f throttle_node.sh
```

#### start throttle_node.sh

```bash
/home/hamedahastral/MAGPIE_Server/throttle_node.sh >/dev/null 2>&1 &
```

### GIT

### pull latest from repo

```bash
git pull
```

### GCLOUD SDK

#### monitor logs

```powershell
gcloud logging read "resource.type=\"gce_instance\" AND logName=\"projects/gen-lang-client-0650816059/logs/syslog\" AND textPayload:\"Invalid user\"" --limit=5 --format="table(timestamp, textPayload)"
```
