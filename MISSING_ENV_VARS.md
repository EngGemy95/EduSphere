# ⚠️ Environment Variables الناقصة على Vercel

## 🔴 المشكلة

صفحات الويب مش بتفتح لأن **Environment Variables ناقصة**.

---

## ✅ الحل السريع

### أضف Variable واحدة فقط على Vercel:

**VITE_API_BASE_URL**
```
Value: https://educationsphere.vercel.app
```

**BASE_URL** (إذا كان ناقص)
```
Value: https://educationsphere.vercel.app
```

---

## 📋 Environment Variables المطلوبة

### الموجودة (من الصورة):
- ✅ MONGO_URI
- ✅ APP_KEY
- ✅ JWT_SECRET
- ✅ APP_VERSION
- ✅ DEFAULT_USER_PASSWORD
- ✅ COURSE_IMAGE_API
- ✅ USER_IMAGE_API

### الناقصة (مطلوب إضافتها):
- ❌ **VITE_API_BASE_URL** = `https://educationsphere.vercel.app`
- ❌ **BASE_URL** = `https://educationsphere.vercel.app` (إذا كان ناقص)

---

## 🚀 خطوات الإضافة

1. اذهب إلى **Vercel Dashboard**
2. اختر مشروعك
3. **Settings** → **Environment Variables**
4. اضغط **Add New**
5. أضف:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://educationsphere.vercel.app`
   - **Environments**: Production, Preview, Development
6. **Save**
7. **Redeploy** المشروع

---

## ✅ بعد الإضافة

- ✅ Frontend سيعرف أين API
- ✅ صفحات الويب هتفتح
- ✅ Login page سيعمل
- ✅ Dashboard سيعمل

---

## 🔍 إذا استمرت المشكلة

تحقق من:
1. Build Logs في Vercel
2. Function Logs
3. Console في المتصفح
4. تأكد من أن React build تم بنجاح
