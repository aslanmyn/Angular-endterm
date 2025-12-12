import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageCompressionService {
  private worker: Worker | null = null;

  async compressImage(file: File, quality: number = 0.8, maxWidth: number = 800, maxHeight: number = 800): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        this.worker = new Worker(new URL('../workers/image-compression.worker.ts', import.meta.url), { type: 'module' });
      }

      const handleMessage = (e: MessageEvent) => {
        if (e.data.success) {
          this.worker?.removeEventListener('message', handleMessage);
          this.worker?.removeEventListener('error', handleError);
          resolve(e.data.blob);
        } else {
          this.worker?.removeEventListener('message', handleMessage);
          this.worker?.removeEventListener('error', handleError);
          reject(new Error(e.data.error || 'Compression failed'));
        }
      };

      const handleError = (error: ErrorEvent) => {
        this.worker?.removeEventListener('message', handleMessage);
        this.worker?.removeEventListener('error', handleError);
        reject(error);
      };

      this.worker.addEventListener('message', handleMessage);
      this.worker.addEventListener('error', handleError);
      this.worker.postMessage({ file, quality, maxWidth, maxHeight });
    });
  }
}





