# B23DCCC097_APP_TH03

> **Ứng dụng Hỗ trợ Quản lý Học tập Sinh viên (Giao diện chuẩn PTIT S-Link)**  
> **Bài Thực Hành 03 (TH03)** - Học phần: Phát triển ứng dụng di động  
> **Học viện Công nghệ Bưu chính Viễn thông (PTIT)**

---

## 📌 Thông tin sinh viên
- **Mã sinh viên:** B23DCCC097
- **Họ và tên:** Nguyễn Văn An (Demo Profile)
- **Lớp:** D21CQCN01-B
- **Khoa:** Công nghệ Thông tin 1

---

## 🎯 Mục tiêu đồ án
Xây dựng ứng dụng di động đa nền tảng bằng **React Native & TypeScript** hỗ trợ sinh viên quản lý toàn diện các hoạt động học tập, bao gồm: môn học, thời khóa biểu, bài tập và kết quả học tập tích lũy. Ứng dụng mô phỏng chính xác giao diện hệ sinh thái **PTIT S-Link** với phong cách thiết kế phẳng hiện đại, gam màu đỏ thương hiệu Học viện (`#BA1B1D`), bộ icon vector SVG đồng bộ và dữ liệu thực tế.

---

## 📱 Các chức năng & Màn hình chính

Ứng dụng kết hợp kiến trúc **Bottom Tab Navigation** (5 tab chính) và **Native Stack Navigation** (chuyển hướng chi tiết):

### 1. Màn hình Trang chủ (Tổng quan - `HomeScreen`)
- **Header sinh viên:** Hiển thị họ tên, MSSV, lớp, khoa, ảnh đại diện và thông báo.
- **Thẻ sinh viên số PTIT (Digital Student ID):**
  - Tích hợp ảnh chân dung, mã vạch Barcode, mã QR ra vào cổng trường/thư viện/phòng thi.
  - Tích xanh trạng thái *"Đang theo học chính khóa"* chuẩn xác thực.
- **Tiện ích S-Link (8 dịch vụ Học viện):**
  - Lịch học, Lịch thi học phần, Bảng điểm, Điểm rèn luyện, Tra cứu học phí, Khảo sát giảng viên, Bộ phận một cửa SV, Đăng ký học phần.
  - Hỗ trợ modal chi tiết có xử lý Safe Area đệm tránh tai thỏ/camera đục lỗ.
- **Tổng quan tiến độ:** GPA tích lũy, số tín chỉ đạt, bài tập chờ, môn học kỳ này và bài tập sắp tới hạn.

### 2. Màn hình Môn học (`SubjectListScreen` & `SubjectDetailScreen`)
- Danh sách môn học hiển thị bằng `FlatList` tối ưu hiệu năng: mã môn, tên môn, số tín chỉ, giảng viên phụ trách, phòng học.
- Thanh tìm kiếm môn học realtime theo tên hoặc mã môn.
- Màn hình chi tiết môn học (`SubjectDetailScreen`):
  - Thông tin giảng dạy, email giảng viên, phòng học, lịch học trong tuần.
  - Tỷ lệ đánh giá học phần: Điểm chuyên cần (10%), Giữa kỳ (30%), Thi kết thúc (60%).
  - Đề cương tóm tắt môn học và danh sách bài tập riêng theo môn.

### 3. Màn hình Thời khóa biểu (`ScheduleScreen`)
- Hiển thị lịch học trong tuần với thanh chọn ngày nhanh (Thứ 2 đến Chủ nhật).
- Danh sách ca học trực quan: Tên môn, thời gian bắt đầu - kết thúc, phòng học, giảng viên.
- Phân loại hình thức học (Lý thuyết / Thực hành) và trạng thái buổi học (Đang diễn ra / Sắp tới / Đã xong).

### 4. Màn hình Bài tập (`AssignmentScreen`)
- Thống kê tiến độ hoàn thành bài tập và thanh tiến độ trực quan.
- Bộ lọc danh mục bài tập: Tất cả, Chưa nộp, Đã nộp, Gấp (sắp tới hạn).
- Cho phép sinh viên tương tác đánh dấu hoàn thành bài tập (toggle checkbox) cập nhật realtime.
- Cảnh báo thời hạn nộp bài (Badge đỏ cho bài tập gấp, hiển thị thời gian còn lại).

### 5. Màn hình Kết quả học tập & Bảng điểm (`GradeDetailScreen` & `ProfileScreen`)
- Thẻ điểm tổng hợp toàn khóa chuẩn PTIT:
  - GPA hệ 4, GPA thang điểm 10, Tổng tín chỉ đạt / yêu cầu, Điểm rèn luyện.
  - Huy hiệu xếp loại học lực (Giỏi, Xuất sắc) và huy hiệu *"Chính thức"*.
- Tra cứu bảng điểm chi tiết theo từng học kỳ:
  - Điểm chuyên cần (CC), Giữa kỳ (GK), Cuối kỳ (CK).
  - Điểm tổng kết thang 10, thang 4 và điểm chữ (A+, A, B+, B...).
  - Tỷ lệ đạt môn học kỳ và tóm tắt tiến độ chương trình đào tạo.

---

## 🛠️ Công nghệ & Kỹ thuật sử dụng
- **Core:** React Native `0.87.1`
- **Language:** TypeScript
- **Navigation:** `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`
- **Safe Area & Screens:** `react-native-safe-area-context`, `react-native-screens`
- **Graphics & Icons:** `react-native-svg` (Bộ icon vector chuẩn S-Link tối ưu hiệu năng)
- **State Management:** React Context API (`AppContext` quản lý dữ liệu sinh viên, môn học, lịch học, bài tập xuyên suốt)
- **Unit Testing:** Jest & React Native Testing Library (`PASS __tests__/App.test.tsx`)

---

## 📂 Cấu trúc thư mục mã nguồn

```
THApp/
├── src/
│   ├── components/       # Header, Badge, AppIcons (bộ icon vector SVG)
│   ├── constants/        # Theme màu sắc chuẩn PTIT (#BA1B1D, #D32F2F)
│   ├── context/          # AppContext (Quản lý trạng thái học tập tập trung)
│   ├── data/             # Mock data chuẩn dữ liệu thực tế sinh viên PTIT
│   ├── navigation/       # RootStack và BottomTabNavigator
│   ├── screens/          # 6 màn hình chức năng chính
│   │   ├── HomeScreen.tsx
│   │   ├── SubjectListScreen.tsx
│   │   ├── SubjectDetailScreen.tsx
│   │   ├── ScheduleScreen.tsx
│   │   ├── AssignmentScreen.tsx
│   │   ├── GradeDetailScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── types/            # TypeScript interfaces & types
├── __tests__/            # Bộ kiểm thử Unit Test
├── android/              # Mã nguồn native Android
├── ios/                  # Mã nguồn native iOS
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

### Yêu cầu môi trường
- Node.js >= 18.x
- npm hoặc yarn
- Android Studio & Android SDK (API 34/35)

### Các bước khởi chạy

1. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

2. **Khởi chạy ứng dụng trên thiết bị Android / Giả lập:**
   ```bash
   npm run android
   ```

3. **Khởi động Metro Bundler (nếu cần):**
   ```bash
   npm start
   ```

4. **Chạy kiểm thử tự động (Unit Test):**
   ```bash
   npm test
   ```
