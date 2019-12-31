import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {

  tabIndex = 0;

  constructor() { }

  ngOnInit() {
  } 

  tabClick(newIndex) {
    this.tabIndex = newIndex;
  }

}
