self.onmessage = async function(e: MessageEvent<{ file: File; quality: number; maxWidth: number; maxHeight: number }>) {
  const { file, quality, maxWidth, maxHeight } = e.data;

  try {
    const imageBitmap = await createImageBitmap(file);
    let width = imageBitmap.width;
    let height = imageBitmap.height;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio;
      height = height * ratio;
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(imageBitmap, 0, 0, width, height);
      imageBitmap.close();
      
      const blob = await canvas.convertToBlob({ type: file.type, quality });
      self.postMessage({ success: true, blob });
    } else {
      imageBitmap.close();
      self.postMessage({ success: false, error: 'Failed to get canvas context' });
    }
  } catch (error: any) {
    self.postMessage({ success: false, error: error.message || 'Failed to process image' });
  }
};

