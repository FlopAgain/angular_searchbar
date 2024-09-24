import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { Product } from '../models/product';
import { SearchbarComponent } from './searchbar/searchbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductsComponent, SearchbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project';
  products: Product[];
  searchFilter= "";

  filteredProducts() {
    return this.products.filter((product) => product.name.includes(this.searchFilter));
  }

  constructor(){
    this.products = [
         new Product(1, "name1"),
         new Product(2, "name2"),
         new Product(3, "name3"),
         new Product(4, "name4")
       ]
  }

}
