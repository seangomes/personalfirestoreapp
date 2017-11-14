import { Component, OnInit, OnDestroy } from '@angular/core';
import { Shoplist, Product } from "../../../models/shoplist";
import { ShopService } from "../../../providers/shop/shop.service";
import { LoaderService } from "../../../providers/loader/loader.service";
import { ISubscription } from "rxjs/Subscription";
import { Observable, BehaviorSubject } from 'rxjs';


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
  isCollapsed: boolean = true;

  //for search
  searchText : string = "";

  constructor(private shopService: ShopService, private loaderService: LoaderService) { }

  ngOnInit() {
    //init loader status
    this.loaderSubscription = this.loaderService.getLoader().subscribe(loaderData => this.loader = loaderData);

    //Check if a shoplist is active
    this.shopService.getActiveShoplist().subscribe((data) => {
      this.shopList = data;
      this.getAllProducts();
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

  addNewProductToProductList(productName:string) {
    let prodExsist : boolean = false;
    if(productName !== "") {
      //check if it exsist in list
      this.products.forEach(prod => {
        if(prod.name.toLowerCase() === productName.toLowerCase()) {
          prodExsist = true; 
        }
      });

      if(!prodExsist) {
        this.shopService.addNewProductToProductList(productName);
      }
      this.searchText = "";
    }
  }

  removeProduct(product: Product, shoplist: Shoplist) {
    if (product !== undefined && shoplist !== undefined) {
      this.shopService.removeProduct(product, shoplist);
    }
  }

  deleteProduct(product: Product) {
    if(product !== undefined || product !== null) {
      this.shopService.deleteProduct(product);
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
