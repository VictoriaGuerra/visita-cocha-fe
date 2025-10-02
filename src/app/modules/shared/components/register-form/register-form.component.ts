import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QrViewerComponent } from '../qr-viewer/qr-viewer.component';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html'
})
export class RegisterFormComponent implements OnInit {

  public ref: DynamicDialogRef;
  public link: string = 'https://forms.gle/EB4kE4UjDWhZbtwx6';
  public show: boolean = true;

  constructor(private _dialogService: DialogService) { }

  ngOnInit() {
  }

  public openLink() {
    if ((localStorage.getItem('publicMode') === 'true')) {
      this.ref = this._dialogService.open(
        QrViewerComponent,
        { 
          header: 'Escanéame',
          data: {
            link: this.link
          }
        }
      );
    } else {
      window.open(this.link);
    }

  }
}
