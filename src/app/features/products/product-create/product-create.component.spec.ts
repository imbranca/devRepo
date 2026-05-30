import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductCreateComponent } from './product-create.component';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('ProductCreateComponent', () => {
  let component: ProductCreateComponent;
  let fixture: ComponentFixture<ProductCreateComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj<ProductService>('ProductService', [
      'create',
      'verification'
    ]);

    productServiceSpy.verification.and.returnValue(of(false));
    productServiceSpy.create.and.returnValue(of({ message: 'Product created' } as any));

    await TestBed.configureTestingModule({
      imports: [ProductCreateComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
          provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeAll(() => {
    spyOn(console, 'warn');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should initialize form with default values', () => {
    expect(component.productForm.get('id')?.value).toBe('');
    expect(component.productForm.get('name')?.value).toBe('');
    expect(component.productForm.get('description')?.value).toBe('');
    expect(component.productForm.get('logo')?.value).toBe('');
    expect(component.productForm.get('date_release')?.value).toBe(component.localDate);
    expect(component.productForm.get('date_revision')?.value).toBe(component.localNextYear);
  });

    it('should validate minlength fields', () => {
    component.productForm.patchValue({
      id: 'te',
      name: 'tes',
      description: 'tes'
    });

    expect(component.productForm.get('id')?.hasError('minlength')).toBeTrue();
    expect(component.productForm.get('name')?.hasError('minlength')).toBeTrue();
    expect(component.productForm.get('description')?.hasError('minlength')).toBeTrue();
  });

  it('should validate maxlength fields', () => {
    component.productForm.patchValue({
      id: 'a'.repeat(11),
      name: 'a'.repeat(101),
      description: 'a'.repeat(201)
    });
    expect(component.productForm.get('id')?.hasError('maxlength')).toBeTrue();
    expect(component.productForm.get('name')?.hasError('maxlength')).toBeTrue();
    expect(component.productForm.get('description')?.hasError('maxlength')).toBeTrue();
  });

  it('should validate past date_release as invalid', () => {
    component.productForm.get('date_release')?.setValue('2000-01-01');

    expect(component.productForm.get('date_release')?.valid).toBeFalse();
  });


  it('should not call create when form is invalid', () => {
    component.productForm.patchValue({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '2000-10-10',
      date_revision: '2000-10-10'
    });

    component.onSubmit();
    expect(productServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should show error alert when create fails', fakeAsync(() => {
    spyOn(window, 'alert');

    productServiceSpy.create.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Error creating product'
        }
      }))
    );
    productServiceSpy.verification.and.returnValue(of(false));
    component.productForm.patchValue({
      id: "abc",
      name: "Nombre producto",
      description: "Descripción producto",
      logo: "assets-1.png",
      date_release: "2027-01-01",
      date_revision: "2028-01-01"
    });


    Object.keys(component.productForm.controls).forEach(key => {
      const control = component.productForm.get(key);
      console.log(key, control?.valid, control?.errors);
    });
    tick(1000);
    expect(component.productForm.valid).toBeTruthy();
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Error creating product');
  }));

});
