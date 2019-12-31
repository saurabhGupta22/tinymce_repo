import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignComponent } from './design.component';
import { DesignRoutingModule } from './design-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SharedDesignModule } from '../shared/shared-design.module';
import { NgxSharedModule, TranslateModule } from '@mhe/ngx-shared';
import { TinymceComponent } from '../../shared/component/tinymce/tinymce.component';

@NgModule({
  declarations: [DesignComponent, TinymceComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedDesignModule,
    NgxSharedModule,
    TranslateModule.forRoot(),
    DesignRoutingModule
  ],
  providers: [],
})
export class DesignModule { }
