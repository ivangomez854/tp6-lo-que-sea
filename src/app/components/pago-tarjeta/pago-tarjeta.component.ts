import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Moment} from "moment";
import {MatDatepicker} from "@angular/material/datepicker";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-pago-tarjeta',
  templateUrl: './pago-tarjeta.component.html',
  styleUrls: ['./pago-tarjeta.component.scss']
})
export class PagoTarjetaComponent {
  @Output() resultadoPago: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    this.crearForm();
  }

  private crearForm() {
    this.form = this.fb.group({
      txNombreTitular: ['', [Validators.required, Validators.maxLength(20)]],
      txNumeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.pattern(/^4[0-9]{15}$/)]],
      dpVencimiento: ['', [Validators.required, Validators.maxLength(7)]],
      txCodigoSeguridad: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/), Validators.maxLength(3)]]
    });
  }

  formatearFecha(mesAnio: Moment, datepicker: MatDatepicker<Moment>) {
    this.dpVencimiento?.setValue(mesAnio);
    datepicker.close();
  }

  permitePagar(): boolean {
    return this.txNombreTitular.valid && this.txNumeroTarjeta.valid && this.txCodigoSeguridad.valid && this.dpVencimiento.valid;
  }

  realizarPago() {
    if(this.permitePagar()) {
      this.spinnerService.show();
      setTimeout(()=> {
        this.resultadoPago.emit(true);
      this.spinnerService.hide()
      }, 5000);
    }
  }

  get txNombreTitular(): FormControl {
    return this.form.get('txNombreTitular') as FormControl;
  }

  get txNumeroTarjeta(): FormControl {
    return this.form.get('txNumeroTarjeta') as FormControl;
  }

  get dpVencimiento(): FormControl {
    return this.form.get('dpVencimiento') as FormControl;
  }

  get txCodigoSeguridad(): FormControl {
    return this.form.get('txCodigoSeguridad') as FormControl;
  }

  get maxDate(): Date {
    return new Date();
  }
}
