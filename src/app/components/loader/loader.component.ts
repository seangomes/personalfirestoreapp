import { Component, OnInit } from '@angular/core';
import { LoaderService } from "../../providers/loader/loader.service";
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  private loader: boolean;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.getLoader().subscribe((loader:any) => {
      this.loader = loader;
    });
  }

}
