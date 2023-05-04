import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {DomicilioComponent} from "../domicilio/domicilio.component";
import {TiposEnvioEnum} from "../../models/enums/tipos-envio.enum";
import {distinctUntilChanged} from "rxjs";
import * as moment from "moment";
import {NgxSpinnerService} from "ngx-spinner";
import {PagoTarjetaComponent} from "../pago-tarjeta/pago-tarjeta.component";
import {Pedido} from "../../models/pedido.model";
import {DatePipe, Location} from "@angular/common";
import {TarjetaCredito} from "../../models/tarjeta-credito.model";
import {MatDialog} from "@angular/material/dialog";
import {ResumenPedidoComponent} from "../resumen-pedido/resumen-pedido.component";
import {TiposPagoEnum} from "../../models/enums/tipos-pago.enum";


@Component({
  selector: 'app-registrar-pedido-lo-que-sea',
  templateUrl: './registrar-pedido-lo-que-sea.component.html',
  styleUrls: ['./registrar-pedido-lo-que-sea.component.scss']
})
export class RegistrarPedidoLoQueSeaComponent implements OnInit {
  @ViewChild('steper') stepper: MatStepper;
  @ViewChild('domicilioComercio', {static: true}) domicilioComercio: DomicilioComponent;
  @ViewChild('domicilioEntrega', {static: true}) domicilioEntrega: DomicilioComponent;
  @ViewChild('pagoTarjeta') pagoTarjeta: PagoTarjetaComponent;

  form: FormGroup;
  step1Completado = false;
  step2Completado = false;
  step3Completado = false;

  pedido: Pedido = new Pedido();
  private precioKm = 10;
  public pagado: boolean;


  constructor(private fb: FormBuilder,
              private spinnerService: NgxSpinnerService,
              private datePipe: DatePipe,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef,
              private location: Location) {
  }

  ngOnInit() {
    this.crearForm();
  }

  crearForm() {
    this.form = this.fb.group({
      fgPedido: this.fb.group({
        txDescripcion: ['', [Validators.required, Validators.maxLength(20)]],
        txFoto: [null]
      }),
      fgMomentoRecepcion: this.fb.group({
        rbTiposEnvio: [TiposEnvioEnum.LO_ANTES_POSIBLE, [Validators.required]],
        dpFechaEnvio: [''],
        tpHoraEnvio: ['']
      }),
      fgPago: this.fb.group({
        rbTiposPago: [TiposPagoEnum.EFECTIVO, [Validators.required]],
        txMontoAbonar: ['', [Validators.required, Validators.pattern(/^(\d+)([,.]\d{1,2})?$/)]]
      })
      // fgDomicilioEntrega

    })

    this.rbTiposEnvio.valueChanges.pipe(distinctUntilChanged())
      .subscribe(res => {
        if (res === this.loAntesPosible) {
          this.dpFechaEnvio.reset();
          this.tpHoraEnvio.reset();
        } else {
          this.dpFechaEnvio.setValidators([Validators.required]);
          this.tpHoraEnvio.setValidators([Validators.required]);
        }
      });

    this.tpHoraEnvio.valueChanges.pipe(distinctUntilChanged())
      .subscribe(res => {
        if (res) {
          this.validarHoraMinima();
        }
      });

    this.rbTiposPago.valueChanges.pipe(distinctUntilChanged())
      .subscribe(res => {
        if (res === this.efectivo) {
          this.txMontoAbonar.reset();
        } else {
          this.txMontoAbonar.setValidators([Validators.required]);
        }
        this.cdr.detectChanges();
      });
  }

  seleccionarArchivo(input: HTMLInputElement) {
    if (input.files && input.files.length > 0) {
      // @ts-ignore
      const fileName = input.files[0].name;
      this.txFoto.setValue(fileName);
    }
  }

  validarHoraMinima(): void {
    const now = moment();
    const fecha = this.dpFechaEnvio.value;
    const hora = this.tpHoraEnvio.value;
    if (!fecha || fecha.isAfter(now, 'day')) {
      this.tpHoraEnvio.clearValidators();
      this.tpHoraEnvio.updateValueAndValidity();
      return;
    }

    const horaSeleccionada = moment(hora, 'HH:mm').toDate();
    let horaMinima = moment().toDate();
    if (horaMinima.getMinutes() > 30) {
      const minutosRestantes = horaMinima.getMinutes() - 30;
      horaMinima.setHours(horaMinima.getHours() + 1);
      horaMinima.setMinutes(minutosRestantes);
    } else {
      horaMinima.setMinutes(horaMinima.getMinutes() + 30);
    }
    if (horaSeleccionada < horaMinima) {
      this.tpHoraEnvio.setErrors({horaInvalida: {mensaje: 'Para envios en el día, la hora mínima debe ser 30 minutos posteriores a la creación del pedido.'}});
    }
  }

