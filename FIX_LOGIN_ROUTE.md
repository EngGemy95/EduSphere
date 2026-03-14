# 🔧 إصلاح مشكلة Cannot GET /login

## ❌ المشكلة
```
Cannot GET /login
```

هذا يعني أن Express لا يخدم React routes.

---

## ✅ الحل السريع

### 1. تحقق من Build Logs في Vercel

اذهب إلى **Vercel Dashboard** → **Deployments** → **Build Logs**

ابحث عن:
```
> cd frontend && npm run build
```

**إذا فشل:**
- تحقق من `frontend/package.json` موجود
- تحقق من أن جميع dependencies موجودة

**إذا نجح:**
- تحقق من أن `frontend/dist` تم إنشاؤه

---

### 2. تحقق من Function Logs

اذهب إلى **Functions** → **Logs**

ابحث عن:
```
Serving React build from: ...
```

**إذا رأيت:**
```
No frontend build found. API only mode.
```
يعني React build لم يتم أو غير موجود.

---

### 3. الحل البديل: Build يدوياً

إذا React build لم يتم في Vercel:

```bash
# محلياً
cd EduSphere/frontend
npm install
npm run build

# Commit و Push
git add frontend/dist
git commit -m "Add React build files"
git push
```

ثم **Redeploy** على Vercel.

---

## 🔍 Debug Steps

### Step 1: تحقق من Build

في Vercel Build Logs، يجب أن ترى:
```
✓ Built in XXs
```

### Step 2: تحقق من Files

في Vercel، اذهب إلى **Deployment** → **Source**

تحقق من وجود:
- `frontend/dist/index.html`
- `frontend/dist/assets/`

### Step 3: تحقق من Logs

في Function Logs، يجب أن ترى:
```
Serving React build from: /var/task/frontend/dist
```

---

## 🚨 إذا استمرت المشكلة

### الحل 1: Build محلياً و Push

```bash
cd EduSphere
cd frontend
npm install
npm run build
cd ..
git add frontend/dist
git commit -m "Add React build"
git push
```

### الحل 2: تحقق من vercel.json

تأكد من أن `buildCommand` صحيح:
```json
"buildCommand": "npm install && cd frontend && npm install && npm run build"
```

### الحل 3: تحقق من Environment Variables

تأكد من وجود:
- `VITE_API_BASE_URL` = `https://educationsphere.vercel.app`
- `NODE_ENV` = `production` (يتم إضافتها تلقائياً)

---

## ✅ Checklist

- [ ] Build Logs تظهر نجاح React build
- [ ] `frontend/dist/index.html` موجود
- [ ] Function Logs تظهر "Serving React build"
- [ ] `VITE_API_BASE_URL` موجود على Vercel
- [ ] جربت `/login` بعد Redeploy

---

## 📞 بعد الإصلاح

بعد إصلاح المشكلة:
1. ✅ `/login` يجب أن يعمل
2. ✅ `/dashboard` يجب أن يعمل
3. ✅ `/` يجب أن يعيد redirect إلى `/dashboard`
