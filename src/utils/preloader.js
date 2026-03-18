/**
 * Preloader utility to load images and videos in the background.
 */

export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => {
      console.warn(`Failed to preload image: ${url}`);
      resolve(url); // Don't block because of a single asset failure
    };
  });
};

export const preloadVideo = (url) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = url;
    video.preload = 'auto';
    video.muted = true;
    
    // oncanplaythrough is a good indicator that the video is ready for playback
    video.oncanplaythrough = () => resolve(url);
    video.onerror = () => {
      console.warn(`Failed to preload video: ${url}`);
      resolve(url);
    };

    // Timeout for videos as they can be large
    setTimeout(() => resolve(url), 5000);
  });
};

export const preloadAssets = async (assets) => {
  const promises = assets.map((asset) => {
    if (asset.endsWith('.mp4') || asset.endsWith('.webm')) {
      return preloadVideo(asset);
    }
    return preloadImage(asset);
  });
  
  return Promise.all(promises);
};
