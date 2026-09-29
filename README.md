# Autonomous Software Factory + AI Film Factory — v1.1-FINAL

[![CI / Build & Test](https://github.com/alo247/Video24h/actions/workflows/ci.yml/badge.svg)](https://github.com/alo247/Video24h/actions/workflows/ci.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falo247%2FVideo24h&env=GEMINI_API_KEY&envDescription=Google%20Gemini%20API%20Key%20for%20AI%20Orchestrator)

> **Mục tiêu**: Từ yêu cầu &rarr; sản phẩm chạy thật kèm bằng chứng số bất biến — không phải chatbot chỉ biết viết code.

---

## 🚀 Triển Khai Nhanh Trên Vercel

Dự án đã được cấu hình tối ưu 100% cho nền tảng **Vercel** thông qua `vercel.json` và Serverless Functions tại `/api`:

### Cách 1: 1-Click Deploy Trực Tiếp
Nhấn nút **Deploy with Vercel** ở trên hoặc truy cập liên kết:
```
https://vercel.com/new/clone?repository-url=https://github.com/alo247/Video24h
```

### Cách 2: Kết Nối Trực Tiếp GitHub Repository với Vercel
1. Truy cập [Vercel Dashboard](https://vercel.com/new).
2. Chọn kho lưu trữ: **`alo247/Video24h`**.
3. Framework Preset: **Vite** (hệ thống tự động nhận diện từ `vercel.json`).
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Thêm biến môi trường:
   - `GEMINI_API_KEY`: Khóa API Google Gemini của bạn.
7. Nhấn **Deploy**. Mỗi lần bạn push code lên nhánh `main`, Vercel sẽ tự động build và deploy trong vài giây!

---

## 📤 Đẩy Mã Nguồn Lên GitHub (alo247/Video24h)

Để đẩy phiên bản mới nhất lên kho `https://github.com/alo247/Video24h.git`:

```bash
# Cách 1: Chạy script tự động với Personal Access Token (PAT)
bash scripts/push_to_github.sh <YOUR_GITHUB_TOKEN>

# Cách 2: Thiết lập biến môi trường và chạy qua npm
export GITHUB_TOKEN="ghp_your_github_personal_access_token"
npm run push
```

---

## 💻 Chạy Tại Máy Cục Bộ (Local Development)

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Tạo tệp .env từ .env.example
cp .env.example .env
# Thêm GEMINI_API_KEY của bạn vào tệp .env

# 3. Khởi động môi trường phát triển (Full-stack Express + Vite)
npm run dev
# Mở trình duyệt tại: http://localhost:3000

# 4. Kiểm tra kiểu và linting
npm run lint

# 5. Build sản phẩm hoàn chỉnh
npm run build
```

---

## 📁 Cấu Trúc Thư Mục Hệ Thống

```
├── /config        # gates.yaml, film_qc.yaml, budget.yaml, retention.yaml
├── /agents        # registry.json định nghĩa 9 vai trò, lệnh cấm, quyền hạn
├── /contracts     # active_contract.json: tiêu chí PASS đo lường được
├── /tasks         # task_graph.json: Đồ thị công việc phi chu trình DAG
├── /evidence      # evidence_store.json: Sổ cái Append-only chuỗi băm SHA-256
├── /film          # film_bible.json, acts_scenes_shots.json (Phân cấp 5 cấp)
├── /output        # manifest.json: Bản kê khai nghiệm thu kỹ thuật
├── /audit         # audit_log.json: Nhật ký kiểm toán bảo mật bất biến
├── /human         # approvals.json: Cổng phê duyệt con người & chữ ký số
├── /src           # Giao diện điều khiển SPA (React 19 + Tailwind v4 + Lucide)
├── /api           # Serverless Function API Entry point cho Vercel
├── server.ts      # Máy chủ Full-stack Express cho Cloud Run / Local
└── vercel.json    # Cấu hình định tuyến và build tự động trên Vercel
```

---

## 🛡️ Hệ Thống 5 Cơ Chế Guard

1. **Deadlock Detector**: Phát hiện chu trình phụ thuộc vòng trong DAG bằng thuật toán Tarjan/DFS.
2. **Stalled Recovery Engine**: Tự động phục hồi hoặc tái phân công task bị treo quá thời hạn 300s (tối đa 3 lần).
3. **Circuit Breaker**: Tự động ngắt kết nối khi Provider lỗi &ge; 3 lần liên tiếp và chuyển sang phương án dự phòng.
4. **Budget Guard**:
   - Cảnh báo tại 70%
   - Dừng mềm (chặn nhận task mới) tại 90%
   - Dừng cứng (hủy tiến trình khẩn cấp) tại 100%
5. **Evidence Guard**: Chuỗi băm SHA-256 bất biến, bảo đảm toàn vẹn dữ liệu và kiểm tra nguyên tắc phân tách quyền.

---

## 🎬 AI Film Factory (5 Cấp Độ Cố Định)

- **Cấu trúc**: `Film` &rarr; `Act` &rarr; `Sequence` &rarr; `Scene` &rarr; `Shot`
- **Phân cấp chất lượng**:
  - **Hạng A (Cảnh chính)**: Người duyệt từng cảnh riêng lẻ.
  - **Hạng B (Cảnh phụ)**: Người duyệt mẫu ngẫu nhiên &ge; 20%.
  - **Hạng C (Nền / Chuyển tiếp)**: QC tự động đủ điều kiện đóng gói.
- **Rollback chuẩn**: Lấy file đã duyệt &rarr; kiểm tra băm SHA-256 khớp &rarr; sử dụng. Không render lại từ đầu.

---

## 📜 Giấy Phép
Dự án phát hành theo chuẩn **Apache-2.0 License**.
