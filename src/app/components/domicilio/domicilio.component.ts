import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.component.html',
  styleUrls: ['./domicilio.component.scss']
})
export class DomicilioComponent {
  @Input() titulo = 'Domicilio';
}

