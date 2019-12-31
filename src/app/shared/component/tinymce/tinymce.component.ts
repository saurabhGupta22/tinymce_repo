import { Component, OnInit} from '@angular/core';
import { TinymceService } from '../../services/tinymce/tinymce.service';

declare var tinymce: any;
@Component({
  selector: 'app-tinymce',
  templateUrl: './tinymce.component.html',
  styleUrls: ['./tinymce.component.scss']
})
export class TinymceComponent implements OnInit{

  title = 'Tinymce Editor';
  text: string;
  constructor(private tinyService: TinymceService) {  }
  /*
  calling get function from tinymce.service
  */
  ngOnInit() {
    this.tinyService.get();
  }

}
