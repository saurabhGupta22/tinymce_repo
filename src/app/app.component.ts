import { Component } from '@angular/core';
import { TinymceService } from './services/tinymce.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tinymce-customPlugin';
  constructor(private tinymceService: TinymceService){}
  ngOnInit(){
    this.tinymceService.doIt();
  }
}
