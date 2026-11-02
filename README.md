# TH4 – StudyManager: API + Offline (React Native CLI)

> **Ứng dụng Hỗ trợ Quản lý Học tập Sinh viên (StudyManager)**  
> **Bài Thực Hành 04 (TH04)** - Học phần: Phát triển ứng dụng di động  
> **Kiến trúc:** React Native CLI • REST API (json-server) • Offline-First (Cache + Outbox)  
> **Giao diện:** 100% Tiếng Việt, chuẩn hệ sinh thái đại học, phong cách phẳng hiện đại.

---

## 📌 1. Giới thiệu & Công nghệ sử dụng
Ứng dụng nâng cấp từ phiên bản TH03, chuyển đổi toàn bộ mock data tĩnh sang kiến trúc **REST API** với khả năng hoạt động **offline-first**, tự động đồng bộ hai chiều khi có kết nối mạng và giải quyết xung đột thông minh.

* **Nền tảng:** React Native CLI `0.87.1` (thay thế cho Expo theo yêu cầu đồ án).
* **Điều hướng:** `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`.
* **Lưu trữ ngoại tuyến:** `@react-native-async-storage/async-storage`.
* **Trạng thái mạng:** `@react-native-community/netinfo`.
* **Mock Backend Server:** `json-server@0.17.4`.
* **Quản lý trạng thái:** React Context API (`AppDataContext`, `SyncContext`).
* **Kiểm thử tự động:** Jest (`PASS 7 test suites / 26 tests`).

---

## 🚀 2. Hướng dẫn cài đặt & Khởi chạy

### Bước 1: Khởi động Mock API Server
Server sử dụng `json-server` theo đúng yêu cầu đề bài:
```bash
# Di chuyển vào thư mục THApp (hoặc thư mục gốc dự án)
cd THApp

# Chạy server (đã cấu hình sẵn host 0.0.0.0, port 3000, delay 800ms)
npm run server
```
Hoặc chạy trực tiếp bằng lệnh `json-server`:
```bash
json-server --watch db.json --host 0.0.0.0 --port 3000 --delay 800
```

> **Lưu ý cấu hình IP (`src/config.js`):**
> * **Android Emulator:** Dùng `http://10.0.2.2:3000` (mặc định đã cấu hình sẵn).
> * **Thiết bị thật (Physical Device):** Đổi `BASE_URL` trong `src/config.js` thành `http://<IP_LAN_MAY_TINH>:3000` (ví dụ `http://192.168.1.15:3000`).

### Bước 2: Cài đặt phụ thuộc & Khởi chạy ứng dụng
Mở một cửa sổ Terminal mới:
```bash
cd THApp

# Cài đặt dependencies (nếu chưa cài)
npm install

# Khởi chạy Metro Bundler
npm start
```

Mở tiếp Terminal để cài app lên Android:
```bash
cd THApp

# Chạy ứng dụng trên máy ảo Android hoặc thiết bị cắm cáp
npm run android
```

### Bước 3: Chạy Unit Test kiểm tra
```bash
cd THApp
npm test
```

---

## 🏗️ 3. Sơ đồ luồng dữ liệu (Data Flow Architecture)

Ứng dụng tuân thủ nghiêm ngặt mô hình phân tầng đơn hướng (unidirectional data flow) và nguyên tắc phụ thuộc:

```
┌────────────────────────────────────────────────────────┐
│                   MÀN HÌNH (SCREENS)                  │
│   HomeScreen, CourseListScreen, AssignmentList, ...   │
└───────────┬────────────────────────────────┬───────────┘
            │ Gọi hooks & Context            │ Báo sự kiện Presentational
            ▼                                ▼
┌───────────────────────┐        ┌───────────────────────┐
│   CUSTOM HOOKS &      │        │       COMPONENTS      │
│   CONTEXT PROVIDERS   │        │   ScreenContainer     │
│   - AppDataContext    │        │   OfflineBanner       │
│   - SyncContext       │        │   LoadingView         │
│   - useCachedQuery    │        │   AssignmentItem      │
│   - useNetworkStatus  │        │   StatusToggle, ...   │
│   - useOutboxSync     │        └───────────────────────┘
└───────────┬───────────┘
            │
            ├────────────────────────┐
            ▼                        ▼
┌───────────────────────┐  ┌───────────────────────┐
│     API SERVICES      │  │    STORAGE ENGINES    │
│   - studentService    │  │   - cache.js          │
│   - courseService     │  │     (cache:<name>)    │
│   - sessionService    │  │   - outbox.js         │
│   - assignmentService │  │     (queue pending)   │
│   - gradeService      │  └───────────┬───────────┘
└───────────┬───────────┘              │
            │                          │
            ▼                          ▼
┌───────────────────────┐  ┌───────────────────────┐
│      HTTP CLIENT      │  │     AsyncStorage      │
│   (src/api/client.js) │  │   (Key-Value Store)   │
│   Timeout 10s         │  └───────────────────────┘
│   AbortController     │
│   Chuẩn hóa lỗi       │
└───────────┬───────────┘
            │ HTTP (fetch)
            ▼
┌───────────────────────┐
│      json-server      │
│   (http://10.0.2.2)   │
│        db.json        │
└───────────────────────┘
```

