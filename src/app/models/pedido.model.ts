import {TiposEnvioEnum} from "./enums/tipos-envio.enum";
import {TiposPagoEnum} from "./enums/tipos-pago.enum";
import {TarjetaCredito} from "./enums/tarjeta-credito.model";

export class Pedido {

  fechaPedido: Date;
  descripcionProducto: string;
  archivoAdjunto: string;
  direccionComercio: string;
  direccionEntrega: string;
  tipoEnvio: TiposEnvioEnum;
  momentoEntrega: string
  distanciaKm: number;
  precio: number;
  montoAbonar?: number;
  tipoPago: TiposPagoEnum;
  tarjeta?: TarjetaCredito;
}
