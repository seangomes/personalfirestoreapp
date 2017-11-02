import { Component, OnInit, OnDestroy } from '@angular/core';
import { Shoplist, Product } from "../../../models/shoplist";
import { ShopService } from "../../../providers/shop/shop.service";
import { LoaderService } from "../../../providers/loader/loader.service";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-shoplist',
  templateUrl: './shoplist.component.html',
  styleUrls: ['./shoplist.component.css']
})
export class ShoplistComponent implements OnInit, OnDestroy {

  private shopListSubscription: ISubscription;
  private productsSubscription: ISubscription;
  private loaderSubscription: ISubscription;

  shopList: Shoplist;
  products: Product[];
  loader: boolean;

  constructor(private shopService: ShopService, private loaderService: LoaderService) { }

  ngOnInit() {
    //init loader status
    this.loaderSubscription = this.loaderService.getLoader().subscribe(loaderData => this.loader = loaderData);

    //Check if a shoplist is active
    this.shopService.getActiveShoplist().subscribe((data) => {
      this.shopList = data;
      this.getAllProducts();
      console.log(this.shopList);
    });
  }


  getAllProducts() {
    this.loaderService.showLoader();
    this.productsSubscription = this.shopService.getAllProducts().subscribe((products) => {
      this.products = products;
      this.loaderService.hideLoader();
    });
  }

  getActiveShopList() {
    this.shopService.getActiveShoplist().subscribe((data) => this.shopList = data);
  }

  createNewShopList() {
    this.shopService.createNewShopList();
  }

  addProduct(product: Product) {

    console.log(product);
    this.shopService.addProduct(product);
  }



  // createTestShopList() {
  //   this.shopService.createShopList();
  // }

  ngOnDestroy(): void {
    if (this.loaderSubscription !== undefined) {
      this.loaderSubscription.unsubscribe();
    }
    if (this.productsSubscription !== undefined) {
      this.productsSubscription.unsubscribe();
    }
    if (this.shopListSubscription !== undefined) {
      this.shopListSubscription.unsubscribe();
    }


  }
}
