# 🔍 Debug: Cannot GET /login

## المشكلة
```
Cannot GET /login
```

هذا يعني أن Express لا يخدم React routes بشكل صحيح.

---

## ✅ الحلول المحتملة

### 1. تحقق من React Build

في Vercel Build Logs، تأكد من:
- ✅ `cd frontend && npm install` نجح
- ✅ `npm run build` نجح
- ✅ `frontend/dist` موجود بعد build

### 2. تحقق من Environment Variables

تأكد من وجود:
- ✅ `VITE_API_BASE_URL` = `https://educationsphere.vercel.app`
- ✅ `NODE_ENV` = `production` (يتم إضافتها تلقائياً)

### 3. تحقق من Logs

في Vercel Function Logs، يجب أن ترى:
```
Serving React build from: /var/task/frontend/dist
```

إذا رأيت:
```
No frontend build found. API only mode.
```
يعني React build لم يتم.

---

## 🔧 خطوات الإصلاح

### الخطوة 1: تحقق من Build Logs

1. اذهب إلى Vercel Dashboard
2. اختر Deployment
3. افتح Build Logs
4. ابحث عن:
   ```
   > cd frontend && npm run build
   ```
5. تأكد من أنه نجح

### الخطوة 2: تحقق من Function Logs

1. اذهب إلى Functions tab
2. افتح Logs
3. ابحث عن:
   ```
   Serving React build from: ...
   ```

### الخطوة 3: تحقق من Files

في Vercel، تأكد من أن:
- `frontend/dist/index.html` موجود
- `frontend/dist/assets/` موجود

---

## 🚨 إذا React Build لم يتم

### الحل 1: Build يدوياً محلياً

```bash
cd EduSphere/frontend
npm install
npm run build
```

ثم commit و push:
```bash
git add frontend/dist
git commit -m "Add React build"
git push
```

### الحل 2: تحقق من package.json

تأكد من أن `frontend/package.json` موجود وصحيح.

### الحل 3: تحقق من vite.config.js

تأكد من أن `frontend/vite.config.js` موجود.

---

## 📝 Test محلياً

```bash
# Build React
cd EduSphere/frontend
npm run build

# Run Express
cd ..
NODE_ENV=production npm start

# Test
curl http://localhost:5554/login
# يجب أن يعيد HTML
```

---

## ✅ Checklist

- [ ] React build تم بنجاح في Vercel
- [ ] `frontend/dist/index.html` موجود
- [ ] `VITE_API_BASE_URL` موجود على Vercel
- [ ] Function Logs تظهر "Serving React build"
- [ ] جربت `/login` و `/dashboard`
