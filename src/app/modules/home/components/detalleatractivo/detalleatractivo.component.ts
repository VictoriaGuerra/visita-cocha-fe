import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtractivosService, Atractivo } from 'src/app/services/atractivos.service';

@Component({
  selector: 'app-detalle-atractivo',
  templateUrl: './detalleatractivo.component.html',
  styleUrls: ['./detalleatractivo.component.scss']
})
export class DetalleAtractivoComponent implements OnInit {
  atractivo?: Atractivo;

  constructor(
    private route: ActivatedRoute,
    private atractivosService: AtractivosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.atractivosService.getAtractivoById(id).subscribe({
        next: data => this.atractivo = data,
        error: err => console.error('Error al cargar el atractivo:', err)
      });
    }
  }
}
