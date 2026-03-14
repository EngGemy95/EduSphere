import appVersionRepository from '../repositories/appVersionRepository.js';

/**
 * Compares two version strings (e.g., "1.2.3" vs "1.1.0")
 * Returns: 1 if version1 > version2, -1 if version1 < version2, 0 if equal
 */
function compareVersions(version1, version2) {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  
  const maxLength = Math.max(v1Parts.length, v2Parts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }
  
  return 0;
}

/**
 * Middleware to check app version
 * Expects 'x-app-version' header in the request
 * Returns 426 (Upgrade Required) if version is outdated
 */
export const versionCheckMiddleware = async (req, res, next) => {
  try {
    // Skip version check for app-version endpoints
    if (req.path.includes('/app-version')) {
      return next();
    }

    // Get app version from database
    const appVersion = await appVersionRepository.getVersion();
    
    if (!appVersion || !appVersion.forceUpdate) {
      // Force update is disabled, allow all requests
      return next();
    }

    // Get client version from header
    const clientVersion = req.headers['x-app-version'];
    
    if (!clientVersion) {
      // If no version header, allow request but could log it
      return next();
    }

    // Compare versions
    const minimumVersion = appVersion.minimumVersion || '1.0.0';
    const versionComparison = compareVersions(clientVersion, minimumVersion);

    if (versionComparison < 0) {
      // Client version is lower than minimum required version
      return res.status(426).json({
        error: 'UPDATE_REQUIRED',
        message: appVersion.updateMessage || 'يوجد تحديث جديد متاح. يرجى تحديث التطبيق للمتابعة.',
        messageEn: appVersion.updateMessageEn || 'A new update is available. Please update the app to continue.',
        minimumVersion: minimumVersion,
        currentVersion: appVersion.currentVersion,
        playStoreUrl: appVersion.playStoreUrl || '',
        appStoreUrl: appVersion.appStoreUrl || '',
        forceUpdate: true
      });
    }

    // Version is acceptable, continue
    next();
  } catch (error) {
    // If error occurs, allow request to proceed (fail open)
    console.error('Error in version check middleware:', error);
    next();
  }
};
