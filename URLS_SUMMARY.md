# 📍 ملخص جميع الـ URLs والـ Endpoints

## 🌐 Base URLs

### Development (محلي)
```
Frontend: http://localhost:3000
Backend:  http://localhost:5554
API:      http://localhost:5554/api
```

### Production (Vercel)
```
Frontend: https://educationsphere.vercel.app
Backend:  https://educationsphere.vercel.app
API:      https://educationsphere.vercel.app/api
```

---

## 🎨 Frontend Pages (React)

| الصفحة | Development URL | Production URL |
|--------|----------------|----------------|
| **Login** | `http://localhost:3000/login` | `https://educationsphere.vercel.app/login` |
| **Dashboard** | `http://localhost:3000/dashboard` | `https://educationsphere.vercel.app/dashboard` |
| **Root** | `http://localhost:3000/` | `https://educationsphere.vercel.app/` |

> ⚠️ **ملاحظة**: Root route (`/`) يعيد توجيه تلقائياً إلى `/dashboard`

---

## 🔌 API Endpoints

### 👤 Users (`/api/users`)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/users/login` | `POST` | تسجيل الدخول |
| `/api/users` | `GET` | جلب جميع المستخدمين |
| `/api/users/pagination/list` | `GET` | جلب المستخدمين مع Pagination |
| `/api/users/:userId` | `GET` | جلب مستخدم محدد |
| `/api/users/create` | `POST` | إنشاء مستخدم جديد |
| `/api/users/update/:userId` | `PUT` | تحديث مستخدم |
| `/api/users/:userId` | `DELETE` | حذف مستخدم |
| `/api/users/image/:fileId` | `GET` | جلب صورة المستخدم |

**أمثلة:**
```
POST https://educationsphere.vercel.app/api/users/login
GET  https://educationsphere.vercel.app/api/users
GET  https://educationsphere.vercel.app/api/users/1234567890
```

---

### 📚 Courses (`/api/courses`)

| Endpoint | Method | الوصف | Auth |
|----------|--------|-------|------|
| `/api/courses` | `GET` | جلب جميع الكورسات | ✅ |
| `/api/courses/getAllPagination` | `GET` | جلب الكورسات مع Pagination | ❌ |
| `/api/courses/:courseId` | `GET` | جلب كورس محدد | ❌ |
| `/api/courses/create` | `POST` | إنشاء كورس جديد | ✅ |
| `/api/courses/update/:courseId` | `PUT` | تحديث كورس | ✅ |
| `/api/courses/:courseId` | `DELETE` | حذف كورس | ❌ |
| `/api/courses/image/:fileId` | `GET` | جلب صورة الكورس | ❌ |

**أمثلة:**
```
GET  https://educationsphere.vercel.app/api/courses
POST https://educationsphere.vercel.app/api/courses/create
GET  https://educationsphere.vercel.app/api/courses/1234567890
```

---

### 📖 Sections (`/api/sections`)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/sections/create` | `POST` | إنشاء section |
| `/api/sections/sectionsByCourse/:courseId` | `GET` | جلب sections كورس |
| `/api/sections/:sectionId` | `GET` | جلب section محدد |
| `/api/sections/update/:sectionId` | `PUT` | تحديث section |
| `/api/sections/delete/:sectionId` | `DELETE` | حذف section |
| `/api/sections/reorder/:courseId` | `PUT` | إعادة ترتيب sections |

**أمثلة:**
```
GET  https://educationsphere.vercel.app/api/sections/sectionsByCourse/1234567890
POST https://educationsphere.vercel.app/api/sections/create
```

---

### 🎥 Lectures (`/api/lectures`)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/lectures/create` | `POST` | إنشاء lecture |
| `/api/lectures` | `GET` | جلب جميع lectures |
| `/api/lectures/sectionLectures/:sectionId` | `GET` | جلب lectures section |
| `/api/lectures/:lectureId` | `GET` | جلب lecture محدد |
| `/api/lectures/update/:lectureId` | `PUT` | تحديث lecture |
| `/api/lectures/delete/:lectureId` | `DELETE` | حذف lecture |
| `/api/lectures/pdf/:fileId` | `GET` | جلب PDF المحاضرة |

**أمثلة:**
```
GET  https://educationsphere.vercel.app/api/lectures/sectionLectures/1234567890
GET  https://educationsphere.vercel.app/api/lectures/pdf/1234567890
```

---

### 🎓 Enrollments (`/api/enrollments`)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/enrollments/create` | `POST` | تسجيل في كورس |
| `/api/enrollments/enroll-multiple` | `POST` | تسجيل في كورسات متعددة |
| `/api/enrollments/enroll-with-code` | `POST` | التسجيل بـ Activation Code |
| `/api/enrollments/user/:userId` | `GET` | جلب enrollments طالب |
| `/api/enrollments/course/:courseId` | `GET` | جلب enrollments كورس |
| `/api/enrollments/instructor/:instructorId/students` | `GET` | جلب طلاب مدرس |
| `/api/enrollments/student/:studentId` | `DELETE` | حذف enrollments طالب |

**Enrollment Requests:**
| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/enrollments/requests/instructor/:instructorId` | `GET` | جلب طلبات التسجيل |
| `/api/enrollments/requests/student/:userId` | `GET` | جلب طلبات طالب |
| `/api/enrollments/requests/:requestId/approve` | `POST` | الموافقة على طلب |
| `/api/enrollments/requests/:requestId/reject` | `POST` | رفض طلب |

**أمثلة:**
```
POST https://educationsphere.vercel.app/api/enrollments/create
GET  https://educationsphere.vercel.app/api/enrollments/user/1234567890
```

---

### 📱 App Version (`/api/app-version`)

| Endpoint | Method | الوصف | Auth |
|----------|--------|-------|------|
| `/api/app-version` | `GET` | جلب إصدار التطبيق | ❌ |
| `/api/app-version/update` | `PUT` | تحديث إصدار التطبيق | ✅ |

**أمثلة:**
```
GET https://educationsphere.vercel.app/api/app-version
```

---

## 🔐 Authentication

### Login Request
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "deviceId": "web_1234567890"
}
```

### استخدام Token
```http
Authorization: Bearer {token}
```

---

## 📊 ملخص سريع

### Frontend Routes
- `/login` - صفحة تسجيل الدخول
- `/dashboard` - لوحة التحكم

### أهم API Endpoints
- `POST /api/users/login` - تسجيل الدخول
- `GET /api/users` - جلب المستخدمين
- `GET /api/courses` - جلب الكورسات
- `GET /api/sections/sectionsByCourse/:courseId` - جلب sections
- `GET /api/lectures/sectionLectures/:sectionId` - جلب lectures

### Base URLs
- **Development**: `http://localhost:3000` (Frontend) | `http://localhost:5554/api` (API)
- **Production**: `https://educationsphere.vercel.app` (Frontend & API)

---

## 📁 الملفات المرجعية

- `ENDPOINTS_AND_URLS.md` - دليل شامل ومفصل
- `API_QUICK_REFERENCE.md` - مرجع سريع
- `EduSphere_API.postman_collection.json` - Postman Collection
