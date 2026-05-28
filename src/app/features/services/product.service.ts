import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GetProductsResponse } from '../../interfaces/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<GetProductsResponse> {
    return this.http.get<GetProductsResponse>('/api/bp/products');
  }
}
