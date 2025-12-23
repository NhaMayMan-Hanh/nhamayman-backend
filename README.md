# 🌈 NhaMayMan-Hanh – Backend (Node.js / Express)

## 📌 Project Overview

Đây là phần **Backend** của dự án **NhaMayMan-Hanh**, được xây dựng để phục vụ mục đích **học tập và thực hành Backend thực tế**.

Backend chịu trách nhiệm:

- Xử lý logic nghiệp vụ
- Xác thực người dùng (Authentication)
- Quản lý dữ liệu sản phẩm, người dùng
- Cung cấp REST API cho Frontend

Dự án được xây dựng theo hướng **tách biệt Frontend – Backend**, mô phỏng kiến trúc web hiện đại.

---

## 🚀 Deployment (Render)

Backend đã được triển khai lên môi trường production bằng **Render** nhằm kiểm chứng khả năng vận hành server thực tế.

- Nền tảng: **Render**
- Hình thức: REST API service
- Trạng thái: Đã deploy – hiện không public để tránh sử dụng ngoài mục đích học tập

📸 Minh chứng deploy & API hoạt động:

- View screenshots: **[https://drive.google.com/drive/folders/1dbKh2XXrIj2wt5LBlccuFxPF6CNcd4aK?usp=sharing]**

---

## ✨ Công nghệ Sử dụng

- **Node.js**
- **ExpressJS**
- **MongoDB**
- **Zod** (Data Validation)
- **JWT** (Authentication)

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Local)

### 1. Clone Repository

```bash
git clone https://github.com/NhaMayMan-Hanh/nhamayman-backend
cd backend-repo-name
```

### 2. Cài đặt Dependencies

```bash
npm install
```

### 3. Tạo file `.env`

```env
MONGODB_URI="mongodb://127.0.0.1:27017/nhamayman"
JWT_SECRET="something-very-secret"
CLIENT_URL="http://localhost:3000"
ASSET_BASE_URL="http://localhost:5000"
PORT=5000
EMAIL_USER=nguyenkhanhduy23803@gmail.com
EMAIL_PASS=ywkw qmvh swzs zmse
```

### 4. Khởi tạo Database (Seeding)

```bash
npm run seed
```

### 5. Chạy Server Backend

```bash
npm run dev
```

👉 Backend sẽ chạy tại: `http://localhost:5000`

⚠️ Đảm bảo MongoDB đã được cài đặt và đang chạy trên máy.
