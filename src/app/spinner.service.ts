import {Injectable} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  showSpinner = false;

  constructor(private spinnerService: NgxSpinnerService) {}

  show(): void {
    this.showSpinner = true;
    this.spinnerService.show();
  }

  hide(): void {
    this.showSpinner = false;
    this.spinnerService.hide();
  }
}
