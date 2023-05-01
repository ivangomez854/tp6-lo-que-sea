import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {DomicilioComponent} from "../domicilio/domicilio.component";
import {TiposEnvioEnum} from "../../models/enums/tipos-envio.enum";
import {distinctUntilChanged} from "rxjs";
import * as moment from "moment";


@Component({
  selector: 'app-registrar-pedido-lo-que-sea',
  templateUrl: './registrar-pedido-lo-que-sea.component.html',
  styleUrls: ['./registrar-pedido-lo-que-sea.component.scss']
})
export class RegistrarPedidoLoQueSeaComponent implements OnInit{
  @ViewChild(MatStepper) stepper: MatStepper;
  @ViewChild(DomicilioComponent) domicilioComercio: DomicilioComponent;
  @ViewChild(DomicilioComponent) domicilioEntrega: DomicilioComponent;

  form: FormGroup;
  step1Completado = false;
  step2Completado = false;
  step3Completado = false;


  constructor(private fb: FormBuilder) {
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
        rbTiposEnvio: [TiposEnvioEnum.LO_ANTES_POSIBLE],
        dpFechaEnvio: [''],
        tpHoraEnvio: ['']
      })
      // fgDomicilioEntrega

    })

    this.rbTiposEnvio.valueChanges.pipe(distinctUntilChanged())
      .subscribe(res => {
        if (res === this.loAntesPosible) {
          this.dpFechaEnvio.reset();
          this.tpHoraEnvio.reset();
        } else {
          this.dpFechaEnvio.setValidators([Validators.required])
          this.tpHoraEnvio.setValidators([Validators.required])
        }
        this.validarHoraMinima();
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
      this.tpHoraEnvio.setErrors(null);
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

  //region stepper
  // Para avanzar al siguiente paso:
  siguienteStep() {
    switch (this.stepper?.selectedIndex) {
      case 0:
        this.completarStep1();
        break;
      case 1:
        this.completarStep2();
        break;
      case 2:
        this.completarStep3();
    }
    this.stepper.next();
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
    return this.domicilioEntrega.form.valid && this.fgMomentoRecepcion.valid;
  }

  completarStep1() {
    if (this.fgPedido.touched && this.fgPedido.valid) {
      this.step1Completado = true;
    }
  }

  completarStep2() {
    this.step2Completado = true;
  }

  completarStep3() {
    this.step3Completado = true;
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
