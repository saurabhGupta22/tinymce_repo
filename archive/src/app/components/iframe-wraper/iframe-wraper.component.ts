import {
  Component,
  OnInit,
  Output,
  ElementRef,
  AfterViewInit,
  OnChanges,
  ViewChild,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef
} from '@angular/core';
import { urlConfig } from '../../../data/config-url';
import { InternalStateService } from '../../providers/internal-state/internal-state.service';
import { AlternateAnswerComponent } from '../alternate-answer/alternate-answer.component';
import { SharedService } from '../../providers/shared/shared.service';
import { DecisionMappingLogic } from '../../providers/decision-tree/decision-mapping-logic';
import { toolTypes } from '../../../data/tool';

@Component({
  selector: 'app-iframe-wraper',
  templateUrl: './iframe-wraper.component.html',
  styleUrls: ['./iframe-wraper.component.css']
})
export class IframeWraperComponent {
  urlConfig = urlConfig;
  @ViewChild('altAns', { read: ViewContainerRef })
  container: ViewContainerRef;
  expComponent;
  toolInstance = '';
  altAnsNo = 0;
  questionNo = 0;
  showAlterButton = false;
  saveBtnText = '';
  quesNoIndex;
  availablePath = [];
  @Output()
  _ref: any;
  @Input()
  questionData;
  mode = '';
  toolTypes = toolTypes;
  toolSelect;
  toolLoad = false;
  designMode = false;
  constructor(
    private el: ElementRef,
    private internalStateService: InternalStateService,
    private _cfr: ComponentFactoryResolver,
    private sharedService: SharedService,
    private decisionMappingLogic: DecisionMappingLogic
  ) {
    setTimeout(() => {
      this.mode = window['EZ'].mode;
      switch (this.mode) {
        case 'design': {
          this.saveBtnText = 'Save Part';
          break;
        }
        case 'test': {
          this.saveBtnText = 'Save Answer';
          break;
        }
      }
      this.loadFrame();
    }, 1);
  }

  loadFrame() {
    switch (this.mode) {
      case 'design':
        this.loadFrameInDesignMode();
        this.findAvailablePath();
        break;
      case 'test':
        this.loadFrameInTestMode();
        break;
      default:
        break;
    }
  }

  findAvailablePath() {
    this.quesNoIndex = parseInt(this.questionData.questionId.split('_')[1], 10);
    this.internalStateService.createDecisionMap();
    const questionMap = this.internalStateService.decisionMap;
    if (questionMap && this.quesNoIndex !== 1) {
      for (const key in questionMap['node']) {
        if (questionMap['node'].hasOwnProperty(key)) {
          const element = questionMap['node'][key];
          if (parseInt(key, 10) < this.quesNoIndex) {
            for (const altAns in element) {
              if (element.hasOwnProperty(altAns) && element[altAns] === null) {
                this.availablePath.push(altAns);
              }
            }
          }
        }
      }
    }
  }

  loadFrameInDesignMode() {
    if (this.questionData.alternateAns !== undefined) {
      let index = 0;
      this.appendFrame(index);
      this.showAlterButton = true;
      for (const key in this.questionData.alternateAns) {
        if (this.questionData.alternateAns.hasOwnProperty(key)) {
          const element = this.questionData.alternateAns[key];
          index += 1;
          this.loadAlternateAnswer(
            this.questionData.alternateAns[key].toolType,
            index
          );
        }
      }
    } else {
      this.appendFrame();
    }
  }

  loadFrameInTestMode() {
    this.appendFrame();
  }

  saveInternalQuestion() {
    this.internalStateService.getInternalToolState(
      parseInt(this.questionData.questionId.split('_')[1], 10) - 1,
      this.toolInstance,
      this.questionData.toolType
    );
    this.showAlterButton = true;
    if (this.mode === 'test') {
      const nextQuestion = this.decisionMappingLogic.evaluateStudentResponse(
        parseInt(this.questionData.questionId.split('_')[1], 10) - 1,
        this.toolInstance,
        this.questionData.toolType
      );
      console.log('this is test mode' + nextQuestion);
      if (nextQuestion === null) {
        alert('response is not as expected so end of flow');
      } else {
        this.loadNextQuestion(nextQuestion);
      }
      // this.appendFrame(nextQuestion);
    }
  }

