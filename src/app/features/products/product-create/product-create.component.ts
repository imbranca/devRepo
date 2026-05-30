import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Product, ProductResponse } from '../../../interfaces/Product';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { catchError, debounce, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { minTodayValidator, validateId } from '../validators/product.validators';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent implements OnInit{

  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  today = new Date();
  nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  localDate =
  `${this.today.getFullYear()}-${String(this.today.getMonth() + 1).padStart(2, '0')}-${String(this.today.getDate()).padStart(2, '0')}`;
  localNextYear =
  `${this.nextYear.getFullYear()}-${String(this.nextYear.getMonth() + 1).padStart(2, '0')}-${String(this.nextYear.getDate()).padStart(2, '0')}`;

  fb = inject(FormBuilder);
  initialFormValue = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: this.localDate,
    date_revision: this.localNextYear
  };

  productForm = this.fb.group({
    id: [
      this.initialFormValue.id,
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        asyncValidators: [validateId(this.productService)],
        updateOn:'change'
      }
    ],
    name: [
      this.initialFormValue.name,
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
    description: [
      this.initialFormValue.description,
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
    logo: [
      this.initialFormValue.logo,
      Validators.required
    ],
    date_release: [
      this.initialFormValue.date_release,
      [
        Validators.required,
        minTodayValidator()
      ]
    ],
    date_revision:
    [
      {
        value: this.initialFormValue.date_revision,
        disabled: true
      },
      Validators.required
    ],
  });


  ngOnInit(): void {
    this.productForm.get('date_release')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((date)=>{
      let current = new Date(date as string);
      const nextYear = new Date(current);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      this.productForm.get('date_revision')?.setValue((
        nextYear.toISOString().split('T')[0]
      ), { emitEvent: false });
    })
  }

  resetForm(){
    this.productForm.reset({...this.initialFormValue});
  }

  onSubmit(){
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      this.productService.create(this.productForm.getRawValue()).subscribe({
        next: (data:ProductResponse) => {
          alert(data.message);
        },
        error: (error: HttpErrorResponse) => {
           alert(error?.error?.message);
        }
      })
    }
  }
}
