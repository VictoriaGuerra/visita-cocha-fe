import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private titleService: Title, private meta: Meta) { }

  public setTitle(title: string) {
    this.titleService.setTitle(title);
    this.updateTag('og:title', title);
  }

  public setDescription(description: string) {
    this.updateTag('description', description);
    this.updateTag('og:description', description);
  }

  public updateTag(name: string, content: string) {
    if (!content) { return; }
    const selector = `name='${name}'`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }
}
