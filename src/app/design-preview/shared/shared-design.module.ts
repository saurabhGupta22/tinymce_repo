import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightPanelComponent} from './component/right-panel/right-panel.component';
import { NgxSharedModule, TranslateModule } from '@mhe/ngx-shared';

@NgModule({
  declarations: [RightPanelComponent],
  imports: [
    CommonModule,
    NgxSharedModule,
    TranslateModule.forRoot(),
  ],
  exports :[
    RightPanelComponent
  ]
})
export class SharedDesignModule { }
