import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../../interfaces/Product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: 'test',
    name: 'Producto Uno',
    description: 'Descripción',
    logo: 'logo.png',
    date_release: '2026-05-29',
    date_revision: '2027-05-29',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
  httpMock.verify();
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockResponse = {
      data: [mockProduct]
    };
    service.getAll().subscribe(response => {
      expect(response).toEqual(mockResponse as any);
    });

    const req = httpMock.expectOne('/api/bp/products');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should create a product', () => {
    const mockResponse = {
      message: 'Product created'
    };
    service.create(mockProduct).subscribe(response => {
      expect(response).toEqual(mockResponse as any);
    });
    const req = httpMock.expectOne('/api/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);

    req.flush(mockResponse);
  });

  it('should update a product', () => {
    const mockResponse = {
      message: 'Product updated'
    };
    const {id, ...body} = mockProduct;

    service.update(mockProduct).subscribe(response => {
      expect(response).toEqual(mockResponse as any);
    });
    const req = httpMock.expectOne('/api/bp/products/'+mockProduct.id);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);

    req.flush(mockResponse);
  });

    it('should delete a product', () => {
    const mockResponse = {
      message: 'Product deleted'
    };

    service.delete('test').subscribe(response => {
      expect(response).toEqual(mockResponse as any);
    });

    const req = httpMock.expectOne('/api/bp/products/test');
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });
});
