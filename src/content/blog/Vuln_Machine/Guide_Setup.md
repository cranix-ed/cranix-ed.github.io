---
title: Guide Setup Machine
description: A simple example of a Markdown blog post.
pubDate: 2026-07-11
tags: ["Home Lab Machine"]
---

# Hướng dẫn triển khai Pentest Lab bằng file OVA
Link: [Vulnerable Machine](https://drive.google.com/file/d/165mI5a4AGBKDWqNQA4FNltE0BihRWJn1/view?usp=sharing)

## Giới thiệu

Tài liệu này hướng dẫn người dùng triển khai môi trường **Pentest Lab** thông qua file OVA. Sau khi import thành công và khởi động máy ảo, người dùng chỉ cần lấy địa chỉ IP của máy ảo để bắt đầu quá trình Pentest.

---

# Yêu cầu hệ thống

Để đảm bảo Lab hoạt động ổn định, máy tính nên đáp ứng cấu hình tối thiểu sau:

| Thành phần       | Yêu cầu tối thiểu                             |
| ---------------- | --------------------------------------------- |
| CPU              | 2 nhân, hỗ trợ Intel VT-x hoặc AMD-V          |
| RAM              | 4 GB                                          |
| Dung lượng trống | 30 GB                                         |
| Phần mềm ảo hóa  | Oracle VirtualBox 7.x hoặc VMware Workstation |

> **Lưu ý:** Nếu máy chưa bật Virtualization (VT-x/AMD-V), cần kích hoạt trong BIOS/UEFI trước khi sử dụng.

---

# Chuẩn bị

Chuẩn bị các thành phần sau:

- Oracle VirtualBox hoặc VMware Workstation
    
- File máy ảo:
    

```text
Debian_Server.ova
```

---

# Import máy ảo

## Bước 1: Mở chức năng Import

Mở **Oracle VirtualBox**.

Chọn:

```
File
    └── Import Appliance...
```

---

## Bước 2: Chọn file OVA

Nhấn **Choose...**

Chọn file:

```
Debian_Server.ova
```

Sau đó nhấn **Next**.

---

## Bước 3: Kiểm tra thông tin máy ảo

VirtualBox sẽ hiển thị các thông tin của máy ảo.

Có thể thay đổi:

- Tên máy ảo
    
- Thư mục lưu trữ
    

Các thông số CPU, RAM và ổ đĩa có thể giữ nguyên theo cấu hình mặc định của Lab.

Sau khi kiểm tra, chọn **Finish** để bắt đầu quá trình import.

---

## Bước 4: Chờ quá trình Import hoàn tất

VirtualBox sẽ tự động giải nén và tạo máy ảo từ file OVA.

Thời gian import phụ thuộc vào cấu hình máy và tốc độ ổ cứng, thường mất khoảng **2–10 phút**.

Khi xuất hiện máy ảo trong danh sách của VirtualBox, quá trình import đã hoàn tất.

---

# Khởi động máy ảo

Chọn máy ảo vừa import và nhấn **Start**.

Máy ảo sẽ khởi động vào hệ điều hành Debian đã được cấu hình sẵn.

Ở lần khởi động đầu tiên, hệ thống có thể mất thêm một chút thời gian để hoàn tất quá trình khởi tạo.

---

# Khởi động lại để cập nhật địa chỉ IP

Sau khi máy ảo khởi động thành công, tiến hành **Restart** máy ảo một lần.

Việc khởi động lại giúp hệ thống nhận đầy đủ cấu hình mạng và cập nhật địa chỉ IP mới từ DHCP (nếu sử dụng NAT hoặc Bridged Adapter).

---

# Bắt đầu thực hành Pentest

Sau khi xác định được địa chỉ IP của máy Lab, người dùng có thể sử dụng máy tấn công (ví dụ: Kali Linux) để tiến hành các hoạt động khảo sát và khai thác theo kịch bản của bài Lab.

Ví dụ:

```bash
nmap 192.168.1.150
```

Hoặc truy cập trực tiếp các dịch vụ Web bằng trình duyệt:

```
http://192.168.1.150
```

Từ thời điểm này, toàn bộ quá trình Pentest sẽ được thực hiện dựa trên địa chỉ IP của máy Lab.