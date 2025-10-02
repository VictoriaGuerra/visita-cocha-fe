import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit {

  public termsState: boolean;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.termsState = false;
  }

  closeModal () {
    this.modalController.dismiss();
  }

  changeTermsState () {
    this.termsState = !this.termsState;
  }

}
