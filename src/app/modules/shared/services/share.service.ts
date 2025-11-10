import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShareService {
  constructor() { }

  /** Share via Web Share API with fallback URL builder */
  public async share(title: string, text: string, url: string) {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title, text, url });
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e };
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      return { ok: true, fallback: 'copied' };
    } catch (e) {
      return { ok: false, error: e };
    }
  }
}
