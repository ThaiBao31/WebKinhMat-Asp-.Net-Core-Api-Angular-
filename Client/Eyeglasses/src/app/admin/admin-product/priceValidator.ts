import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function priceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const price = control.get('price')?.value;
    const purchasePrice = control.get('purchasePrice')?.value;
    
    if (purchasePrice > price) {
      return { priceInvalid: true };
    }
    return null;
  };
}