  loadAlternateAnswer(toolType, index) {
    toolType = toolType ? toolType : this.questionData.toolType;
    let toolStateDefinition;
    let toolStateKey;
    if (index) {
      index = index;
      toolStateDefinition = this.questionData['alternateAns'][index][
        'definition'
      ];
      toolStateKey = this.questionData['alternateAns'][index]['key'];
    } else {
      index = 0;
      toolStateDefinition = this.internalStateService.getInternalState()[
        'questions'
      ][this.questionData.questionId.split('_')[1]]['definition'];
      toolStateKey = this.internalStateService.getInternalState()['questions'][
        this.questionData.questionId.split('_')[1]
      ]['key'];
    }
    this.altAnsNo += 1;
    const comp = this._cfr.resolveComponentFactory(AlternateAnswerComponent);
    this.expComponent = this.container.createComponent(comp);
    this.expComponent.instance._ref = this.expComponent;
    this.expComponent.instance.alternateAnsData = {
      src: this.urlConfig[toolType],
      toolStateDefinition: toolStateDefinition,
      toolStateKey: toolStateKey,
      toolInstance: this.questionData.questionId,
      toolType: toolType,
      altAnsNo: this.altAnsNo
    };
  }

  appendFrame(identifier?) {
    const toolUrl = this.urlConfig[this.questionData.toolType];
    this.toolInstance =
      window['thisITEMid'] + '_' + this.questionData.questionId;
    if (this.mode === 'design') {
      const index = identifier ? identifier : 0;
      if (this.questionData.questionDef && this.questionData.key) {
        window['doit_v3'](
          this.questionData.questionId,
          this.questionData.questionDef,
          this.questionData.key
        );
      } else {
        window['doit_v3'](this.questionData.questionId);
      }
    } else if (this.mode === 'test') {
      window['doit_v3'](
        this.questionData.questionId,
        this.questionData.questionDef,
        '',
        this.questionData.response
      );
    } else {
      console.log('some other mode');
    }
    let iFrameHTML =
      '<iframe class="wk_ex_iframe" style="z-index: 1" allow="microphone *; camera *" ';
    iFrameHTML +=
      'name="' +
      this.toolInstance +
      '" id="' +
      this.toolInstance +
      '" frameborder="1" ';
    iFrameHTML += 'src="' + toolUrl + '?' + this.toolInstance + '" ';
    iFrameHTML += 'width="' + 600 + '" ';
    iFrameHTML += 'height="' + 600 + '">';
    iFrameHTML += '</iframe>';
    const parent = this.el.nativeElement.querySelectorAll(
      '.iframeContainer'
    )[0];
    const g = document.createElement('div');
    g.innerHTML = iFrameHTML;
    parent.appendChild(g);
  }

  loadNextQuestion(nextQuestion) {
    const state = this.internalStateService.getInternalState()['questions'][nextQuestion];
    const toolUrl = this.urlConfig[state['toolType']];
    this.toolInstance = window['thisITEMid'] + '_' + nextQuestion;
     window['doit_v3'](nextQuestion, state['definition'], '', state['response']);
         let iFrameHTML = '<iframe class="wk_ex_iframe" style="z-index: 1" allow="microphone *; camera *" ';
         iFrameHTML += 'name="' + this.toolInstance + '" id="' + this.toolInstance + '" frameborder="1" ';
         iFrameHTML += 'src="' + toolUrl + '?' + this.toolInstance + '" ';
         iFrameHTML += 'width="' + 600 + '" ';
         iFrameHTML += 'height="' + 600 + '">';
         iFrameHTML += '</iframe>';
         const parent = this.el.nativeElement.querySelectorAll('.iframeContainer')[0];
         const g = document.createElement('div');
         g.innerHTML = iFrameHTML;
         parent.appendChild(g);
  }

  toolOption(ev) {
    this.toolSelect = ev;
    this.toolLoad = true;
  }
  pathSelected(event) {
    const selectedPathQuestionNo = event.target.value.split('_')[0];
    if (event.target.checked) {
      this.internalStateService.decisionMap['node'][selectedPathQuestionNo][
        event.target.value
      ] = this.quesNoIndex;
    } else {
      this.internalStateService.decisionMap['node'][selectedPathQuestionNo][
        event.target.value
      ] = null;
    }
    console.log('path selected');
  }
}
