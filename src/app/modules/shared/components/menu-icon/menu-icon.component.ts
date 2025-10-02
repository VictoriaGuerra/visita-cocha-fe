import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'menu-icon',
  templateUrl: './menu-icon.html'
})
export class MenuIconComponent implements OnInit {

  menuItems: any;

  constructor() {
    this.menuItems = [
      {
        icon: 'airplane-outline',
        label: 'Turismo',
        url: 'attractions'
      },
      {
        icon: 'fast-food-outline',
        label: 'Gastronomía',
        url: 'restaurants'
      }
    ];
  }

  ngOnInit() {}

}
