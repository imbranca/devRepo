import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { minTodayValidator, validateId } from '../validators/product.validators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.scss'
})
export class ProductUpdateComponent {
  id: any;
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  today = new Date();
  nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  fb = inject(FormBuilder);

  productForm!: ReturnType<typeof this.createForm>;


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    console.log('id:', id);
    const storedProduct = localStorage.getItem('updateProduct');

    const product = this.productService.updateProduct.value ??
    (storedProduct ? JSON.parse(storedProduct) : null);
    if (!product) {
      return;
    }
    this.productForm = this.createForm(product);
  }

  onSubmit(){

  }


  createForm(product: any) {
    return this.fb.group({
      id: [
        product.id,
        {
          validators: [Validators.required],
          asyncValidators: [validateId(this.productService)],
          updateOn: 'change'
        }
      ],
      name: [
        product.name,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]
      ],
      description: [
        product.description,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ]
      ],
      logo: [product.logo, Validators.required],
      date_release: [
        product.date_release,
        [Validators.required, minTodayValidator()]
      ],
      date_revision: [
        {
          value: product.date_revision,
          disabled: true
        },
        Validators.required
      ]
    });
  }


}
