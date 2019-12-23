import { Component } from '@angular/core';
import { TinymceSService } from './services/tinymce-s.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tinymce-demo';

  constructor(private tinyService:TinymceSService){}

  ngOnInit(){
    this.tinyService.doIt();
  }
  

}
