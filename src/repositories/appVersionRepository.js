import AppVersion from '../models/AppVersion.js';

const appVersionRepository = {
  async getVersion() {
    return await AppVersion.getVersion();
  },

  async updateVersion(updateData) {
    let version = await AppVersion.findOne();
    if (!version) {
      version = await AppVersion.create({
        minimumVersion: '1.0.0',
        currentVersion: '1.0.0',
        platform: 'both',
        forceUpdate: false,
        ...updateData
      });
    } else {
      version = await AppVersion.findOneAndUpdate(
        {},
        updateData,
        { new: true, runValidators: true }
      );
    }
    return version;
  }
};

export default appVersionRepository;
