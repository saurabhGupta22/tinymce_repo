import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class InternalStateService {
  constructor() {}
  internalState = {
    questions: {}
  };
  public decisionMap = {
    node: {}
  };

  getInternalToolState(questionFrameNo, toolInstance, toolType?, altAnsId?) {
    const ansKey = window.frames[toolInstance].frames.getKey();
    const questionState = window.frames[toolInstance].frames.getDefinition();
    const response = window.frames[toolInstance].frames.getResponse();
    const questionNo = questionFrameNo + 1;
    this.createInternalState(
      questionNo,
      ansKey,
      questionState,
      response,
      toolType,
      altAnsId
    );
    if (window['EZ']['mode'] === 'design') {
     // this.createDecisionMap();
    }
  }

  getInternalState() {
    if (window['EZ']['mode'] === 'design') {
      this.internalState['decisionMap'] = this.decisionMap;
    }
    return this.internalState;
  }
  setInternalState(state) {
    if (state !== 0) {
      this.internalState = state;
    }
  }
  createInternalState(
    questionId,
    ansKey,
    questionState,
    response,
    toolType?,
    altAnsId?
  ) {
    const altAnsIndex = altAnsId ? altAnsId : 0;
    if (window['EZ']['mode'] === 'test') {
      if (this.internalState['questions'] && this.internalState['questions'][questionId]
      ) {
        this.internalState['questions'][questionId]['response'] = response;
      }
    } else if (window['EZ']['mode'] === 'design') {
      if (
        this.internalState['questions'] &&
        this.internalState['questions'][questionId] &&
        this.internalState['questions'][questionId]['alternateAns'] &&
        altAnsIndex > 0
      ) {
        const alternateQuesData = {
          toolType: toolType,
          definition: questionState,
          key: ansKey
        };
        this.internalState['questions'][questionId]['alternateAns'][
          altAnsIndex
        ] = alternateQuesData;
      } else {
        const internalToolData = {
          toolType: toolType,
          definition: questionState,
          key: ansKey,
          response: response,
          alternateAns: {}
        };
        this.internalState['questions'][questionId] = internalToolData;
      }
    }
  }
  createDecisionMap() {
    for (const ques in this.internalState.questions) {
      if (this.internalState.questions.hasOwnProperty(ques)) {
        let temp = '';
        if (!this.decisionMap['node'][ques]) {
          const questionMap = {};
          temp = ques + '_' + '0';
          questionMap[temp] = null;
          this.decisionMap['node'][ques] = questionMap;
        }
          for (const altAns in this.internalState.questions[ques].alternateAns) {
            if (this.internalState.questions[ques].alternateAns.hasOwnProperty(altAns)) {
              const altAnsMap = {};
              temp = ques + '_' + altAns;
              if (!this.decisionMap['node'][ques][temp]) {
                this.decisionMap['node'][ques][temp] = null;
              }
            }
          }
      }

    }
  }
}
