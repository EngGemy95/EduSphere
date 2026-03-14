# 📝 تحديث Lecture Model - إضافة Type Field

## التغييرات المطبقة

### 1. Lecture Model (`src/models/Lecture.js`)
تم إضافة `type` field إلى Schema:
```javascript
type: { 
    type: String, 
    enum: ['video', 'pdf', 'quiz', 'lesson'], 
    required: true, 
    default: 'video' 
}
```

**القيم المدعومة:**
- `video` - فيديو (افتراضي)
- `pdf` - ملف PDF
- `quiz` - اختبار
- `lesson` - درس

### 2. Lecture Controller (`src/controllers/lectureController.js`)

#### `createLecture`:
- ✅ إضافة validation للـ `type`
- ✅ Default value: `'video'` إذا لم يتم التحديد
- ✅ Validation للـ required fields (title, url, sectionId)

#### `updateLecture`:
- ✅ إضافة validation للـ `type` عند التحديث
- ✅ رسالة خطأ واضحة عند إدخال type غير صحيح

### 3. Lecture Repository (`src/repositories/lectureRepository.js`)
- ✅ إضافة `getAllLectures()` method

### 4. Lecture Routes (`src/routes/lectureRoutes.js`)
- ✅ إضافة route لـ `getAllLectures` (GET `/api/lectures/`)
- ✅ إعادة ترتيب Routes لتجنب التعارض

## API Endpoints

### Create Lecture
```
POST /api/lectures/create
Body: {
  "title": "Lecture Title",
  "url": "https://example.com/video.mp4",
  "sectionId": "section_id",
  "visible": "ON" | "OFF",
  "type": "video" | "pdf" | "quiz" | "lesson"  // Optional, default: "video"
}
```

### Get All Lectures
```
GET /api/lectures/
```

### Get Lectures by Section
```
GET /api/lectures/sectionLectures/:sectionId
```

### Get Lecture by ID
```
GET /api/lectures/:lectureId
```

### Update Lecture
```
PUT /api/lectures/update/:lectureId
Body: {
  "title": "Updated Title",  // Optional
  "url": "https://example.com/new-url",  // Optional
  "visible": "ON" | "OFF",  // Optional
  "type": "video" | "pdf" | "quiz" | "lesson"  // Optional
}
```

### Delete Lecture
```
DELETE /api/lectures/delete/:lectureId
```

## التوافق مع Frontend

الباك اند الآن متوافق تماماً مع Frontend:
- ✅ `url` field موجود
- ✅ `type` field موجود مع نفس القيم
- ✅ Validation مناسب
- ✅ Default values صحيحة

## ملاحظات

1. **Type Validation**: الباك اند يتحقق من أن `type` يكون واحد من القيم المدعومة
2. **Default Value**: إذا لم يتم تحديد `type`، سيتم استخدام `'video'` كقيمة افتراضية
3. **Case Insensitive**: الباك اند يقبل `type` بأي حالة (uppercase/lowercase) ويحوله إلى lowercase