### Chi tiết luồng hoạt động:
1. **Màn hình (Screens):** Không bao giờ gọi trực tiếp `fetch`, `axios` hay `AsyncStorage`. Mọi tương tác dữ liệu đều thông qua `AppDataContext` hoặc hook `useCachedQuery`.
2. **Hook `useCachedQuery(key, fetcher)`:**
   - **Cache-first:** Đọc ngay dữ liệu từ `AsyncStorage` (`cache:<key>`), hiển thị tức thì trên giao diện kèm thời điểm cập nhật lần cuối (`lastUpdated`).
   - Nếu có mạng (`isOnline = true`): ngầm gọi `fetcher()` từ API Service, khi có dữ liệu mới sẽ cập nhật UI và ghi đè vào cache.
3. **Outbox Queue (`storage/outbox.js`):**
   - Khi thực hiện hành động ghi (thêm bài tập, đổi trạng thái bài tập, sửa profile) trong điều kiện Offline hoặc mạng chập chờn:
   - UI áp dụng **Optimistic Update** ngay lập tức, gắn nhãn **"Chưa đồng bộ"**.
   - Hành động được đóng gói dạng `{id, method, url, body, createdAt, localId}` và lưu vào mảng `outbox` trong `AsyncStorage`.
4. **Đồng bộ tự động (`useOutboxSync`):**
   - Lắng nghe sự kiện mạng qua `NetInfo`. Khi `isOnline` chuyển từ `false` sang `true`, hệ thống tự động kích hoạt `syncNow()`.
   - Gửi tuần tự các yêu cầu trong hàng đợi theo đúng thứ tự thời gian tạo (`FIFO`). Sau khi thành công, xóa khỏi queue và hiển thị thông báo `Đã đồng bộ N thay đổi`.

---

## ⚖️ 4. Cơ chế xử lý xung đột dữ liệu (B5 - Conflict Resolution)

### Vấn đề:
Khi người dùng sửa thông tin offline (ví dụ sửa họ tên sinh viên hoặc trạng thái bài tập), nhưng trong thời gian đó trên máy chủ (server) dữ liệu cũng đã bị người khác/quản trị viên cập nhật thành một phiên bản mới hơn.

### Giải pháp áp dụng:
* **Nguyên tắc:** **Server Wins on Stale Base** dựa trên mốc thời gian chuẩn hóa ISO 8601 (`updatedAt`).
* **Quy trình chi tiết:**
  1. Khi client chuẩn bị ghi offline, nó lưu kèm `baseUpdatedAt` (mốc thời gian của bản ghi lúc client bắt đầu chỉnh sửa) và `createdAt` của hành động.
  2. Khi có mạng trở lại, trước khi gửi yêu cầu `PATCH`, client thực hiện một truy vấn `GET` bản ghi hiện tại trên server (`/students/:id` hoặc `/assignments/:id`).
  3. So sánh:
     $$\text{serverTime} = \text{new Date(serverRecord.updatedAt).getTime()}$$
     $$\text{baseTime} = \text{new Date(action.body.baseUpdatedAt).getTime()}$$
  4. **Nếu $\text{serverTime} > \text{baseTime}$:** Phát hiện xung đột! Dữ liệu trên server đã thay đổi sau thời điểm client đọc.
     - Hành động offline bị hủy và xóa khỏi hàng đợi outbox.
     - Ứng dụng giữ nguyên dữ liệu mới nhất từ server.
     - Hiển thị thông báo rõ ràng cho người dùng qua Alert:
       > *"Phát hiện xung đột dữ liệu: Dữ liệu trên máy chủ mới hơn thay đổi offline. Ứng dụng ưu tiên dữ liệu máy chủ và đã bỏ thay đổi trên máy."*
  5. **Nếu $\text{serverTime} \le \text{baseTime}$:** Không có xung đột, client tiến hành gửi request `PATCH` với `updatedAt` mới nhất của lần đồng bộ.

