import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from "../auth/auth.service";
import { ISubscription } from "rxjs/Subscription";
import { User } from "../../models/user";
import { Shoplist, Product } from "../../models/shoplist";
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ShopService {

  private productCollection: AngularFirestoreCollection<Product>;
  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
  private productsSubscription: ISubscription;
  private shopListCollection: AngularFirestoreCollection<Shoplist>;
  private shopListSubject: BehaviorSubject<Shoplist[]> = new BehaviorSubject<Shoplist[]>(null);
  private userObjectSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private singleShopListSubject: BehaviorSubject<Shoplist> = new BehaviorSubject<Shoplist>(null);


  public products$: Observable<Product[]> = this.productsSubject.asObservable();
  public shopLists$: Observable<Shoplist[]> = this.shopListSubject.asObservable();
  public userObject$: Observable<User> = this.userObjectSubject.asObservable();
  public singleShopList$: Observable<Shoplist> = this.singleShopListSubject.asObservable();


  constructor(private afs: AngularFirestore) {

    //Init all products
    this.productCollection = this.afs.collection('products', ref => ref.orderBy('name'));
    this.productsSubscription = this.productCollection.valueChanges().subscribe((data) => {
      this.productsSubject.next(data);
    });

    //Init shoplists
    this.shopListCollection = this.afs.collection('shoplists');
    this.shopListCollection.valueChanges().subscribe((data) => {

      if (data) {
        this.shopListSubject.next(data);
        data.forEach(shopList => {
          if (shopList.active) {
            this.singleShopListSubject.next(shopList);
          }
        });

      }
    })
  }

  getActiveShoplist(): Observable<Shoplist> {
    return this.singleShopList$;
  }

  getAllProducts(): Observable<Product[]> {
    return this.products$;
  }

  getAllShopLists(): Observable<Shoplist[]> {
    return this.shopLists$;
  }

  // findProducts(start, end) : Observable<Product[]> {

  // }

  calculateTotalPrice(price: string, methodStatus: string) {
    if (methodStatus == "add") {
      let shopListObj = this.singleShopListSubject.getValue();

      //Change strings to numbers
      let totalPriceNumber = Number(shopListObj.totalPrice);
      let priceNumber = Number(price);
      //Regner
      let newTotalPriceNumber = totalPriceNumber + priceNumber;
      let newTotalPriceString = newTotalPriceNumber.toFixed(2);
      shopListObj.totalPrice = newTotalPriceString;
      this.singleShopListSubject.next(shopListObj);
    }
    if (methodStatus == "remove") {
      let shopListObj = this.singleShopListSubject.getValue();

      //Change strings to numbers
      let totalPriceNumber = Number(shopListObj.totalPrice);
      let priceNumber = Number(price);
      //Regner
      let newTotalPriceNumber = totalPriceNumber - priceNumber;
      let newTotalPriceString = newTotalPriceNumber.toFixed(2);
      shopListObj.totalPrice = newTotalPriceString;
      this.singleShopListSubject.next(shopListObj);
    }
  }

  addProduct(product: Product, shopList: Shoplist) {
    if (product !== undefined && shopList !== undefined) {
      let shopListTotalPrice = shopList.totalPrice;
      shopList.products.push(product);
      //Calculate price
      this.calculateTotalPrice(product.price, "add");
      let shopListId = this.singleShopListSubject.getValue().id;
      let shopListssss = this.afs.collection('shoplists').doc(shopListId);
      shopListssss.update({
        products: shopList.products,
        totalPrice: this.singleShopListSubject.getValue().totalPrice
      })
        .then((data) => {
          console.log(data);
          console.log(shopList);
        });
    }
  }

  removeProduct(product: Product, shopList: Shoplist) {
    if (product !== undefined && shopList !== undefined) {
      let shopListTotalPrice = shopList.totalPrice;
      // //Find the index
      const index: number = shopList.products.indexOf(product)
      shopList.products.splice(index, 1);
      //Calculate price
      this.calculateTotalPrice(product.price, "remove");
      let shopListId = this.singleShopListSubject.getValue().id;
      let shopListssss = this.afs.collection('shoplists').doc(shopListId);
      shopListssss.update({
        products: shopList.products,
        totalPrice: this.singleShopListSubject.getValue().totalPrice
      })
        .then((data) => {
          console.log(data);
          console.log(shopList);
        });
    }
  }

  createNewShopList() {
    let autoId = this.afs.createId();
    let dateNow = moment(Date.now()).format('DD-MM-YYYY');

    let newShopList: Shoplist = {
      id: autoId,
      date: dateNow,
      products: [],
      totalPrice: "0",
      active: true
    }

    this.afs.collection('shoplists').doc(autoId).set(newShopList)
      .then(() => {
        //console.log("shopliste er gemt");
      })
      .catch((error) => {
        //console.log("FEJL: ", error);
      });

  }

}
