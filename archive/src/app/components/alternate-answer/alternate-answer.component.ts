import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  Renderer2
} from '@angular/core';
import { urlConfig } from '../../../data/config-url';
import { InternalStateService } from '../../providers/internal-state/internal-state.service';


@Component({
  selector: 'app-alternate-answer',
  templateUrl: './alternate-answer.component.html',
  styleUrls: ['./alternate-answer.component.css']
})
export class AlternateAnswerComponent implements OnInit {
  urlConfig = urlConfig;
  questionNo;
  altAnsNo;
  @Output()
  _ref: any;
  @Input()
  alternateAnsData;
  altAnsInstance;
  constructor(
    private el: ElementRef,
    private internalStateService: InternalStateService
  ) {
    setTimeout(() => {
      this.LoadAltnateAnswer();
    }, 1);
  }

  ngOnInit() {
    this.questionNo = parseInt(this.alternateAnsData.toolInstance.split('_')[1], 10);
    this.altAnsNo = this.alternateAnsData.altAnsNo;
  }

  saveAltAns() {
    const state = this.internalStateService.getInternalToolState(
      parseInt(this.alternateAnsData.toolInstance.split('_')[1], 10) - 1,
      this.altAnsInstance,
      this.alternateAnsData.toolType,
      this.alternateAnsData.altAnsNo
    );
  }

  LoadAltnateAnswer() {
    const toolUrl = this.urlConfig[this.alternateAnsData.toolType];
    this.altAnsInstance =
      this.alternateAnsData.toolInstance +
      'altAns_' +
      this.alternateAnsData.altAnsNo;
    window['doit_v3'](
      this.altAnsInstance,
      this.alternateAnsData.toolStateDefinition,
      this.alternateAnsData.toolStateKey
    );
    this.altAnsInstance = window['thisITEMid'] + '_' + this.altAnsInstance;
    let iFrameHTML =
      '<iframe class="wk_ex_iframe" style="z-index: 1" allow="microphone *; camera *" ';
    iFrameHTML +=
      'name="' +
      this.altAnsInstance +
      '" id="' +
      this.altAnsInstance +
      '" frameborder="1" ';
    iFrameHTML += 'src="' + toolUrl + '?' + this.altAnsInstance + '" ';
    iFrameHTML += 'width="' + 600 + '" ';
    iFrameHTML += 'height="' + 600 + '">';
    iFrameHTML += '</iframe>';
    const parent = this.el.nativeElement.querySelectorAll(
      '.alt_ans_container'
    )[0];
    const g = document.createElement('div');
    g.innerHTML = iFrameHTML;
    parent.appendChild(g);
  }
}
