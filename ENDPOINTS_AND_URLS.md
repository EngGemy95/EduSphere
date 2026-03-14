# 📡 جميع الـ Endpoints والـ URLs

## 🌐 Base URLs

### Development (محلي)
- **Backend**: `http://localhost:5554`
- **Frontend**: `http://localhost:3000`
- **API Base**: `http://localhost:5554/api`

### Production (Vercel)
- **Backend**: `https://educationsphere.vercel.app`
- **Frontend**: `https://educationsphere.vercel.app` (نفس الـ URL)
- **API Base**: `https://educationsphere.vercel.app/api`

---

## 🎨 Frontend Routes (React Router)

### الصفحات المتاحة

| Route | URL | الوصف | الحماية |
|-------|-----|------|---------|
| `/` | `http://localhost:3000/` | Redirect إلى `/dashboard` | ✅ Protected |
| `/login` | `http://localhost:3000/login` | صفحة تسجيل الدخول | ❌ Public |
| `/dashboard` | `http://localhost:3000/dashboard` | لوحة التحكم الرئيسية | ✅ Protected |
| `/*` | أي route آخر | Redirect إلى `/dashboard` | ✅ Protected |

### مثال على URLs:

**Development:**
```
http://localhost:3000/login
http://localhost:3000/dashboard
```

**Production:**
```
https://educationsphere.vercel.app/login
https://educationsphere.vercel.app/dashboard
```

---

## 🔌 Backend API Endpoints

### Base URL
- **Development**: `http://localhost:5554/api`
- **Production**: `https://educationsphere.vercel.app/api`

---

## 👤 User Endpoints (`/api/users`)

### Authentication
| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `POST` | `/api/users/login` | تسجيل الدخول | ❌ |
| `POST` | `/api/users/create` | إنشاء مستخدم جديد | ❌ |

### User Management
| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `GET` | `/api/users` | جلب جميع المستخدمين | ❌ |
| `GET` | `/api/users/pagination/list` | جلب المستخدمين مع Pagination | ❌ |
| `GET` | `/api/users/:userId` | جلب مستخدم محدد | ❌ |
| `PUT` | `/api/users/update/:userId` | تحديث مستخدم | ❌ |
| `DELETE` | `/api/users/:userId` | حذف مستخدم | ❌ |

### User Images
| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `GET` | `/api/users/image/:fileId` | جلب صورة المستخدم | ❌ |

### Bulk Operations
| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `POST` | `/api/users/create-multiple/:count` | إنشاء مستخدمين متعددين | ❌ |

### أمثلة:

**Development:**
```
POST http://localhost:5554/api/users/login
GET  http://localhost:5554/api/users
GET  http://localhost:5554/api/users/123456789
```

**Production:**
```
POST https://educationsphere.vercel.app/api/users/login
GET  https://educationsphere.vercel.app/api/users
GET  https://educationsphere.vercel.app/api/users/123456789
```

---

## 📚 Course Endpoints (`/api/courses`)

| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `GET` | `/api/courses` | جلب جميع الكورسات | ✅ |
| `GET` | `/api/courses/getAllPagination` | جلب الكورسات مع Pagination | ❌ |
| `GET` | `/api/courses/:courseId` | جلب كورس محدد | ❌ |
| `POST` | `/api/courses/create` | إنشاء كورس جديد | ✅ |
| `PUT` | `/api/courses/update/:courseId` | تحديث كورس | ✅ |
| `DELETE` | `/api/courses/:courseId` | حذف كورس | ❌ |
| `GET` | `/api/courses/image/:fileId` | جلب صورة الكورس | ❌ |

### أمثلة:

```
GET  https://educationsphere.vercel.app/api/courses
POST https://educationsphere.vercel.app/api/courses/create
GET  https://educationsphere.vercel.app/api/courses/123456789
```

---

## 📖 Section Endpoints (`/api/sections`)

| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `POST` | `/api/sections/create` | إنشاء section جديد | ❌ |
| `GET` | `/api/sections/sectionsByCourse/:courseId` | جلب sections كورس محدد | ❌ |
| `GET` | `/api/sections/:sectionId` | جلب section محدد | ❌ |
| `PUT` | `/api/sections/update/:sectionId` | تحديث section | ❌ |
| `DELETE` | `/api/sections/delete/:sectionId` | حذف section | ❌ |
| `PUT` | `/api/sections/reorder/:courseId` | إعادة ترتيب sections | ❌ |

### أمثلة:

```
POST https://educationsphere.vercel.app/api/sections/create
GET  https://educationsphere.vercel.app/api/sections/sectionsByCourse/123456789
```

---

## 🎥 Lecture Endpoints (`/api/lectures`)

| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `POST` | `/api/lectures/create` | إنشاء lecture جديد | ❌ |
| `GET` | `/api/lectures` | جلب جميع lectures | ❌ |
| `GET` | `/api/lectures/sectionLectures/:sectionId` | جلب lectures section محدد | ❌ |
| `GET` | `/api/lectures/:lectureId` | جلب lecture محدد | ❌ |
| `PUT` | `/api/lectures/update/:lectureId` | تحديث lecture | ❌ |
| `DELETE` | `/api/lectures/delete/:lectureId` | حذف lecture | ❌ |
| `PUT` | `/api/lectures/reorder/:sectionId` | إعادة ترتيب lectures | ❌ |
| `GET` | `/api/lectures/pdf/:fileId` | جلب PDF للمحاضرة | ❌ |

### أمثلة:

```
POST https://educationsphere.vercel.app/api/lectures/create
GET  https://educationsphere.vercel.app/api/lectures/sectionLectures/123456789
GET  https://educationsphere.vercel.app/api/lectures/pdf/123456789
```

---

## 🎓 Enrollment Endpoints (`/api/enrollments`)

| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `POST` | `/api/enrollments/create` | تسجيل طالب في كورس | ❌ |
| `POST` | `/api/enrollments/enroll-multiple` | تسجيل طالب في كورسات متعددة | ❌ |
| `POST` | `/api/enrollments/enroll-with-code` | التسجيل بـ Activation Code | ❌ |
| `GET` | `/api/enrollments/user/:userId` | جلب enrollments طالب محدد | ❌ |
| `GET` | `/api/enrollments/course/:courseId` | جلب enrollments كورس محدد | ❌ |
| `GET` | `/api/enrollments/instructor/:instructorId/students` | جلب طلاب مدرس محدد | ❌ |
| `DELETE` | `/api/enrollments/student/:studentId` | حذف جميع enrollments طالب | ❌ |

### Enrollment Requests
| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `GET` | `/api/enrollments/requests/instructor/:instructorId` | جلب طلبات التسجيل لمدرس | ❌ |
| `GET` | `/api/enrollments/requests/student/:userId` | جلب طلبات تسجيل طالب | ❌ |
| `POST` | `/api/enrollments/requests/:requestId/approve` | الموافقة على طلب | ❌ |
| `POST` | `/api/enrollments/requests/:requestId/reject` | رفض طلب | ❌ |

### أمثلة:

```
POST https://educationsphere.vercel.app/api/enrollments/create
GET  https://educationsphere.vercel.app/api/enrollments/user/123456789
```

---

## 📱 App Version Endpoints (`/api/app-version`)

| Method | Endpoint | الوصف | Auth Required |
|--------|----------|-------|---------------|
| `GET` | `/api/app-version` | جلب إصدار التطبيق | ❌ |
| `PUT` | `/api/app-version/update` | تحديث إصدار التطبيق | ✅ |

### أمثلة:

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

### Response
```json
{
  "message": "Login Successfully",
  "data": {
    "_id": "1234567890",
    "name": "User Name",
    "email": "user@example.com",
    "type": "student",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### استخدام Token
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 ملاحظات مهمة

### 1. Frontend API Calls
في React app، جميع API calls تتم عبر:
- **Development**: Proxy من Vite (`/api` → `http://localhost:5554/api`)
- **Production**: `VITE_API_BASE_URL/api` (من Environment Variable)

### 2. CORS
- Backend يدعم CORS من أي origin
- في Production، يمكن تحديد origins محددة

### 3. Protected Routes
- Frontend routes محمية بـ `ProtectedRoute` component
- API endpoints محمية بـ `authenticateToken` middleware

### 4. File Uploads
- User images: `POST /api/users/create` مع `multipart/form-data`
- Course images: `POST /api/courses/create` مع `multipart/form-data`
- Lecture PDFs: `POST /api/lectures/create` مع `multipart/form-data`

---

## 🧪 Testing Endpoints

### Postman Collection
يمكنك استيراد هذه الـ endpoints في Postman:

**Base URL Variables:**
- `{{baseUrl}}` = `https://educationsphere.vercel.app`
- `{{apiUrl}}` = `https://educationsphere.vercel.app/api`
- `{{token}}` = JWT token من login

### أمثلة سريعة:

```bash
# Login
curl -X POST https://educationsphere.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password","deviceId":"web_123"}'

# Get Users
curl https://educationsphere.vercel.app/api/users

# Get Courses (with token)
curl https://educationsphere.vercel.app/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Summary

- **Frontend Routes**: 3 routes (login, dashboard, root)
- **Backend API Endpoints**: ~40+ endpoints
- **Base URLs**: Development & Production
- **Authentication**: JWT tokens
- **File Handling**: GridFS للصور و PDFs
