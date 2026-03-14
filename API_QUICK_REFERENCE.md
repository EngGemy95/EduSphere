# ⚡ API Quick Reference

## 🔗 URLs السريعة

### Development
```
Frontend: http://localhost:3000
Backend:  http://localhost:5554
API:      http://localhost:5554/api
```

### Production
```
Frontend: https://educationsphere.vercel.app
Backend:  https://educationsphere.vercel.app
API:      https://educationsphere.vercel.app/api
```

---

## 🎯 أهم الـ Endpoints

### 1. تسجيل الدخول
```
POST /api/users/login
Body: { email, password, deviceId }
```

### 2. جلب جميع المستخدمين
```
GET /api/users
```

### 3. جلب الكورسات
```
GET /api/courses
Headers: Authorization: Bearer {token}
```

### 4. Frontend Routes
```
/login      → صفحة تسجيل الدخول
/dashboard  → لوحة التحكم
```

---

## 📱 Frontend Routes (React)

| Route | URL | الوصف |
|-------|-----|-------|
| `/login` | `http://localhost:3000/login` | Login Page |
| `/dashboard` | `http://localhost:3000/dashboard` | Dashboard |

---

## 🔌 Backend API

### Users
- `POST /api/users/login` - تسجيل الدخول
- `GET /api/users` - جلب جميع المستخدمين
- `GET /api/users/:userId` - جلب مستخدم محدد

### Courses
- `GET /api/courses` - جلب الكورسات
- `POST /api/courses/create` - إنشاء كورس
- `GET /api/courses/:courseId` - جلب كورس محدد

### Sections
- `GET /api/sections/sectionsByCourse/:courseId` - جلب sections

### Lectures
- `GET /api/lectures/sectionLectures/:sectionId` - جلب lectures

### Enrollments
- `POST /api/enrollments/create` - تسجيل في كورس
- `GET /api/enrollments/user/:userId` - enrollments طالب

---

## 🔑 Authentication

```javascript
// في React
const token = localStorage.getItem('eduSphere_token')

// في API calls
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 📝 ملاحظات

- ✅ Frontend routes: `/login`, `/dashboard`
- ✅ API base: `/api`
- ✅ Token في localStorage: `eduSphere_token`
- ✅ Production URL: `https://educationsphere.vercel.app`
