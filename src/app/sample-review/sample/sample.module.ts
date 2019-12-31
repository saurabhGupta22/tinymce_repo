import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleComponent } from './sample.component';
import { SampleRoutingModule } from './sample-routing.module'

@NgModule({
  declarations: [SampleComponent],
  imports: [
    CommonModule,
    SampleRoutingModule
  ]
})
export class SampleModule { }
