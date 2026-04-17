Paste the following code into the editor (replace YOUR_DOMAIN and YOUR_TOKEN with your actual DuckDNS details):

```bash
echo url="https://duckdns.org/update?domains=$YOUR_DOMAIN&token=$YOUR_TOKEN" | curl -k -o ~/duckdns/duck.log -K -
```

```bash
chmod +x duck.sh
```
