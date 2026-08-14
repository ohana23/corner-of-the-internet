const readyMedia = new Set();
const pendingMedia = new Map();

const getMediaKey = (media) => `${media.type || "image"}:${media.image}`;

export const isViewerMediaReady = (media) => readyMedia.has(getMediaKey(media));

export const preloadViewerMedia = (media) => {
  if (typeof window === "undefined" || !media?.image) {
    return Promise.resolve();
  }

  const key = getMediaKey(media);

  if (readyMedia.has(key)) {
    return Promise.resolve();
  }

  if (pendingMedia.has(key)) {
    return pendingMedia.get(key);
  }

  const request = media.type === "video"
    ? new Promise((resolve) => {
        const video = document.createElement("video");
        const finish = (isReady) => {
          video.removeEventListener("canplay", handleCanPlay);
          video.removeEventListener("error", handleError);
          video.removeAttribute("src");
          video.load();
          if (isReady) readyMedia.add(key);
          resolve(isReady);
        };
        const handleCanPlay = () => finish(true);
        const handleError = () => finish(false);

        video.preload = "auto";
        video.muted = true;
        video.addEventListener("canplay", handleCanPlay, { once: true });
        video.addEventListener("error", handleError, { once: true });
        video.src = media.image;
        video.load();
      })
    : new Promise((resolve) => {
        const image = new window.Image();

        image.decoding = "async";
        image.onload = async () => {
          try {
            await image.decode();
            readyMedia.add(key);
          } catch {
            // A successful load is still safe to display if decode is unavailable.
            readyMedia.add(key);
          }
          resolve(true);
        };
        image.onerror = () => resolve(false);
        image.src = media.image;
      });

  pendingMedia.set(key, request);
  request.finally(() => pendingMedia.delete(key));
  return request;
};
