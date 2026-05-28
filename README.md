# FreelancePact - Escrow & Contract Management (Frontend)

Chào mừng bạn đến với repo frontend của **FreelancePact**! Đây là nền tảng quản lý hợp đồng và thanh toán bảo chứng (Escrow) hiện đại, giúp kết nối freelancers và khách hàng một cách an toàn, minh bạch và chuyên nghiệp.

Dự án được xây dựng bằng **Next.js 14 (App Router)** kết hợp với **TypeScript**, **Tailwind CSS** và bộ thư viện icon **Lucide React**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

Nền tảng sử dụng các công nghệ frontend hiện đại và tối ưu:
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router & React Server/Client Components)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Quản lý package:** `npm`

---

## 📁 Cấu Trúc Thư Mục (Project Structure)

Thư mục chính được tổ chức như sau để dễ dàng mở rộng và bảo trì:

```text
FreelancePact/
├── app/                  # Next.js App Router (Pages, Layouts, CSS)
│   ├── (auth)/           # Route Group chứa luồng xác thực
│   │   └── login/        # Trang đăng nhập
│   ├── contracts/        # Trang quản lý hợp đồng
│   │   ├── [id]/         # Chi tiết hợp đồng (Milestones, Chat & Thanh toán)
│   │   ├── new/          # Biểu mẫu tạo hợp đồng mới
│   │   └── page.tsx      # Tự động redirect về hợp đồng mặc định
│   ├── profile/          # Dashboard hồ sơ cá nhân / portfolio của Freelancer
│   ├── globals.css       # File cấu hình CSS toàn cục
│   └── layout.tsx        # Layout chính của toàn bộ trang web
├── components/           # Components dùng chung trong toàn ứng dụng
│   ├── ui/               # Base components được import từ shadcn/ui (Button, Input, Separator)
│   └── LogoIcon.tsx      # Component hiển thị logo chính thức của ứng dụng
├── lib/                  # Thư viện helper và utilities
│   └── utils.ts          # Hàm tiện ích dùng chung (như cn class merge)
├── public/               # Static assets (Hình ảnh, Logo, Icons)
│   └── logo.png          # Logo nắm tay đặc trưng của FreelancePact
├── tailwind.config.ts    # File cấu hình Tailwind CSS
└── tsconfig.json         # File cấu hình TypeScript
```

---

## 💻 Các Trang & Tính Năng Hiện Tại

1. **Trang Đăng Nhập (`/login`):** Giao diện đăng nhập hiện đại với các tùy chọn đăng nhập qua mạng xã hội (Google, LinkedIn) và hệ thống xác thực visual chuyên nghiệp.
2. **Hồ Sơ Cá Nhân & Portfolio (`/profile`):** Trang dashboard hiển thị đầy đủ thông tin chuyên môn, kỹ năng, kinh nghiệm làm việc, thống kê thu nhập/dự án hoàn thành và đánh giá từ khách hàng.
3. **Chi Tiết Hợp Đồng (`/contracts/[id]`):** Giao diện tương tác trực quan bao gồm:
   - Thanh tiến trình Milestones (các mốc dự án) và trạng thái của từng milestone.
   - Bảng điều khiển Escrow (nạp tiền bảo chứng, giải phóng thanh toán, yêu cầu tranh chấp).
   - Sidebar Chat tích hợp để trao đổi trực tiếp và gửi file tài liệu giữa Freelancer & Khách hàng.
4. **Tạo Hợp Đồng Mới (`/contracts/new`):** Quy trình tạo hợp đồng chuyên nghiệp với việc thiết lập ngân sách, các mốc thời gian (Milestones), phương thức Escrow và điều khoản đính kèm.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Local

Để chạy dự án ở môi trường local của bạn, hãy làm theo các bước dưới đây:

### 1. Yêu cầu hệ thống
Đảm bảo bạn đã cài đặt:
- **Node.js** phiên bản `>= 18.0.0`
- **npm** (đi kèm khi cài đặt Node.js) hoặc **yarn** / **pnpm**

### 2. Clone Repository
```bash
git clone https://github.com/nguyenvanductrung/FreelancePact-fe.git
cd FreelancePact
```

### 3. Cài đặt Dependencies
```bash
npm install
```

### 4. Khởi động Development Server
Chạy lệnh sau để khởi động máy chủ local:
```bash
npm run dev
```
Sau đó mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🎨 Quy Chuẩn Cấu Trúc Code & UI

Để đảm bảo code sạch, dễ đọc và nhất quán khi làm việc nhóm, vui lòng tuân thủ các quy tắc sau:

- **Component:** 
  - Khuyến khích chia nhỏ components nếu chúng được tái sử dụng ở nhiều nơi.
  - Các component UI cơ bản (Button, Input, Modal, v.v.) nên đặt trong thư mục `components/ui`.
- **Styling:**
  - Sử dụng Tailwind CSS trực tiếp. Hạn chế sử dụng inline-style trừ các trường hợp cần tính toán giá trị động (ví dụ: `width: percentage%`).
  - Màu sắc thương hiệu cốt lõi được định nghĩa sẵn trong giao diện:
    - Navy: `#0B3C5D` (Chủ đạo, tiêu đề)
    - Blue: `#1565C0` (Nút hành động chính, đường link)
- **TypeScript:** Định nghĩa kiểu dữ liệu (`interface`, `type`) rõ ràng cho mọi props hoặc dữ liệu mock. Tránh sử dụng kiểu dữ liệu `any`.
- **ESLint & Kiểm tra lỗi:** Chạy lệnh `npm run lint` để kiểm tra và sửa lỗi cú pháp trước khi tạo Pull Request.

---

## 🤝 Quy Trình Đóng Góp (Git Workflow)

1. **Tạo nhánh mới** từ nhánh `main`:
   ```bash
   git checkout -b feature/ten-tinh-nang
   # hoặc
   git checkout -b bugfix/ten-loi
   ```
2. **Thực hiện thay đổi và Commit code:** Tuân thủ chuẩn commit message để lịch sử git rõ ràng:
   - `feat: thêm trang quản lý thanh toán`
   - `fix: sửa lỗi hiển thị logo trên mobile`
   - `docs: cập nhật tài liệu hướng dẫn`
   - `refactor: tối ưu hóa component chat`
3. **Push nhánh lên remote và tạo Pull Request (PR):**
   - Đảm bảo dự án build thành công (`npm run build`) và không có cảnh báo ESLint.
   - Nhờ các thành viên khác review trước khi merge vào nhánh `main`.

---

Chúc bạn có trải nghiệm làm việc vui vẻ tại dự án **FreelancePact**! Nếu gặp bất kỳ thắc mắc hay sự cố nào khi setup, hãy liên hệ trực tiếp với đội ngũ phát triển.
