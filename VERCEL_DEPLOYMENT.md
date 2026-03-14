# 🚀 دليل رفع المشروع على Vercel

## 📋 نظرة عامة

المشروع يحتوي على:
- **Backend**: Express.js (Node.js)
- **Frontend**: React.js مع Vite

في Vercel، Express سيخدم React build تلقائياً.

---

## 🔧 Environment Variables المطلوبة على Vercel

### 1️⃣ Backend Environment Variables (موجودة بالفعل)

هذه الـ variables موجودة من قبل:

```env
MONGO_URI=mongodb+srv://...
PORT=5554
BASE_URL=https://educationsphere.vercel.app
USER_IMAGE_API=api/users/image
COURSE_IMAGE_API=api/courses/image
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
DEFAULT_USER_PASSWORD=default_password
NODE_ENV=production
```

### 2️⃣ Frontend Environment Variable (جديدة - مطلوبة)

**يجب إضافة variable جديدة واحدة فقط:**

```env
VITE_API_BASE_URL=https://educationsphere.vercel.app
```

> ⚠️ **مهم**: 
> - Frontend يستخدم `VITE_` prefix (مطلوب من Vite)
> - القيمة يجب أن تكون URL الكامل للـ backend على Vercel
> - لا تضيف `/api` في النهاية (سيتم إضافتها تلقائياً في الكود)

---

## 📝 خطوات إضافة Environment Variables على Vercel

### الطريقة 1: من Vercel Dashboard

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك **educationsphere**
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف variable جديدة:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://educationsphere.vercel.app`
   - **Environment**: اختر **Production, Preview, Development** (كلهم)
5. اضغط **Save**

### الطريقة 2: من Vercel CLI

```bash
vercel env add VITE_API_BASE_URL
# Enter value: https://educationsphere.vercel.app
# Select environments: Production, Preview, Development
```

---

## 🏗️ Build Process على Vercel

Vercel سيقوم تلقائياً بـ:

1. **Install Dependencies**:
   ```bash
   npm install              # Backend dependencies
   cd frontend && npm install  # Frontend dependencies
   ```

2. **Build Frontend**:
   ```bash
   cd frontend && npm run build
   ```
   - سيتم بناء React app في `frontend/dist/`

3. **Deploy Backend**:
   - Express server سيخدم React build من `frontend/dist/`
   - API routes على `/api/*`
   - Frontend routes على `/*`

---

## ✅ التحقق من أن كل شيء يعمل

### بعد الرفع:

1. **افتح**: `https://educationsphere.vercel.app`
   - يجب أن ترى صفحة Login

2. **جرب API**: `https://educationsphere.vercel.app/api/users`
   - يجب أن يعمل API

3. **جرب Login**:
   - سجل دخول من صفحة Login
   - يجب أن ينتقل إلى Dashboard

---

## 🔍 Troubleshooting

### مشكلة: Frontend لا يعمل

**الحل**:
- تأكد من إضافة `VITE_API_BASE_URL` على Vercel
- تأكد من أن القيمة صحيحة: `https://educationsphere.vercel.app`
- Redeploy بعد إضافة الـ variable

### مشكلة: API calls تفشل

**الحل**:
- تأكد من أن `VITE_API_BASE_URL` موجودة
- تحقق من Console في المتصفح للأخطاء
- تأكد من أن Backend يعمل على Vercel

### مشكلة: Build يفشل

**الحل**:
- تأكد من أن `frontend/package.json` موجود
- تأكد من أن جميع dependencies مثبتة
- تحقق من Build Logs في Vercel

---

## 📊 ملخص Environment Variables

| Variable | القيمة | الاستخدام | مطلوب؟ |
|----------|--------|----------|--------|
| `MONGO_URI` | `mongodb+srv://...` | Backend | ✅ موجود |
| `BASE_URL` | `https://educationsphere.vercel.app` | Backend | ✅ موجود |
| `JWT_SECRET` | `your_secret` | Backend | ✅ موجود |
| `VITE_API_BASE_URL` | `https://educationsphere.vercel.app` | **Frontend** | ⚠️ **جديد - مطلوب** |

---

## 🎯 الخلاصة

**ما تحتاج تعمله:**

1. ✅ أضف `VITE_API_BASE_URL` على Vercel
2. ✅ القيمة: `https://educationsphere.vercel.app`
3. ✅ Redeploy المشروع
4. ✅ جرب الموقع

**لا تحتاج:**
- ❌ تغيير Backend variables الموجودة
- ❌ إضافة `/api` في `VITE_API_BASE_URL`
- ❌ تغيير أي شيء في الكود

---

## 📞 ملاحظات إضافية

- في **Development**: Frontend يستخدم `http://localhost:5554` (من vite.config.js)
- في **Production**: Frontend يستخدم `VITE_API_BASE_URL` من Vercel
- Express يخدم React build تلقائياً في Production
- لا حاجة لـ separate deployment للـ frontend
