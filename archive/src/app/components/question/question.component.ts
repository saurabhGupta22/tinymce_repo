import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnChanges
} from '@angular/core';
import { urlConfig } from '../../../data/config-url';
import { InternalStateService } from '../../providers/internal-state/internal-state.service';
import { IframeWraperComponent } from '../iframe-wraper/iframe-wraper.component';
import { SharedService } from '../../providers/shared/shared.service';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnDestroy {
  @Input()
  questionId;
  questionLoaded = false;
  urlConfig = urlConfig;
  @ViewChild('iframe', { read: ViewContainerRef })
  container: ViewContainerRef;
  expComponent;
  @Output()
  questionLoadedFromState: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private internalStateService: InternalStateService,
    private renderer: Renderer2,
    private _cfr: ComponentFactoryResolver,
    private el: ElementRef,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    const toolState = this.internalStateService.getInternalState().questions;
    if (toolState) {
      this.toolQuestionfromState();
    }
  }

  loadQuestion(
    questionId,
    toolType,
    definition?,
    key?,
    alternateAns?,
    response?
  ) {
    const questionState = definition ? definition : '';
    const questionKey = key ? key : '';
    const responseState = response ? response : '';
    const comp = this._cfr.resolveComponentFactory(IframeWraperComponent);
    this.expComponent = this.container.createComponent(comp);
    this.expComponent.instance._ref = this.expComponent;
    this.expComponent.instance.questionData = {
      src: this.urlConfig[toolType],
      questionId: questionId,
      questionDef: questionState,
      key: questionKey,
      response: responseState,
      toolType: toolType,
      alternateAns: alternateAns
    };
    this.questionLoaded = true;
  }

  toolQuestionfromState() {
    const mode = window['EZ']['mode'];
    const toolState = this.internalStateService.getInternalState().questions;
    switch (mode) {
      case 'design':
        this.loadToolInDesignMode(toolState);
        break;
      case 'test':
        this.loadToolInTestMode(toolState[1]);
        break;
      default:
        break;
    }
  }
  loadToolInDesignMode(toolState) {
    for (const key in toolState) {
      if (toolState.hasOwnProperty(key)) {
        const element = toolState[key];
        this.sharedService.setQuestionNo();
        const questionId = 'question_' + this.sharedService.getQuestionNo();
        this.loadQuestion(
          questionId,
          element['toolType'],
          element['definition'],
          element['key'],
          element['alternateAns']
        );
      } else {
      }
    }
  }
  loadToolInTestMode(toolState) {
    this.sharedService.setQuestionNo();
    const questionId = 'question_' + this.sharedService.getQuestionNo();
    this.loadQuestion(
      questionId,
      toolState.toolType,
      toolState.definition,
      '',
      toolState.response
    );
  }
  ngOnDestroy() {
    if (this.expComponent) {
      this.expComponent.destroy();
    }
  }
}
