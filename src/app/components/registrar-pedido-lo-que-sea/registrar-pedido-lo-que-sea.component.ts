import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {DomicilioComponent} from "../domicilio/domicilio.component";
import {TiposEnvioEnum} from "../../models/enums/tipos-envio.enum";
import {distinctUntilChanged} from "rxjs";
import * as moment from "moment";
import {NgxSpinnerService} from "ngx-spinner";
import {PagoTarjetaComponent} from "../pago-tarjeta/pago-tarjeta.component";
import {Pedido} from "../../models/pedido.model";
import {DatePipe} from "@angular/common";
import {TarjetaCredito} from "../../models/tarjeta-credito.model";


@Component({
  selector: 'app-registrar-pedido-lo-que-sea',
  templateUrl: './registrar-pedido-lo-que-sea.component.html',
  styleUrls: ['./registrar-pedido-lo-que-sea.component.scss']
})
export class RegistrarPedidoLoQueSeaComponent implements OnInit{
  @ViewChild('steper') stepper: MatStepper;
  @ViewChild('domicilioComercio', {static: true}) domicilioComercio: DomicilioComponent;
  @ViewChild('domicilioEntrega', {static: true}) domicilioEntrega: DomicilioComponent;
  @ViewChild('pagoTarjeta', {static: true}) pagoTarjeta: PagoTarjetaComponent;

  form: FormGroup;
  step1Completado = false;
  step2Completado = false;
  step3Completado = false;

  pedido: Pedido = new Pedido();


  constructor(private fb: FormBuilder,
              private spinnerService: NgxSpinnerService,
              private datePipe: DatePipe) {
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
      })
      // fgDomicilioEntrega

    })

    this.rbTiposEnvio.valueChanges.pipe(distinctUntilChanged())
      .subscribe(res => {
        if (res === this.loAntesPosible) {
          this.fgMomentoRecepcion.reset();

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
      this.tpHoraEnvio.setErrors({ horaInvalida: {mensaje: 'Para envios en el día, la hora mínima debe ser 30 minutos posteriores a la creación del pedido.'}});
    }
  }

  generarResumenPedidoPagado(resultado: boolean) {
    if(resultado) {
      const tarjeta = new TarjetaCredito();
      tarjeta.entidad = 'VISA';
      tarjeta.nombreTitular = this.pagoTarjeta.txNombreTitular.value;
      tarjeta.numeroTarjeta = this.pagoTarjeta.txNumeroTarjeta.value;
      // tarjeta.vencimiento = this.datePipe.transform(this.pagoTarjeta?.dpVencimiento?.value?.toDate(), 'dd/MM/yyyy'); //TODO VER COMO RESOLVER EL MOMENT
      this.pedido.tarjeta = tarjeta;

      console.table(this.pedido);
    }
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
        }, 3000);
        break;
      case 1:
        this.completarStep2();
        this.spinnerService.show()
        setTimeout(() => {
          this.spinnerService.hide()
          this.stepper.next();
        }, 3000);
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
      this.step1Completado = true;
      console.table(this.pedido);
  }

  completarStep2() {
    this.pedido.direccionEntrega = this.domicilioEntrega.obtenerDomicilioConcatenado() || '';
    this.pedido.tipoEnvio = this.rbTiposEnvio.value;
    if (this.pedido.tipoEnvio === TiposEnvioEnum.PACTAR_FECHA) {
      this.pedido.momentoEntrega = 'Fecha: ' + this.datePipe.transform(this.dpFechaEnvio.value, 'dd/MM/yyyy') + ' Hora: ' + this.tpHoraEnvio.value;
    }
    this.step2Completado = true;
    console.table(this.pedido);
  }

  completarStep3() {
    this.step3Completado = true;
  }

  cancelar() {
    this.stepper.reset();
    this.stepper.disableRipple = true;
    this.fgPedido.reset();
    this.fgMomentoRecepcion.reset();
    this.form.clearValidators();
    this.domicilioEntrega.form.reset();
    this.domicilioComercio.form.reset();
    this.pagoTarjeta.form.reset();

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

  get maxTamanioArchivos(): number {
    return 5 * 1024 * 1024; // Tamaño máximo en bytes
  }

  get loAntesPosible(): TiposEnvioEnum {
    return TiposEnvioEnum.LO_ANTES_POSIBLE;
  }

  get pactarFecha(): TiposEnvioEnum {
    return TiposEnvioEnum.PACTAR_FECHA;
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
  //endregion
}
