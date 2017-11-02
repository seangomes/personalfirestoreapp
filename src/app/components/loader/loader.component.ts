import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from "../../providers/loader/loader.service";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {


  private loaderSubscription : ISubscription;

  private loader: boolean;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.getLoader().subscribe((loader:any) => {
      this.loader = loader;
    });
  }

  ngOnDestroy(): void {
    if(this.loaderSubscription !== undefined) {
      this.loaderSubscription.unsubscribe();
    }
  }

}
