export class Shoplist {
  id?:string;
  products:Array<Product>;
  totalPrice:string;
  date:string;
  active: boolean;
}

export class Product {
  id?:string;
  name:string;
  price:string;
}


