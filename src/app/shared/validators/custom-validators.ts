import { FormControl } from '@angular/forms';

export function notOnlySpacesValidator(control: FormControl) {
  if (!control.value) {
    return null;
  }

  if (control.value != null && control.value.trim().length === 0) {
    return { onlySpaces: true };
  }
  return null;
}
