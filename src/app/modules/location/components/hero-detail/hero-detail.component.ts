import { Location } from '@angular/common';
import { Component, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QrViewerComponent } from 'src/app/modules/shared/components/qr-viewer/qr-viewer.component';

@Component({
  selector: 'hero-detail',
  templateUrl: './hero-detail.html'
})
export class HeroDetailComponent {

  @Input()
  public item: any;

  public isLoading: boolean = true;
  public ref: DynamicDialogRef;

  constructor(private _dialogService: DialogService,
              private _renderer2: Renderer2,
              private _toast: ToastController,
              private _router: Router,
              public location: Location) { }

  public sharedLink(): void {
    if ((localStorage.getItem('publicMode') === 'true')) {
      this.ref = this._dialogService.open(
        QrViewerComponent,
        { 
          header: 'Escanéame',
          data: {
            link: window.location.origin + this.location.path()
          }
        }
      );
    } else {
      if (navigator.share) {
        navigator.share({
          title: this.item.name,
          url: this._router.url
        }).then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
      } else {
        this._copyToClipboard();
      }
    }
  }

  onImageLoad() {
    this.isLoading = false;
  }

  onImageLoadWithError() {
  }

  private _copyToClipboard(): void {
    if(this._isOS()) {
      const input: HTMLInputElement = this._renderer2.createElement('input');

      this._renderer2.setAttribute(input, 'value', this._router.url);
      this._renderer2.setAttribute(input, 'type', 'text ');

      let range = document.createRange();
      range.selectNodeContents(input);

      let selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      input?.setSelectionRange(0, 999999);
      document.execCommand("copy");
    } else {
      navigator.clipboard.writeText(this._router.url);
    }

    this._presentToast('Link copiado al portapapeles!', 'success');
  }

  private _isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  private async _presentToast(message: string, color: string) {
    const toast = await this._toast.create({
      message: message,
      position: 'top',
      duration: 3000,
      color: color
    });
    await toast.present();
  }

}
