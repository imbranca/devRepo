import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Product, ProductResponse } from '../../../interfaces/Product';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {LucideChevronLeft, LucideChevronRight, LucideEllipsisVertical} from '@lucide/angular'
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule,ReactiveFormsModule, LucideEllipsisVertical, LucideChevronLeft, LucideChevronRight],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{
  private destroyRef = inject(DestroyRef);
  products: Product[] = [];
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];

  openedProduct:Product|null = null;
  searchControl = new FormControl('', { nonNullable: true });

  showDeleteModal: boolean = false;

  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    localStorage.removeItem('productToUpdate');
    this.productService.productToUpdate.next(null);

     this.searchControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
     ).subscribe(() => {
      this.currentPage = 1;
    });

    this.productService.getAll().subscribe({
      next:(response)=>{
        console.log("response ",response);
        this.products = response.data;
      },
      error:()=>{

      }
    });
  }


  toggleMenu(product: Product):void{
    this.openedProduct = this.openedProduct?.id === product.id ? null: product;
  }
  goCreate(): void {
    this.router.navigate(['/products/create']);
  }


  goToPage(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  editProduct(product: Product){
    localStorage.setItem('productToUpdate',JSON.stringify(product));
    this.productService.productToUpdate.next(product);
    this.router.navigate([`/products/update/${product.id}`]);
  }

  deleteProduct(product: Product){
    this.openedProduct = product;
    this.showDeleteModal = true;
  }

  confirmDelete(){
    if (this.openedProduct?.id) {
      this.productService.delete(this.openedProduct.id).pipe(
        tap((data: Partial<ProductResponse>) => {
          alert(data.message);
        }),
        switchMap(() => this.productService.getAll())
      ).subscribe({
        next: (response) => {
          this.products = response.data;
          this.showDeleteModal = false;
          this.openedProduct = null;
        },
        error: (error) => {
          alert(error?.error?.message ?? 'Error deleting product');
        }
      });
    }
  }
  get filteredProducts(): Product[] {
    const search = this.searchControl.value.trim().toLowerCase();

    if (!search) {
      return this.products;
    }

    return this.products.filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    );
  }

    get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }


  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  get pageRange(): (number | string)[] {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  }
}
