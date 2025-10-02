import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QrViewerComponent } from '../qr-viewer/qr-viewer.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html'
})
export class FooterComponent implements OnInit {

  @Input()
  emptyObject: any;

  public ref: DynamicDialogRef;

  public year = new Date().getFullYear();

  constructor(private _dialogService: DialogService) {
  }

  ngOnInit() {}

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

}
