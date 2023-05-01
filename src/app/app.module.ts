import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/layout/header/header.component';
import {FooterComponent} from './components/layout/footer/footer.component';
import {
  RegistrarPedidoLoQueSeaComponent
} from './components/registrar-pedido-lo-que-sea/registrar-pedido-lo-que-sea.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DomicilioComponent} from './components/domicilio/domicilio.component';
import {SharedModule} from "./shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {MAT_DATE_FORMATS} from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RegistrarPedidoLoQueSeaComponent,
    DomicilioComponent,
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      NgbModule,
      SharedModule,
      ReactiveFormsModule,
      NgxMatTimepickerModule,

    ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },],
  bootstrap: [AppComponent]
})
export class AppModule { }
