import {Routes} from '@angular/router';
import { updateProductGuard } from '../../guards/update-product.guard';

export const PRODUCTS_ROUTE:Routes = [
  {
    path: '',
        loadComponent: () =>
      import('./product-list/product-list.component')
        .then(m => m.ProductListComponent),
  },
  {
    path: 'create',
        loadComponent: () =>
      import('./product-create/product-create.component')
        .then(m => m.ProductCreateComponent),
  },
  {
    path: 'update/:id',
      canActivate: [updateProductGuard],
      loadComponent: () =>
      import('./product-update/product-update.component')
        .then(m => m.ProductUpdateComponent),
  }
]