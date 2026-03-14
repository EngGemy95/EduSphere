import appVersionRepository from '../repositories/appVersionRepository.js';

const appVersionController = {
  async getVersion(req, res) {
    try {
      const version = await appVersionRepository.getVersion();
      res.status(200).json({ 
        message: 'Version fetched successfully', 
        data: version 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching version', 
        error: error.message 
      });
    }
  },

  async updateVersion(req, res) {
    try {
      const {
        minimumVersion,
        currentVersion,
        platform,
        forceUpdate,
        updateMessage,
        updateMessageEn,
        playStoreUrl,
        appStoreUrl
      } = req.body;

      const updateData = {};
      if (minimumVersion !== undefined) updateData.minimumVersion = minimumVersion;
      if (currentVersion !== undefined) updateData.currentVersion = currentVersion;
      if (platform !== undefined) updateData.platform = platform;
      if (forceUpdate !== undefined) updateData.forceUpdate = forceUpdate;
      if (updateMessage !== undefined) updateData.updateMessage = updateMessage;
      if (updateMessageEn !== undefined) updateData.updateMessageEn = updateMessageEn;
      if (playStoreUrl !== undefined) updateData.playStoreUrl = playStoreUrl;
      if (appStoreUrl !== undefined) updateData.appStoreUrl = appStoreUrl;

      const version = await appVersionRepository.updateVersion(updateData);
      res.status(200).json({ 
        message: 'Version updated successfully', 
        data: version 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating version', 
        error: error.message 
      });
    }
  }
};

export default appVersionController;
