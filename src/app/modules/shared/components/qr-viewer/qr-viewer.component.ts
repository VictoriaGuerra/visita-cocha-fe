import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-qr-viewer',
  templateUrl: './qr-viewer.component.html'
})
export class QrViewerComponent implements OnInit {

  public link: string;

  constructor(private _config: DynamicDialogConfig) { }

  ngOnInit() {
    this.link = this._config.data.link;
  }

}
