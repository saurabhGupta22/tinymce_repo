import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
import { SharedService } from '../../providers/shared/shared.service';
import { InternalStateService } from '../../providers/internal-state/internal-state.service';
import { toolTypes } from '../../../data/tool';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  questionLoaded = false;
  questionNumber = 0;
  questionId: any;
  toolType = '';
  designMode = false;
  toolLoad = false;
  toolTypes = toolTypes;
  toolSelect;
  isShowDecisionMap = false;
  @ViewChild('child')
  questionComponent: QuestionComponent;
  constructor(
    private sharedService: SharedService,
    private internalStateService: InternalStateService
  ) {}

  ngOnInit() {
    const state = this.internalStateService.getInternalState();
    const mode = window['EZ']['mode'];
    if (mode === 'design') {
      this.designMode = true;
      if (!Object.keys(state.questions).length) {
        this.questionLoaded = false;
      } else {
        this.questionLoaded = true;
      }
    }
  }

  loadTool(toolType) {
    this.toolType = toolType; // Keeping tooltype as FBD as of now.
    this.sharedService.setQuestionNo();
    this.questionId = 'question_' + this.sharedService.getQuestionNo();
    this.questionComponent.loadQuestion(this.questionId, this.toolType);
    this.questionLoaded = true;
  }
  showQuestionBtn(event) {
    this.questionLoaded = true;
  }

  toolOption(ev) {
    this.toolSelect = ev;
    this.toolLoad = true;
  }
  showDecisionMap() {
    this.isShowDecisionMap = !this.isShowDecisionMap;
  }
}
