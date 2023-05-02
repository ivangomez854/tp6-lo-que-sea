import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.component.html',
  styleUrls: ['./domicilio.component.scss']
})
export class DomicilioComponent implements  OnInit{
  @Input() titulo = 'Domicilio';

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.crearForm();
  }

  private crearForm() {
    this.form = this.fb.group({
      txCalle: ['', Validators.required],
      txNumero: ['', Validators.required],
      cbCiudad: [null, Validators.required],
      txReferencias: ['']
    })
  }

  obtenerCiudad(): string {
    switch (+this.cbCiudad.value) {
      case 1: return 'Carlos Paz';
      case 2: return 'Córdoba';
      case 3: return 'San Francisco';
    }
    return '';
  }

  obtenerDomicilioConcatenado(): string {
    return this.txCalle.value + ' ' + +this.txNumero.value + ' - Cdad. ' + this.obtenerCiudad() + ' - Ref: ' + this.txReferencias.value;
  }

  get txCalle(): FormControl {
    return this.form.get('txCalle') as FormControl;
  }

  get txNumero(): FormControl {
    return this.form.get('txNumero') as FormControl;
  }

  get cbCiudad(): FormControl {
    return this.form.get('cbCiudad') as FormControl;
  }

  get txReferencias(): FormControl {
    return this.form.get('txReferencias') as FormControl;
  }
}

