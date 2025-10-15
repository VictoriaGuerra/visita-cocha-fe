import { Component, OnInit } from '@angular/core';
import { AtractivosService, Atractivo } from '../../services/atractivos.service';

@Component({
  selector: 'app-atractivos-list',
  templateUrl: './atractivos-list.component.html',
  styleUrls: ['./atractivos-list.component.scss'],
})
export class AtractivosListComponent implements OnInit {
  atractivos: Atractivo[] = [];
  cargando: boolean = true;
  error: string = '';

  constructor(private atractivosService: AtractivosService) {}

  ngOnInit() {
    this.cargarAtractivos();
  }

  cargarAtractivos() {
    this.cargando = true;
    this.error = '';

    this.atractivosService.getAtractivos().subscribe({
      next: (data) => {
        this.atractivos = data;
        this.cargando = false;
        console.log('Atractivos cargados:', data);
      },
      error: (error) => {
        this.error = 'Error cargando los atractivos';
        this.cargando = false;
        console.error('Error:', error);
      }
    });
  }
}