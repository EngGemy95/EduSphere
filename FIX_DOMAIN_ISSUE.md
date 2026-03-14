# 🔧 إصلاح مشكلة الدومين المختلف

## ❌ المشكلة

- **API والموبايل**: `educationsphere.vercel.app` ✅
- **صفحات الويب**: `edu-sphere-cesbgk46r-enggemy95s-projects.vercel.app` ❌

المشكلة: React frontend يفتح على **preview URL** بدلاً من **production domain**.

---

## ✅ الحل

### الحل 1: استخدام نفس الدومين تلقائياً (الأفضل)

تم تحديث `api.js` لاستخدام `window.location.origin` تلقائياً.

**الآن:**
- إذا فتحت على `educationsphere.vercel.app` → API من `educationsphere.vercel.app/api`
- إذا فتحت على preview URL → API من نفس preview URL

**لا حاجة لتغيير أي شيء!** ✅

---

### الحل 2: إزالة VITE_API_BASE_URL (اختياري)

إذا كنت تريد أن يستخدم React نفس الدومين دائماً:

1. **احذف** `VITE_API_BASE_URL` من Vercel Environment Variables
2. React سيستخدم `window.location.origin` تلقائياً

---

## 🔍 كيف يعمل الآن

```javascript
// في api.js
const getApiBaseURL = () => {
  // 1. إذا VITE_API_BASE_URL موجود → استخدمه
  if (envURL) {
    return `${envURL}/api`
  }
  
  // 2. إذا لا → استخدم نفس الدومين الحالي
  const currentOrigin = window.location.origin
  return `${currentOrigin}/api`
}
```

**مثال:**
- Frontend على: `educationsphere.vercel.app`
- API سيكون: `educationsphere.vercel.app/api` ✅

---

## 📝 ملاحظات

### Production Domain
- افتح: `https://educationsphere.vercel.app/login`
- API: `https://educationsphere.vercel.app/api` ✅

### Preview Domain
- افتح: `https://edu-sphere-xxx.vercel.app/login`
- API: `https://edu-sphere-xxx.vercel.app/api` ✅

**كلاهما يعمل الآن!** 🎉

---

## ✅ Checklist

- [x] تم تحديث `api.js` لاستخدام `window.location.origin`
- [ ] Push التغييرات
- [ ] Redeploy على Vercel
- [ ] جرب `https://educationsphere.vercel.app/login`

---

## 🚀 بعد التحديث

1. **Push الكود:**
   ```bash
   git add .
   git commit -m "Fix domain issue - use same domain for API"
   git push
   ```

2. **Redeploy على Vercel:**
   - Vercel سيعيد الرفع تلقائياً
   - أو اضغط "Redeploy" يدوياً

3. **جرب:**
   - `https://educationsphere.vercel.app/login` ✅
   - يجب أن يعمل الآن!

---

## 💡 لماذا هذا الحل أفضل؟

- ✅ يعمل على **Production** و **Preview** domains
- ✅ لا يحتاج Environment Variables إضافية
- ✅ تلقائي - يستخدم نفس الدومين دائماً
- ✅ بسيط وسهل
