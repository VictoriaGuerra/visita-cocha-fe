import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'delivery-iframe',
  templateUrl: './delivery-iframe.html'
})
export class DeliveryIframeComponent {

  @Input()
  public link: string;

  constructor(private _modalController: ModalController) { }

  closeModal() {
    this._modalController.dismiss();
  }
}