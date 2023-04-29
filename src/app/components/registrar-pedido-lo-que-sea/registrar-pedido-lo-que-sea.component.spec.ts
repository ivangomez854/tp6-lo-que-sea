import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPedidoLoQueSeaComponent } from './registrar-pedido-lo-que-sea.component';

describe('RegistrarPedidoLoQueSeaComponent', () => {
  let component: RegistrarPedidoLoQueSeaComponent;
  let fixture: ComponentFixture<RegistrarPedidoLoQueSeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarPedidoLoQueSeaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPedidoLoQueSeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
