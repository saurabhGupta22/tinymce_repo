import { Component } from '@angular/core';
import { TinymceService } from './service/tinymce.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tinymcev4try';
  constructor(private tinymceService:TinymceService){}
  ngOnInit(){
    this.tinymceService.doIt();
  }
}
