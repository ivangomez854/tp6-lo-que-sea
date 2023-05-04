import {TiposEnvioEnum} from "./enums/tipos-envio.enum";
import {TiposPagoEnum} from "./enums/tipos-pago.enum";
import {TarjetaCredito} from "./tarjeta-credito.model";

export class Pedido {
  numeroPedido: string;
  fechaPedido: Date;
  descripcionProducto: string;
  archivoAdjunto: string;
  direccionComercio: string;
  direccionEntrega: string;
  idCiudad: number;
  tipoEnvio: TiposEnvioEnum;
  momentoEntrega: string
  distanciaKm: number;
  precio: number;
  montoAbonar?: number;
  montoVuelto?: number;
  tipoPago: TiposPagoEnum;
  tarjeta?: TarjetaCredito;
}
