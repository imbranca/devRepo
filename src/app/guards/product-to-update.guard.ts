import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProductService } from '../features/services/product.service';

export const productToUpdateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const productService = inject(ProductService);

  const storedProduct = localStorage.getItem('productToUpdate');

  const product =
    productService.productToUpdate.value ??
    (storedProduct ? JSON.parse(storedProduct) : null);

  return product ? true : router.navigate(['/products']);
};