  permiteVerVuelto(): boolean {
    return !!this.pedido.precio && (+this.rbTiposPago.value === this.efectivo) && (+this.txMontoAbonar.value > this.pedido.precio);
  }

  calcularVuelto(): number {
    return +(this.txMontoAbonar.value - this.pedido.precio)?.toFixed(2);
  }

  private calcularDistanciaMonto() {
    const min = 1;
    const max = 15;
    const distanciaKm = +(Math.random() * (max - min) + min).toFixed(2);
    this.pedido.distanciaKm = distanciaKm;
    this.pedido.precio = distanciaKm * this.precioKm;
  }

  private calcularNumeroPedido(): string {
    const randomNumber = Math.floor(Math.random() * 1000000); // Genera un número aleatorio entre 0 y 999999
    const paddedNumber = randomNumber.toString().padStart(6, '0'); // Completa con ceros a la izquierda hasta una cadena de 6 dígitos
    return paddedNumber;
  }

  permiteFinalizar(): boolean {
    return this.step1Completado && this.step2Completado &&
      ((+this.rbTiposPago.value === this.efectivo && this.txMontoAbonar.valid) ||
        (!!this.pagoTarjeta && this.pagoTarjeta.permitePagar()));
  }

  finalizarPedido() {
    if (this.permiteFinalizar()) {
      this.pedido.tipoPago = this.rbTiposPago.value;
      this.pedido.fechaPedido = new Date();
      this.pedido.numeroPedido = this.calcularNumeroPedido();
      switch (this.pedido.tipoPago) {
        case  TiposPagoEnum.EFECTIVO: {
          this.pedido.montoAbonar = +this.txMontoAbonar.value;
          this.pedido.montoVuelto = this.permiteVerVuelto() ? this.calcularVuelto() : this.pedido.montoVuelto;
          break;
        }
        case TiposPagoEnum.TARJETA_VISA: {
          const tarjeta = new TarjetaCredito();
          tarjeta.entidad = 'VISA';
          tarjeta.nombreTitular = this.pagoTarjeta.txNombreTitular.value;
          tarjeta.numeroTarjeta = this.pagoTarjeta.txNumeroTarjeta.value;
          tarjeta.vencimiento = this.pagoTarjeta?.dpVencimiento?.value?.toDate();
          this.pedido.tarjeta = tarjeta;
        }
      }
      this.form.disable()
      this.domicilioComercio.form.disable();
      this.domicilioEntrega.form.disable();
      if(this.pagoTarjeta) {
        this.pagoTarjeta.form.disable();
      }


      this.spinnerService.show();
      setTimeout(() => {
        this.spinnerService.hide();
        this.completarStep3();
        this.mostrarPedido();
      }, 3000);
    }
  }

  mostrarPedido() {
    this.dialog.open(ResumenPedidoComponent, {
      data: {pedido: this.pedido},
      autoFocus: false,
      disableClose: true,
      width: 'auto',
      height: '90vh'
    });
  }

  reiniciarSimulacion() {
    const currentUrl = this.location.path();
    // @ts-ignore
    window.location.href = currentUrl;
    // @ts-ignore
    window.location.reload();
  }

  //region stepper
  // Para avanzar al siguiente paso:
  siguienteStep() {
    switch (this.stepper?.selectedIndex) {
      case 0:
        this.completarStep1();
        this.spinnerService.show()
        setTimeout(() => {
          this.spinnerService.hide()
          this.stepper.next();
        }, 2000);
        break;
      case 1:
        this.completarStep2();
        this.spinnerService.show()
        setTimeout(() => {
          this.spinnerService.hide()
          this.mostrarPedido();
          this.stepper.next();
        }, 2000);
        break;
      case 2:
        this.completarStep3();
    }
  }

  // Para retroceder al paso anterior:
  previoStep() {
    this.stepper.previous();
  }

  // Para establecer el índice del paso actual:
  setStep(index: number) {
    this.stepper.selectedIndex = index;
  }

  // Permite avanzar step
  permiteAvanzarStep(): boolean {
    switch (this.stepper?.selectedIndex) {
      case 0:
        return this.esValidoStep1();

      case 1:
        return this.esValidoStep2();
      default:
        return false;
    }
  }

