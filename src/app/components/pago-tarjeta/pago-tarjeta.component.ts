import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-pago-tarjeta',
  templateUrl: './pago-tarjeta.component.html',
  styleUrls: ['./pago-tarjeta.component.scss']
})
export class PagoTarjetaComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.crearForm();
  }

  private crearForm() {
    this.form = this.fb.group({
      txNombreTitular: ['', Validators.required],
      txNumeroTarjeta: [null, [Validators.required, Validators.pattern(/^4[0-9]{15}$/)]],
      dpVencimiento: [null, [Validators.required]],
      txCodigoSeguridad: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]]
    })
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
}
