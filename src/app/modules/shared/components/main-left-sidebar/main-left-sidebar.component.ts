import { Component } from '@angular/core';
import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';
import { QrViewerComponent } from '../qr-viewer/qr-viewer.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-main-left-sidebar',
  templateUrl: './main-left-sidebar.component.html',
  styleUrls: ['./main-left-sidebar.component.scss'],
})
export class MainLeftSidebarComponent {

  public ref: DynamicDialogRef;

  constructor(private _dialogService: DialogService,
              private menu: MenuController,
              private modal: ModalController,
              private toast: ToastController,
              public router: Router) {
  }

  closeModal() {
    this.menu.close();
  }

  async openTermsModal() {
    const modal = await this.modal.create({
      component: TermsConditionsComponent,
      backdropDismiss: false
    });
    return await modal.present();
  }

  public copySharedMessage() {
    navigator.clipboard.writeText(window.location.origin);

    this.presentToast('Enlace copiado!', 'tertiary');
  }

  public openLink(link: string) {
    if (localStorage.getItem('publicMode') === 'true') {
      this.ref = this._dialogService.open(
        QrViewerComponent,
        { 
          header: 'Escanéame',
          data: {
            link: link
          }
        }
      );
    } else {
      window.open(link);
    }
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toast.create({
      message: message,
      position: 'top',
      duration: 3000,
      color: color
    });
    await toast.present();
  }
}