  permiteVerBotonSiguiente(): boolean {
    return this.stepper?.selectedIndex !== 2;
  }

  permiteVerBotonFinalizar(): boolean {
    return this.stepper?.selectedIndex === 2;
  }

  esValidoStep1(): boolean {
    return this.fgPedido.valid && this.domicilioComercio.form.valid;
  }

  esValidoStep2(): boolean {
    return this.domicilioEntrega.form.valid && (this.rbTiposEnvio.value === this.loAntesPosible
      || (this.rbTiposEnvio.value === this.pactarFecha && this.dpFechaEnvio.valid && this.tpHoraEnvio.valid));
  }

  completarStep1() {
    this.pedido.descripcionProducto = this.txDescripcion.value || '';
    this.pedido.archivoAdjunto = this.txFoto.value || '';
    this.pedido.direccionComercio = this.domicilioComercio.obtenerDomicilioConcatenado() || '';
    this.pedido.idCiudad = this.domicilioComercio.cbCiudad.value;
    this.domicilioEntrega.cbCiudad.setValue(this.domicilioComercio.cbCiudad.value);
    this.domicilioEntrega.cbCiudad.disable();
    this.step1Completado = true;
  }

  completarStep2() {
    this.pedido.direccionEntrega = this.domicilioEntrega.obtenerDomicilioConcatenado() || '';
    this.pedido.tipoEnvio = this.rbTiposEnvio.value;
    if (this.pedido.tipoEnvio === TiposEnvioEnum.PACTAR_FECHA) {
      this.pedido.momentoEntrega = 'Fecha: ' + this.datePipe.transform(this.dpFechaEnvio.value, 'dd/MM/yyyy') + ' Hora: ' + this.tpHoraEnvio.value;
    }
    this.calcularDistanciaMonto();
    this.step2Completado = true;
  }

  completarStep3() {
    this.step3Completado = true;
  }

  desactivarStepsPedido() {
    this.stepper.disableRipple = false;
  }

  //endregion

  //region getters
  get fgPedido(): FormGroup {
    return this.form.get('fgPedido') as FormGroup;
  }

  get txDescripcion(): FormControl {
    return this.fgPedido.get('txDescripcion') as FormControl;
  }

  get txFoto(): FormControl {
    return this.fgPedido.get('txFoto') as FormControl;
  }

  get fgMomentoRecepcion(): FormGroup {
    return this.form.get('fgMomentoRecepcion') as FormGroup;
  }

  get rbTiposEnvio(): FormControl {
    return this.fgMomentoRecepcion.get('rbTiposEnvio') as FormControl;
  }

  get dpFechaEnvio(): FormControl {
    return this.fgMomentoRecepcion.get('dpFechaEnvio') as FormControl;
  }

  get tpHoraEnvio(): FormControl {
    return this.fgMomentoRecepcion.get('tpHoraEnvio') as FormControl;
  }

  get fgPago(): FormGroup {
    return this.form.get('fgPago') as FormGroup;
  }

  get rbTiposPago(): FormControl {
    return this.fgPago.get('rbTiposPago') as FormControl;
  }

  get txMontoAbonar(): FormControl {
    return this.fgPago.get('txMontoAbonar') as FormControl;
  }

  get maxTamanioArchivos(): number {
    return 5 * 1024 * 1024; // Tamaño máximo en bytes
  }

  get loAntesPosible(): TiposEnvioEnum {
    return TiposEnvioEnum.LO_ANTES_POSIBLE;
  }

  get pactarFecha(): TiposEnvioEnum {
    return TiposEnvioEnum.PACTAR_FECHA;
  }

  get efectivo(): TiposPagoEnum {
    return TiposPagoEnum.EFECTIVO;
  }

  get tarjetaVisa(): TiposPagoEnum {
    return TiposPagoEnum.TARJETA_VISA;
  }

  get fechaActual(): Date {
    return new Date();
  }

  get fechaMinima(): Date {
    return new Date(this.fechaActual.getTime() + 30 * 60000); // Sumar 30 minutos en milisegundos
  }

  get fechaMaxima(): Date {
    return new Date(this.fechaActual.getTime() + 7 * 24 * 60 * 60000); // Sumar 7 días en milisegundos
  }

  get minimoMontoEfectivo(): number | null {
    return this.pedido.precio && this.rbTiposPago.value === this.efectivo ? this.pedido.precio : null;
  }

  //endregion
}
