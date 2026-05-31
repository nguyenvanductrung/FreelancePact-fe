# FreelancePact — Frontend Specification

> **Mục đích:** Tài liệu này mô tả toàn bộ cấu trúc Frontend (Next.js 14) của FreelancePact
> để đội Backend (NestJS) biết chính xác những API endpoint nào cần xây dựng,
> payload/response shape, và luồng dữ liệu tương ứng với từng màn hình.

---

## 1. Tổng quan kiến trúc FE

```
FreelancePact/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (metadata, fonts)
│   ├── page.tsx                # Home (redirect hoặc landing)
│   ├── (auth)/
│   │   └── login/page.tsx      # Login page
│   ├── contracts/
│   │   ├── page.tsx            # Redirect → /contracts/:id
│   │   ├── new/page.tsx        # Tạo hợp đồng mới ← CREATE CONTRACT
│   │   └── [id]/page.tsx       # Chi tiết hợp đồng  ← CONTRACT DETAIL
│   └── profile/
│       └── page.tsx            # Hồ sơ người dùng   ← USER PROFILE
│
├── components/
│   ├── shared/
│   │   ├── NavBar.tsx          # Thanh điều hướng dùng chung
│   │   ├── Footer.tsx          # Footer dùng chung
│   │   └── SectionCard.tsx     # Card section dùng chung
│   ├── LogoIcon.tsx
│   └── ui/                     # shadcn/ui components
│
├── constants/index.ts          # Brand colors, nav links, API_BASE_URL
├── types/index.ts              # Tất cả TypeScript interfaces
└── lib/
    ├── utils.ts                # cn() helper
    └── api.ts                  # Typed API client
```

### Tech stack
| Layer | Công nghệ |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | lucide-react |
| State | React useState (local) |
| API calls | Fetch API (wrapped trong lib/api.ts) |
| Auth | JWT — accessToken lưu trong localStorage |

---

## 2. Biến môi trường

Tạo file `.env.local` tại root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

> Tất cả request FE gọi đến `NEXT_PUBLIC_API_URL` + endpoint path.

---

## 3. API Contract

### 3.1 Base URL & Format chung

