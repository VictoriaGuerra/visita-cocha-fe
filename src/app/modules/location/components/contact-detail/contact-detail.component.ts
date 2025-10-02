import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QrViewerComponent } from 'src/app/modules/shared/components/qr-viewer/qr-viewer.component';

@Component({
  selector: 'contact-detail',
  templateUrl: './contact-detail.html'
})
export class ContactDetailComponent implements OnInit {

  @Input()
  public item: any;

  public ref: DynamicDialogRef;

  constructor(private _dialogService: DialogService) { }

  ngOnInit() {
  }

  public callNumber(): void {
    if ((localStorage.getItem('publicMode') === 'true')) {
      this._openQR('tel:+' + this.item?.contact?.phone);
    } else {
      window.open('tel:+' + this.item?.contact?.phone);
    }
  }

  public sendMail(): void {
    if ((localStorage.getItem('publicMode') === 'true')) {
      this._openQR('mailto:' + this.item?.contact?.mail);
    } else {
      window.location.href = 'mailto:' + this.item?.contact?.mail;
    }
  }

  public openLink(): void {
    if ((localStorage.getItem('publicMode') === 'true')) {
      this._openQR(this.item?.contact?.link);
    } else {
      window.open(this.item?.contact?.link);
    }
  }

  private _openQR(text: string) {
    this.ref = this._dialogService.open(
      QrViewerComponent,
      { 
        header: 'Escanéame',
        data: {
          link: text
        }
      }
    );
  }
}
