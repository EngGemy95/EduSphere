# ⚡ Quick Deploy Guide - Vercel

## 🎯 الخطوات السريعة

### 1️⃣ أضف Environment Variable واحدة فقط

على Vercel Dashboard → Settings → Environment Variables:

```
Name: VITE_API_BASE_URL
Value: https://educationsphere.vercel.app
Environments: Production, Preview, Development
```

### 2️⃣ Push الكود

```bash
git add .
git commit -m "Add React frontend"
git push
```

### 3️⃣ Vercel سيقوم تلقائياً بـ:

- ✅ Install dependencies (Backend + Frontend)
- ✅ Build React app
- ✅ Deploy Express server
- ✅ Serve React build

---

## ✅ التحقق

بعد الرفع، افتح:
- `https://educationsphere.vercel.app` → يجب أن ترى Login page
- `https://educationsphere.vercel.app/api/users` → يجب أن يعمل API

---

## 📝 ملاحظات

- **لا تحتاج** تغيير Backend variables الموجودة
- **لا تحتاج** إضافة `/api` في `VITE_API_BASE_URL`
- **لا تحتاج** separate deployment للـ frontend

كل شيء يعمل من deployment واحد! 🚀
