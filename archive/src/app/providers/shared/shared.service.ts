import { Injectable } from '@angular/core';

@Injectable()

export class SharedService {
  questionNo = 0;
  constructor() { }

  getQuestionNo() {
    return this.questionNo;
  }

  setQuestionNo() {
   this.questionNo += 1;
  }

}
