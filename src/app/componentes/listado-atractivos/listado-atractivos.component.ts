import { Component, OnInit } from '@angular/core';
import { AtractivosService, Atractivo } from '../../services/atractivos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-atractivos',
  templateUrl: './listado-atractivos.component.html',
  styleUrls: ['./listado-atractivos.component.scss']
})
export class ListadoAtractivosComponent implements OnInit {
  atractivos: Atractivo[] = [];

  constructor(private atractivosService: AtractivosService, private router: Router) {}

  ngOnInit(): void {
    this.atractivosService.getAtractivos().subscribe({
      next: (data) => this.atractivos = data,
      error: (err) => console.error('Error cargando atractivos', err)
    });
  }

  verDetalle(id: string) {
    this.router.navigate(['/detalle', id]);
  }
}
