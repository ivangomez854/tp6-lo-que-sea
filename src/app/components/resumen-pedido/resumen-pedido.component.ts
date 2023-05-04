import {Component, Inject} from '@angular/core';
import {Pedido} from "../../models/pedido.model";
import {TiposEnvioEnum} from "../../models/enums/tipos-envio.enum";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-resumen-pedido',
  templateUrl: './resumen-pedido.component.html',
  styleUrls: ['./resumen-pedido.component.scss']
})
export class ResumenPedidoComponent {

  pedido: Pedido;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.pedido = data.pedido;
  }

  get loAntesPosible(): TiposEnvioEnum {
    return TiposEnvioEnum.LO_ANTES_POSIBLE;
  }

  get pactarFecha(): TiposEnvioEnum {
    return TiposEnvioEnum.PACTAR_FECHA;
  }

  get imgSrc(): string {
    switch (this.pedido?.idCiudad) {
      case 1: return './assets/img-carlos-paz.png';
      case 2: return './assets/img-cordoba.png';
      default: return './assets/img-san-francisco.png';
    }
  }

  get titulo() {
    return this.pedido?.numeroPedido ? 'Resumen del pedido' : 'Resumen del pedido a abonar'
  }

  get esPedidoFinalizado() {
    return !!this.pedido?.numeroPedido;
  }
}
