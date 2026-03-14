import mongoose from 'mongoose';

const AppVersionSchema = new mongoose.Schema({
  minimumVersion: { 
    type: String, 
    required: true,
    default: '1.0.0'
  },
  currentVersion: { 
    type: String, 
    required: true,
    default: '1.0.0'
  },
  platform: {
    type: String,
    enum: ['android', 'ios', 'both'],
    default: 'both'
  },
  forceUpdate: {
    type: Boolean,
    default: false
  },
  updateMessage: {
    type: String,
    default: 'يوجد تحديث جديد متاح. يرجى تحديث التطبيق للمتابعة.'
  },
  updateMessageEn: {
    type: String,
    default: 'A new update is available. Please update the app to continue.'
  },
  playStoreUrl: {
    type: String,
    default: ''
  },
  appStoreUrl: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

// Ensure only one document exists
AppVersionSchema.statics.getVersion = async function() {
  let version = await this.findOne();
  if (!version) {
    version = await this.create({
      minimumVersion: '1.0.0',
      currentVersion: '1.0.0',
      platform: 'both',
      forceUpdate: false
    });
  }
  return version;
};

export default mongoose.model('AppVersion', AppVersionSchema);
