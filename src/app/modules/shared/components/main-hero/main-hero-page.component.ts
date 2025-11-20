import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { getBackgroundString } from '../../utils/imgBackground.util';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'main-hero-page',
  templateUrl: './main-hero-page.html',
  styleUrls: ['./main-hero-page.scss']
})
export class MainHeroComponent implements OnInit, AfterViewInit {

  @ViewChild('heroVideo', { static: false }) heroVideo!: ElementRef<HTMLVideoElement>;

  public background: any;
  public videoUrl: SafeResourceUrl;
  public showVideo = true;
  public isVideoLoaded = false;

  // Video de YouTube de Cochabamba (primeros 40 segundos)
  private youtubeVideoId = 'XjyawCcHhQc';

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.background = 'assets/images/backgrounds/mainCover.jpg';
    
    // URL del video embebido con parámetros optimizados
    const videoUrlString = `https://www.youtube.com/embed/${this.youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${this.youtubeVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=0&end=40`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrlString);
  }

  ngOnInit() {
    // Detectar si es móvil para mejor rendimiento
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // En móviles, usar imagen para ahorrar datos
      this.showVideo = false;
    }
  }

  ngAfterViewInit() {
    // Lazy load del video
    setTimeout(() => {
      this.isVideoLoaded = true;
    }, 500);
  }

  getBackgroundString(url: string) {
    return getBackgroundString(url);
  }

  public exploreAttractions(): void {
    this.router.navigate(['/attractions']);
  }

  public exploreGastronomy(): void {
    this.router.navigate(['/restaurants']);
  }

  public scrollToContent(): void {
    const element = document.getElementById('main-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
