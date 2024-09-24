import { Component, input } from '@angular/core';
import { ProductComponent } from "../product/product.component";
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products = input.required<Product[]>();
}
