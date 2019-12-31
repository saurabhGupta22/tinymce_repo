import { Injectable } from '@angular/core';
import { InternalStateService } from '../internal-state/internal-state.service';

@Injectable()
export class DecisionMappingLogic {
  constructor(private internalStateService: InternalStateService) {}

  evaluateStudentResponse(questionFrameNo, toolInstance, toolType) {
    const state = this.internalStateService.getInternalState();
    const question = state['questions'][questionFrameNo + 1];
    const scoreObj = {};
    const questionDef = question.definition;
    const studentResponse = question.response;
    let score = window.frames[toolInstance].frames.getResults(
      questionDef,
      studentResponse,
      question.key
    ).score;
    let temp = questionFrameNo + 1 + '_0';
    scoreObj[temp] = score;
    for (const ansKey in question.alternateAns) {
      if (question.alternateAns.hasOwnProperty(ansKey)) {
        const correctAns = question.alternateAns[ansKey].key;
        score = window.frames[toolInstance].frames.getResults(
          questionDef,
          studentResponse,
          correctAns
        ).score;
        temp = questionFrameNo + 1 + '_' + ansKey;
        scoreObj[temp] = score;
        console.log('scoring done');
      }
    }
    return this.identifyNextQuestion(scoreObj, questionFrameNo + 1);
  }
  identifyNextQuestion(scoreObj, quesNo) {
    let bestMatch = '';
    for (const key in scoreObj) {
      if (scoreObj.hasOwnProperty(key)) {
        if (bestMatch === '') {
          if (scoreObj[key] === 100) {
            bestMatch = key;
          }
        } else {
          const element = scoreObj[key];
          const bestMatchValue = scoreObj[bestMatch];
          if (element > bestMatchValue && element === 100) {
            bestMatch = key;
          }
        }
      }
    }
    console.log(bestMatch);
    if (bestMatch === '') {
      return null;
    } else {
      const decisionMapObj = this.internalStateService.getInternalState()['decisionMap']['node'];
      return decisionMapObj[quesNo][bestMatch];
    }

  }
}
