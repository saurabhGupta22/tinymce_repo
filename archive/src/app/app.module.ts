import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ElementRef, Renderer2 } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PROVIDERS } from './providers';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { QuestionComponent } from './components/question/question.component';
import { AlternateAnswerComponent } from './components/alternate-answer/alternate-answer.component';
import { IframeWraperComponent } from './components/iframe-wraper/iframe-wraper.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionComponent,
    AlternateAnswerComponent,
    IframeWraperComponent
  ],
  imports: [BrowserModule, Ng4LoadingSpinnerModule.forRoot()],
  providers: [...PROVIDERS],
  entryComponents: [IframeWraperComponent, AlternateAnswerComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