---

## 🧪 5. Hướng dẫn kiểm thử 7 kịch bản (Test Scenarios)

Dưới đây là kịch bản chi tiết để quay video demo hoặc chấm điểm thực tế:

| STT | Kịch bản | Thao tác thực hiện | Kết quả mong đợi |
|:---:|---|---|---|
| **1** | **Khởi động lần đầu không có mạng/server** | Tắt `json-server` (hoặc ngắt mạng máy tính), mở app lần đầu tiên. | Màn hình hiển thị `ErrorView` thông báo lỗi mạng thân thiện và nút **"Thử lại"**. Ứng dụng hoạt động mượt mà, không crash. |
| **2** | **Cache-first & Offline Banner** | Bật server, mở app để load dữ liệu vào cache. Bật chế độ máy bay (Airplane mode) trên điện thoại rồi tắt app mở lại. | Dữ liệu hiển thị ngay từ cache cục bộ. Xuất hiện banner màu vàng **"Bạn đang offline"** trên cùng và dòng chữ **"Cập nhật lần cuối: HH:mm, dd/MM/yyyy"**. |
| **3** | **Thao tác ngoại tuyến (Offline Outbox)** | Vẫn ở chế độ máy bay: Đổi trạng thái 2 bài tập (`todo` ↔ `done`), bấm **"Thêm bài tập"** tạo 1 bài mới. | Giao diện đổi trạng thái ngay (Optimistic Update). Thẻ bài tập và màn Home xuất hiện nhãn **"Chưa đồng bộ"**. Huy hiệu số lượng thay đổi chưa sync tăng lên. |
| **4** | **Tự động đồng bộ khi có mạng** | Tắt chế độ máy bay (kết nối lại mạng). | Hook tự động kích hoạt đồng bộ tuần tự. Hiện thông báo *"Đã đồng bộ 3 thay đổi"*. Các nhãn "Chưa đồng bộ" tự động biến mất. Mở `db.json` thấy dữ liệu đã được cập nhật chính xác. |
| **5** | **Xử lý xung đột (Conflict Resolution)** | Bật máy bay. Vào mục Cá nhân sửa họ tên sinh viên. Trong lúc đó, mở file `db.json` sửa trực tiếp họ tên sinh viên và đặt `updatedAt` thành thời gian tương lai/mới hơn. Tắt máy bay. | Khi đồng bộ, phát hiện server mới hơn: Hiện thông báo xung đột, giữ lại họ tên trên server và bỏ thay đổi offline. |
| **6** | **Trạng thái rỗng (Empty State)** | Vào tab Môn học, gõ tìm kiếm từ khóa không tồn tại (vd: `XYZ9999`) hoặc lọc học kỳ không có lớp. | Hiển thị giao diện `EmptyState` với hình minh họa, tiêu đề và giải thích rõ ràng, không bị trắng màn hình. |
| **7** | **Kéo để làm mới (Pull-to-refresh)** | Ở các màn danh sách (Tổng quan, Môn học, Bài tập, Lịch học, Điểm), vuốt màn hình từ trên xuống dưới. | Vòng xoay xoay tải lại dữ liệu xuất hiện và biến mất sau khi cập nhật thành công, thời gian cập nhật cuối cùng được làm mới. |

---

## 📁 6. Cấu trúc thư mục mã nguồn