```
Base: http://localhost:3001/api/v1
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**Response thành công (single object):**
```json
{
  "data": { ... },
  "message": "OK"
}
```

**Response thành công (danh sách có phân trang):**
```json
{
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

**Response lỗi:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": ["Email không hợp lệ"]
  }
}
```

---

### 3.2 Auth Module

#### `POST /auth/login`
Đăng nhập bằng email/password.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response 200:**
```json
{
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

**Lỗi:** `401` Sai email/mật khẩu · `422` Validation failed

---

#### `POST /auth/logout`
Đăng xuất (vô hiệu hóa refresh token).

**Header:** `Authorization: Bearer <accessToken>`

**Response `204`:** No content

---

#### `GET /auth/me`
Lấy thông tin user đang đăng nhập.

**Header:** `Authorization: Bearer <accessToken>`

**Response 200:**
```json
{
  "data": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "avatarUrl": "https://cdn.example.com/avatar.png",
    "role": "freelancer",
    "isKycVerified": true
  }
}
```

---

#### `POST /auth/refresh`
Làm mới access token.

**Request body:**
```json
{ "refreshToken": "eyJhbGci..." }
```

**Response 200:**
```json
{
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

---

### 3.3 Contracts Module

#### `GET /contracts`
Lấy danh sách hợp đồng của user hiện tại.

**Query params:** `page` (default 1), `pageSize` (default 10)

**Response 200:**
```json
{
  "data": [
    {
      "id": "CTR-2024-892",
      "title": "Thiết kế lại Ứng dụng Di động FinTech",
      "partnerName": "Sarah Connor",
      "status": "active",
      "totalValue": 12500000,
      "startDate": "2024-10-10",
      "endDate": "2024-12-15",
      "progressPercent": 25
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10
}
```

**Contract status enum:** `draft | pending_signature | active | completed | cancelled | disputed`

---

#### `GET /contracts/:id`
Lấy chi tiết một hợp đồng.

**Response 200:**
```json
{
  "data": {
    "id": "CTR-2024-892",
    "title": "Thiết kế lại Ứng dụng Di động FinTech",
    "partnerName": "Sarah Connor",
    "status": "active",
    "totalValue": 12500000,
    "escrowedAmount": 3125000,
    "startDate": "2024-10-10",
    "endDate": "2024-12-15",
    "progressPercent": 25,
    "description": "Mô tả dự án...",
    "paymentTerm": "escrow-milestone",
    "specialTerms": null,
    "freelancerId": "usr_abc",
    "clientId": "usr_xyz",
    "createdAt": "2024-10-01T09:00:00Z",
    "updatedAt": "2024-10-24T10:00:00Z",
    "milestones": [
      {
        "id": "ms_001",
        "name": "Wireframes & Research",
        "budget": 3125000,
        "deadline": "2024-10-30",
        "status": "completed",
        "progressPercent": 100
      },
      {
        "id": "ms_002",
        "name": "UI Design System",
        "budget": 3125000,
        "deadline": "2024-11-15",
        "status": "active",
        "progressPercent": 40
      }
    ]
  }
}
```

---

#### `POST /contracts`
Tạo hợp đồng mới.

**Request body:**
```json
{
  "title": "Thiết kế Website Thương mại điện tử",
  "partnerName": "Acme Corporation",
  "description": "Mô tả ngắn gọn về mục tiêu và phạm vi công việc...",
  "paymentTerm": "escrow-milestone",
  "specialTerms": "Bảo mật NDA trong 2 năm",
  "milestones": [
    {
      "name": "Liên ý tưởng thiết kế",
      "budget": 5000000,
      "deadline": "2024-11-15"
    },
    {
      "name": "Thiết kế UI hoàn chỉnh",
      "budget": 10000000,
      "deadline": "2024-12-01"
    }
  ]
}
```

> `budget` là số nguyên VNĐ. `deadline` là `YYYY-MM-DD`.

**Payment term enum:** `escrow-milestone | escrow-full | net-15 | net-30`

**Response 201:** ContractDetail (như GET /contracts/:id)

**Lỗi:** `400` Validation failed · `401` Chưa đăng nhập

---

#### `POST /contracts/:id/sign`
Ký duyệt hợp đồng.

**Response 200:** ContractDetail với `status: "active"`

---

#### `PATCH /contracts/:contractId/milestones/:milestoneId/complete`
Đánh dấu milestone hoàn thành.

**Response 200:** ContractDetail với milestone đã cập nhật

---

### 3.4 Chat / Discussion Module

> FE hiển thị chat trong tab "Thảo luận" của `/contracts/[id]`.
> **Phase 1:** REST polling. **Phase 2:** WebSocket (Socket.IO).

#### `GET /contracts/:contractId/messages`
Lấy lịch sử tin nhắn.

**Query params:** `page` (default 1), `pageSize` (default 50)

**Response 200:**
```json
{
  "data": [
    {
      "id": "msg_001",
      "contractId": "CTR-2024-892",
      "senderId": "usr_xyz",
      "senderName": "Sarah Connor",
      "senderAvatar": null,
      "type": "text",
      "text": "Chào bạn, tôi đã tải lên các bản wireframe...",
      "file": null,
      "createdAt": "2024-10-24T02:11:00Z"
    },
    {
      "id": "msg_002",
      "contractId": "CTR-2024-892",
      "senderId": "system",
      "senderName": "Hệ thống",
      "senderAvatar": null,
      "type": "file",
      "text": null,
      "file": {
        "name": "Wireframes_v1.pdf",
        "sizeBytes": 2516582,
        "url": "https://cdn.example.com/files/wireframes_v1.pdf",
        "milestoneNote": "Đã tải lên vào Milestone 1"
      },
      "createdAt": "2024-10-24T02:45:00Z"
    }
  ],
  "total": 3,
  "page": 1,
  "pageSize": 50
}
```

**Message type enum:** `text | file | system`

---

#### `POST /contracts/:contractId/messages`
Gửi tin nhắn mới.

**Request body (text):**
```json
{
  "contractId": "CTR-2024-892",
  "type": "text",
  "text": "Cảm ơn Sarah. Tôi sẽ xem qua ngay chiều nay."
}
```

**Request body (file):**
```json
{
  "contractId": "CTR-2024-892",
  "type": "file",
  "fileUrl": "https://cdn.example.com/files/design_v2.pdf"
}
```

**Response 201:** ChatMessage object

---

### 3.5 Profile Module

#### `GET /users/:userId/profile`
Xem hồ sơ của một user.

**Response 200:**
```json
{
  "data": {
    "id": "usr_abc",
    "fullName": "Elena Rodriguez",
    "title": "Senior UI/UX Designer",
    "location": "San Francisco, CA",
    "bio": "Crafting intuitive and engaging digital experiences...",
    "hourlyRate": 85,
    "availabilityHoursPerWeek": 20,
    "skills": ["UI Design", "UX Research", "Figma"],
    "successRate": 100,
    "totalContracts": 24,
    "rating": 4.9,
    "isKycVerified": true,
    "isOnline": true,
    "badges": [
      { "id": "b1", "label": "Top Rated", "icon": "award" },
      { "id": "b2", "label": "KYC Verified", "icon": "check-circle" }
    ],
    "portfolioItems": [
      {
        "id": "pf_1",
        "title": "FinTech Mobile App",
        "description": "End-to-end redesign of a banking super-app with 2M+ users.",
        "imageUrl": "https://cdn.example.com/portfolio/fintech.png",
        "tag": "UI/UX"
      }
    ],
    "experience": [
      {
        "id": "ex_1",
        "role": "Lead Designer",
        "company": "TechCorp Inc.",
        "startYear": 2021,
        "endYear": null,
        "description": "Led a team of 5 designers..."
      }
    ]
  }
}
```

---

#### `PATCH /users/me/profile`
Cập nhật profile của chính mình.

**Request body (partial):**
```json
{
  "title": "Senior Full-Stack Developer",
  "hourlyRate": 95,
  "skills": ["React", "NestJS", "PostgreSQL"]
}
```

**Response 200:** UserProfile object

---

### 3.6 Payments Module

#### `GET /contracts/:contractId/payments`
Lấy lịch sử thanh toán.

**Response 200:**
```json
{
  "data": [
    {
      "id": "pay_001",
      "contractId": "CTR-2024-892",
      "milestoneId": "ms_001",
      "amount": 3125000,
      "status": "completed",
      "createdAt": "2024-10-30T10:00:00Z",
      "completedAt": "2024-10-30T10:05:00Z"
    }
  ]
}
```

**Payment status enum:** `pending | processing | completed | failed`

---

#### `POST /contracts/:contractId/payments/release`
Giải phóng escrow sau khi milestone hoàn thành.

**Request body:**
```json
{ "milestoneId": "ms_001" }
```

**Response 200:** Payment object với `status: "completed"`

---

## 4. Screen-to-API Mapping

| Màn hình | Route FE | APIs cần gọi |
|---|---|---|
| Login | `/login` | `POST /auth/login` |
| Tạo hợp đồng | `/contracts/new` | `POST /contracts` |
| Chi tiết hợp đồng | `/contracts/[id]` | `GET /contracts/:id`, `GET /contracts/:id/messages`, `POST /contracts/:id/messages`, `GET /contracts/:id/payments` |
| Hồ sơ | `/profile` | `GET /users/:userId/profile` |
| Ký hợp đồng | (button trong contract detail) | `POST /contracts/:id/sign` |
| Duyệt milestone | (button trong contract detail) | `PATCH /contracts/:id/milestones/:milestoneId/complete` |
| Giải phóng thanh toán | (button trong contract detail) | `POST /contracts/:id/payments/release` |

---

## 5. Authentication Flow

```
1. User nhập email + password → POST /auth/login
2. FE nhận { accessToken, refreshToken }
3. FE lưu accessToken vào localStorage (key: "accessToken")
4. Mọi request tiếp theo: Header "Authorization: Bearer <accessToken>"
5. Khi accessToken hết hạn (401) → FE gọi POST /auth/refresh
6. Nhận accessToken mới → lưu lại → retry request gốc
7. Logout → POST /auth/logout → xóa localStorage
```

> FE file: `lib/api.ts` — hàm `authHeaders()` đọc token từ localStorage.

---

## 6. Shared Types (Frontend vs Backend)

File `types/index.ts` định nghĩa tất cả interfaces.
Backend cần đảm bảo response JSON **khớp đúng field name** với các types này.

### Lưu ý quan trọng về field naming

| FE field | Kiểu | Ghi chú |
|---|---|---|
| `createdAt` | ISO 8601 string | **Không dùng** `timestamp` hay `created_at` |
| `id` | string | UUID hoặc custom ID (e.g. `"CTR-2024-892"`) |
| `budget` | number | **Số nguyên VNĐ**, không phải string |
| `progressPercent` | number | 0–100 |
| `status` | string enum | Xem enum trong từng section |
| `partnerName` | string | Không dùng `partner` hay `partner_name` |

---

## 7. Constants & Config

File `constants/index.ts`:

```typescript
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
```

> Chỉnh `NEXT_PUBLIC_API_URL` trong `.env.local` để trỏ đến BE NestJS.

---

## 8. Shared Components

| Component | File | Dùng ở |
|---|---|---|
| `<NavBar activePage="..." />` | `components/shared/NavBar.tsx` | Tất cả pages |
| `<Footer />` | `components/shared/Footer.tsx` | Tất cả pages |
| `<SectionCard>` / `<SectionHeading>` | `components/shared/SectionCard.tsx` | Create Contract form |

---

## 9. TODO khi BE sẵn sàng

Tìm các comment `// TODO:` trong code FE để kết nối API thực:

### `app/contracts/new/page.tsx` — handleSubmit
```typescript
// TODO: replace console.log with real API call when BE is ready
// const result = await contractsApi.create(payload);
// router.push(`/contracts/${result.data.id}`);
```

### `app/contracts/[id]/page.tsx` — DiscussionPanel.handleSend
```typescript
// TODO: call chatApi.sendMessage({ contractId, type: "text", text: trimmed })
```

### `app/profile/page.tsx` — ProfileSidebar
```typescript
// TODO: call profileApi.get(userId) để load dữ liệu thực
```

---

## 10. Cấu trúc folder đề xuất cho NestJS BE

```
src/
├── auth/
│   ├── auth.controller.ts      # POST /auth/login, /logout, /me, /refresh
│   ├── auth.service.ts
│   └── dto/
│       ├── login.dto.ts
│       └── auth-tokens.dto.ts
│
├── contracts/
│   ├── contracts.controller.ts  # GET/POST /contracts, GET/POST /contracts/:id/...
│   ├── contracts.service.ts
│   └── dto/
│       ├── create-contract.dto.ts
│       └── contract-response.dto.ts
│
├── messages/
│   ├── messages.controller.ts   # GET/POST /contracts/:contractId/messages
│   └── dto/
│       └── send-message.dto.ts
│
├── users/
│   ├── users.controller.ts      # GET /users/:userId/profile, PATCH /users/me/profile
│   └── dto/
│       └── update-profile.dto.ts
│
├── payments/
│   ├── payments.controller.ts   # GET/POST /contracts/:contractId/payments
│   └── dto/
│       └── release-payment.dto.ts
│
└── common/
    ├── interceptors/
    │   └── response-transform.interceptor.ts   # wrap { data, message }
    └── filters/
        └── http-exception.filter.ts            # wrap { statusCode, message, errors }
```

> **Key interceptor:** Backend cần có `ResponseTransformInterceptor` để tất cả response
> đều có dạng `{ data: T, message?: string }`.

---

*Tài liệu được tạo từ codebase FE — cập nhật khi có thay đổi lớn.*
