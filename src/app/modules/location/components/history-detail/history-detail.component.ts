import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'history-detail',
  templateUrl: './history-detail.html'
})
export class HistoryDetailComponent implements OnInit {

  @Input()
  public item: any;

  public isLoading: boolean = true;
  public ref: DynamicDialogRef;
  public combinedPhotos: any;

  constructor(public location: Location) {
  }

  ngOnInit() {
    if (this.item?.history_data?.photos?.now && this.item?.history_data?.photos?.past) {
      const nowPhotos = this.item.history_data.photos.now;
      const pastPhotos = this.item.history_data.photos.past;
  
      this.combinedPhotos = nowPhotos.map((nowPhoto: string, index: number) => ({
        now: nowPhoto,
        past: pastPhotos[index] || null
      }));
    }
  }
  

  onImageLoad() {
    this.isLoading = false;
  }

  onImageLoadWithError() {
  }
}
