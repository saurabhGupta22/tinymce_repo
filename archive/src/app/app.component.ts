import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { InternalStateService } from '../app/providers/internal-state/internal-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'engineering-tool';
  load = false;
  constructor(public internalStateService: InternalStateService) {
    window['ETInstance'] = this;
  }

  ngOnInit() {
    this.setState();
    this.load = true;
  }

  getState() {
    const state = this.internalStateService.getInternalState();
    return JSON.stringify(state);
  }
  setState() {
    const state = window['EZ']['state'].trim();
    const parsedState = state ? JSON.parse(state) : '';
    if (parsedState !== 0) {
      this.internalStateService.setInternalState(parsedState);
    }
  }
  getDefinition() {
    const state = this.internalStateService.getInternalState();
    return 'definition';
  }

  getKey() {
    return 'key';
  }
  getScore() {
    return 100;
  }
}
