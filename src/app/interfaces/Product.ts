export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface GetProductsResponse {
  data: Product[];
}

export interface ProductResponse {
  message: string;
  data: Product;
}