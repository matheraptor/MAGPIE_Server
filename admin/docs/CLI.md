# Useful bash commands

[TOC]

---

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

---

## MONITORS

### AUTH.LOG

```bash
sudo tail -n 50 /var/log/auth.log | grep -E "Failed|Invalid"
```

---

### CPU MONITOR

```bash
while true; do ps -eo pid,%cpu,comm --sort=-%cpu | head -n 4; sleep 1; clear; done
```

#### process check

```bash
ps aux | grep -E "throttle_node|cpulimit|node"
```

---

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

---

### GIT

### pull latest from repo

```bash
git pull
```

### set VSCode as default editor

```powershell
git config --global core.editor "code --wait"
```

### git commit

```powershell
git add .
```

```powershell
git commit
```

```powershell
git commit -m "title" \ 
-m "line2" \
-m "line3" \
```

---

### GCLOUD SDK

#### set environment variables

```powershell
setx MY_PROJECT "gen-lang-client-0650816059"
```

#### monitor logs

```powershell
gcloud logging read "resource.type=\"gce_instance\" AND logName=\"projects/gen-lang-client-0650816059/logs/syslog\" AND textPayload:\"Invalid user\"" --limit=5 --format="table(timestamp, textPayload)"
```

#### view custom process & resource logs

```powershell
gcloud logging read "logName=projects/YOUR_PROJECT_ID/logs/custom_server_activity" --limit=20 --format="table(timestamp, textPayload)"
```

#### tail system errors and processes live (real-time stream)

```powershell
gcloud alpha logging tail "resource.type=gce_instance AND (logName=projects/YOUR_PROJECT_ID/logs/syslog OR logName=projects/YOUR_PROJECT_ID/logs/custom_server_activity)"
```

#### Use the Automated Terminal Read Script

Since you are using a local Windows environment via cmd.exe, you can bypass the alpha component engine entirely. Run this command script directly in your console to create an automated loop. It checks for new errors and process resource logs every 10 seconds, creating a lightweight, local terminal log reader:

```powershell
set MY_PROJECT=gen-lang-client-0650816059
:loop
cls
echo === Fetching Latest Process Logs (Refreshes every 10s) ===
gcloud logging read "resource.type=gce_instance AND (logName=projects/%MY_PROJECT%/logs/syslog OR logName=projects/%MY_PROJECT%/logs/custom_server_activity)" --limit=15 --format="table(timestamp.date(tz=LOCAL), textPayload)"
timeout /t 10 >nul
goto loop
```

#### run targeted debug filters

Since you want quick terminal evaluations without navigating the slow web panel, keep these direct CLI filtering snippets handy for targeted troubleshooting:Filter Specifically for Server High CPU and Script Errors:

```powershell
gcloud logging read "textPayload:\"[PROCESSES CPU]\" OR textPayload:\"[SYSTEMD ERRORS]\"" --limit=20 --format="table(timestamp.date(tz=LOCAL), textPayload)"
```

#### Search for Historical APT Spikes or Crashes over the Last 24 Hours

```powershell
gcloud logging read "resource.type=gce_instance AND textPayload:\"apt-get\"" --limit=30 --format="table(timestamp.date(tz=LOCAL), textPayload)"
```

---
