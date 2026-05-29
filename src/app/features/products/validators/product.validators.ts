import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { catchError, map, Observable, of, switchMap, timer } from "rxjs";
import { ProductService } from "../../services/product.service";

export function validateId(productService: ProductService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    let value = control.value;

    if (!value || value.length < 3) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(id => productService.verification(value)),
      map(data => !data ? null : { idValidationFailed: true }),
      catchError(() => of({ idValidationFailed: true }))
    );
  };
}

  export function minTodayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const selectedDate = new Date(control.value);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selectedDate < today
        ? { minToday: true }
        : null;
    };
  }