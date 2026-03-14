# ✅ Deployment Checklist - Vercel

## قبل الرفع

- [ ] تأكد من أن جميع التغييرات committed و pushed
- [ ] تأكد من أن Backend يعمل محلياً
- [ ] تأكد من أن Frontend يعمل محلياً

## Environment Variables على Vercel

### Backend Variables (موجودة)
- [x] `MONGO_URI`
- [x] `PORT`
- [x] `BASE_URL`
- [x] `USER_IMAGE_API`
- [x] `COURSE_IMAGE_API`
- [x] `JWT_SECRET`
- [x] `JWT_REFRESH_SECRET`
- [x] `DEFAULT_USER_PASSWORD`
- [x] `NODE_ENV=production`

### Frontend Variable (جديد - مطلوب)
- [ ] `VITE_API_BASE_URL=https://educationsphere.vercel.app`

## بعد الرفع

- [ ] افتح `https://educationsphere.vercel.app` - يجب أن ترى Login page
- [ ] جرب API: `https://educationsphere.vercel.app/api/users`
- [ ] جرب تسجيل الدخول
- [ ] تحقق من Dashboard يعمل
- [ ] تحقق من Console في المتصفح (لا أخطاء)

## إذا واجهت مشاكل

1. **Frontend لا يظهر**:
   - تحقق من `VITE_API_BASE_URL` موجودة على Vercel
   - Redeploy المشروع

2. **API calls تفشل**:
   - تحقق من Console للأخطاء
   - تأكد من أن `VITE_API_BASE_URL` صحيحة

3. **Build يفشل**:
   - تحقق من Build Logs في Vercel
   - تأكد من أن `frontend/package.json` موجود
