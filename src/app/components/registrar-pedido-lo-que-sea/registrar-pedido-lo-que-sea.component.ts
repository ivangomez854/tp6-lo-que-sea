import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-registrar-pedido-lo-que-sea',
  templateUrl: './registrar-pedido-lo-que-sea.component.html',
  styleUrls: ['./registrar-pedido-lo-que-sea.component.scss']
})
export class RegistrarPedidoLoQueSeaComponent implements OnInit{
  form: FormGroup;

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
      // fgDomicilioEntrega

    })
  }

  seleccionarArchivo(input: HTMLInputElement) {
    if (input.files && input.files.length > 0) {
      // @ts-ignore
      const fileName = input.files[0].name;
      this.txFoto.setValue(fileName);
    }
  }


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

  get maxTamanioArchivos(): number {
    return 5 * 1024 * 1024; // Tamaño máximo en bytes
  }

  //endregion
}
