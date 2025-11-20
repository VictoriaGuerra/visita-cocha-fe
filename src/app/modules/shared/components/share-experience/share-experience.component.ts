import { Component } from '@angular/core';

@Component({
  selector: 'app-share-experience',
  templateUrl: './share-experience.component.html',
  styleUrls: ['./share-experience.component.scss']
})
export class ShareExperienceComponent {

  /**
   * Comparte usando el diálogo nativo del navegador
   */
  public async shareNative(): Promise<void> {
    const shareData = {
      title: 'Visita Cochabamba',
      text: '¡Descubre la ciudad más hermosa de Bolivia! 🏔️✨',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Enlace copiado al portapapeles ✓');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.log('Error al compartir:', err);
      }
    }
  }
}
