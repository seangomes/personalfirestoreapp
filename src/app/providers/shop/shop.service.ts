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
  private productsSubscription : ISubscription;
  private shopListCollection: AngularFirestoreCollection<Shoplist>;
  private shopListSubject: BehaviorSubject<Shoplist[]> = new BehaviorSubject<Shoplist[]>(null);
  private userObjectSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private totalPriceCalcSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private singleShopListSubject : BehaviorSubject<Shoplist> = new BehaviorSubject<Shoplist>(null);


  public products$: Observable<Product[]> = this.productsSubject.asObservable();
  public shopLists$: Observable<Shoplist[]> = this.shopListSubject.asObservable();
  public userObject$: Observable<User> = this.userObjectSubject.asObservable();
  public totalPriceCalc$: Observable<string> = this.totalPriceCalcSubject.asObservable();
  public singleShopList$: Observable<Shoplist> = this.singleShopListSubject.asObservable();


  constructor(private afs: AngularFirestore) {

    //Init all products
    this.productCollection = this.afs.collection('products');
    this.productsSubscription = this.productCollection.valueChanges().subscribe((data) => {
      this.productsSubject.next(data);
    });

    //Init shoplists
    this.shopListCollection = this.afs.collection('shoplists');
    this.shopListCollection.valueChanges().subscribe((data) => {

      if(data) {
        this.shopListSubject.next(data);
        data.forEach(shopList => {
          if(shopList.active) {
            this.singleShopListSubject.next(shopList);
          }
        });

      }
    })
  }

  getActiveShoplist() : Observable<Shoplist> {
    return this.singleShopList$;
  }

  getAllProducts(): Observable<Product[]> {
    return this.products$;
  }

  getAllShopLists() : Observable<Shoplist[]> {
    return this.shopLists$;
  }


  addProduct(product: Product) {
    if(product) {



    }
  }

  createNewShopList() {
    let autoId = this.afs.createId();
    let dateNow = moment(Date.now()).format('DD-MM-YYYY');

    let newShopList : Shoplist = {
      id: autoId,
      date: dateNow,
      products: [],
      totalPrice: "0",
      active: true
    }

    this.afs.collection('shoplists').doc(autoId).set(newShopList)
      .then(() => {
        console.log("shopliste er gemt");
      })
      .catch((error) => {
        console.log("FEJL: ", error);
      });

  }


  // createShopList(products: Product[]) {

  //   let totalPricesNumber = 0;

  //   products.forEach(product => {
  //     let price = Number(product.price)
  //     totalPricesNumber + price;
  //   });

  //   let totalPriceCalculated = String(totalPricesNumber);

  //   let newShopList : Shoplist = {
  //     createdBy:"Sean Test",
  //     id:"11111",
  //     products: products,
  //     totalPrice: totalPriceCalculated
  //   }

  //   console.log(newShopList);
  // }



}
