import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule  } from '@angular/forms';
import { TinymceService } from './shared/services/tinymce/tinymce.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  exports: [
    FormsModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [TinymceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
