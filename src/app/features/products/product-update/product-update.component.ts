import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { minTodayValidator, validateId } from '../validators/product.validators';
import { CommonModule } from '@angular/common';
import { Product, ProductResponse } from '../../../interfaces/Product';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.scss'
})

export class ProductUpdateComponent {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  id!: string|null;

  today = new Date();
  nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  productForm!: ReturnType<typeof this.createForm>;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;

    const storedProduct = localStorage.getItem('productToUpdate');
    const product = this.productService.productToUpdate.value ??
    (storedProduct ? JSON.parse(storedProduct) : null);
    if (!product || product?.id !== id) {
      this.router.navigate(['/products']);
      return;
    }

    this.productForm = this.createForm(product);
    this.productForm.get('date_release')?.valueChanges?.pipe(
      takeUntilDestroyed(this.destroyRef)
    )?.subscribe((date) => {
      let current = new Date(date as string);
      const nextYear = new Date(current);
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      this.productForm.get('date_revision')?.setValue((
        nextYear.toISOString().split('T')[0]
      ), { emitEvent: false });
    });

  }

  onSubmit(){
    this.productForm.markAllAsTouched();

    if(this.productForm.valid){
      this.productService.update(this.productForm?.getRawValue() as Product).subscribe({
        next:(data: ProductResponse)=>{
          this.productService.productToUpdate.next(data?.data);
          localStorage.setItem('productToUpdate', JSON.stringify(data?.data));

          alert(data.message);
        },
        error: (error: HttpErrorResponse) => {
          alert(error?.error?.message);
        }
      });
    }
  }


  createForm(product: any) {
    const form = this.fb.group({
      id: [
        product?.id,
        {
          validators: [Validators.required],
        }
      ],
      name: [
        product?.name,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100)
        ]
      ],
      description: [
        product?.description,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ]
      ],
      logo: [product?.logo, Validators.required],
      date_release: [
        product?.date_release,
        [Validators.required]
      ],
      date_revision: [
        {
          value: product?.date_revision,
          disabled: true
        },
        Validators.required
      ]
    });
    return form;
  }


}
