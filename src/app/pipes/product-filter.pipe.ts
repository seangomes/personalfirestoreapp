import { Pipe, PipeTransform } from '@angular/core';
import { Product } from "../models/shoplist";

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(products: Product[], searchText: string): any[] {
    if(!products) {
      return [];
    }
    if(!searchText) {
      return products;
    }

    searchText = searchText.toLowerCase();

    return products.filter( prod => {
      return prod.name.toLowerCase().includes(searchText);
    });
  }

}
