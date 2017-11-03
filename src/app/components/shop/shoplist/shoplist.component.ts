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
  isCollapsed : boolean = true;

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

  togglePanel() {
    this.isCollapsed = !this.isCollapsed;
  }

  addProduct(product: Product, shopList: Shoplist) {
    console.log(product);
    this.shopService.addProduct(product, shopList);
  }

  removeProduct(product: Product, shoplist: Shoplist) {
    if(product !== undefined && shoplist !== undefined) {
      this.shopService.removeProduct(product, shoplist);
    }
  }

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
