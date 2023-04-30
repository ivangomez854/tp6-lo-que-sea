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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RegistrarPedidoLoQueSeaComponent,
    DomicilioComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NgbModule,
        SharedModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
