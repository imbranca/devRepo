import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../interfaces/Product';
import { BehaviorSubject, of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProducts: Product[] = [
    {
      id: 'abcd',
      name: 'ProductOne',
      description: 'Product Description',
      logo: 'logo.png',
      date_release: '',
      date_revision: ''
    },
    {
      id: 'abce',
      name: 'ProductTwo',
      description: 'Product Description',
      logo: 'logo.png',
      date_release: '',
      date_revision: ''
    },
    {
      id: 'abcf',
      name: 'ProductThree',
      description: 'Product Description',
      logo: 'logo.png',
      date_release: '',
      date_revision: ''
    }
  ];

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj<ProductService>(
      'ProductService',
      ['getAll', 'delete'],
      {
        productToUpdate: new BehaviorSubject<Product | null>(null)
      }
    );

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    productServiceSpy.getAll.and.returnValue(of({ data: mockProducts } as any));

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
