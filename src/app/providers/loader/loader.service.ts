import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

@Injectable()
export class LoaderService {

  private loaderSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private keepAfterRouteChange: boolean = false;

  constructor(private router: Router) {

    // clear loader on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        }
        else {
          // set loader false
          this.clear();
        }
      }
    });
  }

  getLoader(): Observable<any> {
    return this.loaderSubject.asObservable();
  }

  showLoader(keepAfterRouteChange: boolean = false) {
    this.loader(true, keepAfterRouteChange);
  }

  hideLoader(keepAfterRouteChange: boolean = false) {
    this.loader(false, keepAfterRouteChange);
  }

  clear() {
    // clear alerts
    this.loaderSubject.next(false);
  }

  loader(state: boolean, keepAfterRouteChange: boolean = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.loaderSubject.next(state);
  }

}