```
THApp/
├── App.js                                # Điểm khởi nhập: bọc AppDataProvider + SyncProvider + AppNavigator
├── db.json                               # Cơ sở dữ liệu mock đầy đủ 5 thực thể (≥5 bản ghi/thực thể)
├── README.md                             # Tài liệu hướng dẫn, giải thích xung đột, kiến trúc
├── package.json                          # Scripts & dependencies (React Native CLI)
├── src/
│   ├── config.js                         # BASE_URL (10.0.2.2 / LAN), TIMEOUT (10s), CACHE_TTL
│   ├── api/
│   │   ├── client.js                     # Wrapper fetch: timeout 10s, abort controller, chuẩn hóa lỗi
│   │   ├── studentService.js             # API /students
│   │   ├── courseService.js              # API /courses
│   │   ├── sessionService.js             # API /sessions
│   │   ├── assignmentService.js          # API /assignments
│   │   ├── gradeService.js               # API /grades
│   │   └── __tests__/client.test.js      # Unit tests cho HTTP client
│   ├── storage/
│   │   ├── keys.js                       # Tiền tố cache và outbox key
│   │   ├── cache.js                      # Quản lý đọc/ghi cache AsyncStorage (cache:<name>)
│   │   ├── outbox.js                     # Quản lý hàng đợi ngoại tuyến (enqueue, remove, update)
│   │   └── __tests__/                    # Unit tests cho cache và outbox
│   ├── context/
│   │   ├── AppDataContext.js             # Quản lý tập trung data (student, courses, assignments, grades)
│   │   └── SyncContext.js                # Quản lý trạng thái đồng bộ (isOnline, pendingCount, syncNow)
│   ├── hooks/
│   │   ├── useNetworkStatus.js           # Theo dõi trạng thái mạng qua NetInfo
│   │   ├── useCachedQuery.js             # Cache-first query hook
│   │   └── useOutboxSync.js              # Hook tự động đồng bộ hàng đợi và xử lý xung đột B5
│   ├── navigation/
│   │   ├── routes.js                     # Định nghĩa hằng số tên màn hình (tránh hardcode chuỗi)
│   │   ├── stackOptions.js               # Cấu hình header đồng bộ
│   │   ├── AppNavigator.js               # 5 Bottom Tabs với icon vector SVG và tabBarBadge
│   │   ├── HomeStack.js                  # Native Stack tab Tổng quan
│   │   ├── CourseStack.js                # Native Stack tab Môn học
│   │   ├── ScheduleStack.js              # Native Stack tab Thời khóa biểu
│   │   ├── AssignmentStack.js            # Native Stack tab Bài tập
│   │   └── ProfileStack.js               # Native Stack tab Cá nhân
│   ├── screens/
│   │   ├── home/HomeScreen.js
│   │   ├── courses/CourseListScreen.js
│   │   ├── courses/CourseDetailScreen.js
│   │   ├── schedule/ScheduleScreen.js
│   │   ├── schedule/SessionDetailScreen.js
│   │   ├── assignments/AssignmentListScreen.js
│   │   ├── assignments/AssignmentDetailScreen.js
│   │   ├── assignments/AssignmentFormScreen.js
│   │   ├── profile/ProfileScreen.js
│   │   ├── profile/EditProfileScreen.js
│   │   ├── profile/GradeListScreen.js
│   │   └── profile/GradeDetailScreen.js
│   ├── components/
│   │   ├── common/                       # ScreenContainer, OfflineBanner, LoadingView, ErrorView, EmptyState, ...
│   │   ├── course/CourseCard.js
│   │   ├── schedule/DaySelector.js, SessionCard.js
│   │   ├── assignment/AssignmentItem.js, StatusToggle.js
│   │   ├── grade/GpaSummary.js, GradeRow.js
│   │   └── profile/InfoRow.js
│   ├── theme/
│   │   ├── colors.js                     # Bảng màu chuẩn
│   │   ├── spacing.js                    # Chuẩn khoảng cách, bo góc, vùng bấm ≥44x44
│   │   └── typography.js                 # Chuẩn kích thước và font weight
│   └── utils/
│       ├── date.js                       # Định dạng ngày giờ dd/MM/yyyy, HH:mm, daysLeft, isOverdue
│       ├── gpa.js                        # Tính GPA hệ 4 có trọng số tín chỉ, quy đổi điểm chữ
│       ├── validators.js                 # Kiểm tra dữ liệu form thêm bài tập và sửa thông tin
│       └── __tests__/                    # Unit tests cho gpa, date, validators
```

---

## 🎓 7. Công thức tính GPA & Quy đổi điểm

Theo đúng quy chế đào tạo:
* $CC \times 10\% + GK \times 30\% + CK \times 60\% = \text{Điểm tổng kết (thang 10)}$
* Thang điểm chữ và hệ 4:
  - $[8.5 - 10.0] \rightarrow \text{A} / 4.0$
  - $[8.0 - 8.4] \rightarrow \text{B+} / 3.5$
  - $[7.0 - 7.9] \rightarrow \text{B} / 3.0$
  - $[6.5 - 6.9] \rightarrow \text{C+} / 2.5$
  - $[5.5 - 6.4] \rightarrow \text{C} / 2.0$
  - $[5.0 - 5.4] \rightarrow \text{D+} / 1.5$
  - $[4.0 - 4.9] \rightarrow \text{D} / 1.0$
  - $< 4.0 \rightarrow \text{F} / 0$
* **Công thức GPA:**
  $$\text{GPA} = \frac{\sum (\text{Điểm hệ 4} \times \text{Số tín chỉ})}{\sum \text{Số tín chỉ}}$$
* **Tín chỉ tích lũy:** Các môn bị điểm `F` (hệ 4 = 0) **không** được tính vào tổng tín chỉ tích lũy.
