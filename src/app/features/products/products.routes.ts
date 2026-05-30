import {Routes} from '@angular/router';
import { productToUpdateGuard } from '../../guards/product-to-update.guard';

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
      canActivate: [productToUpdateGuard],
      loadComponent: () =>
      import('./product-update/product-update.component')
        .then(m => m.ProductUpdateComponent),
  }
]