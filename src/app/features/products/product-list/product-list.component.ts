import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/Product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {LucideChevronLeft, LucideChevronRight, LucideEllipsisVertical} from '@lucide/angular'
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideEllipsisVertical, LucideChevronLeft, LucideChevronRight],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];

  openedProduct:Product|null = null;

  showDeleteModal: boolean = false;

  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next:(response)=>{
        console.log("response ",response);
        this.products = response.data;
      },
      error:()=>{

      }
    })
  }


  toggleMenu(product: Product):void{
    this.openedProduct = this.openedProduct?.id === product.id ? null: product;
  }
  goCreate(): void {
    this.router.navigate(['/products/create']);
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
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
    localStorage.setItem('updateProduct',JSON.stringify(product));
    this.productService.updateProduct.next(product);
    this.router.navigate([`/products/update/${product.id}`]);
  }

  deleteProduct(product: Product){
    this.openedProduct = product;
    this.showDeleteModal = true;
    // this.openedMenuId = null;
  }

  confirmDelete(){
    //confirm
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
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
