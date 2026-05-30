import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUpdateComponent } from './product-update.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { Product } from '../../../interfaces/Product';


describe('ProductUpdateComponent', () => {
  let component: ProductUpdateComponent;
  let fixture: ComponentFixture<ProductUpdateComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProduct = {
    id: 'abc',
    name: 'Product name',
    description: 'Product description',
    logo: 'logo.png',
    date_release: '2026-01-01',
    date_revision: '2027-01-01'
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    productServiceSpy = jasmine.createSpyObj<ProductService>(
      'ProductService',
      ['update'],
      {
        productToUpdate: new BehaviorSubject<Product | null>(mockProduct)
      });
    productServiceSpy.update.and.returnValue(
      of({
        message: 'Product updated',
        data: mockProduct
      } as any)
    );

  console.log('2 before TestBed');
    await TestBed.configureTestingModule({
      imports: [ProductUpdateComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'abc'
              }
            }
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ProductUpdateComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.productForm).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
