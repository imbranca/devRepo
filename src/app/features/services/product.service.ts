import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GetProductsResponse, Product, ProductResponse } from '../../interfaces/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public productToUpdate:BehaviorSubject<Product|null> = new  BehaviorSubject<Product|null>(null);

  constructor(private http: HttpClient) { }

  getAll(): Observable<GetProductsResponse> {
    return this.http.get<GetProductsResponse>('/api/bp/products');
  }

  create(body: any): Observable<ProductResponse> {
    return this.http.post<ProductResponse>('/api/bp/products', body);
  }

  update(product: Product): Observable<ProductResponse> {
    const { id, ...body } = product;
    return this.http.put<ProductResponse>(`/api/bp/products/${id}`, body);
  }

  delete(id: string): Observable<Partial<ProductResponse>> {
    return this.http.delete<ProductResponse>(`/api/bp/products/${id}`);
  }

  verification(id: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/bp/products/verification/${id}`);
  }
}
