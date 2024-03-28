import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from "@core/core.module";
import {SharedModule} from "@shared/shared.module";
import { NotFindTemplateComponent } from './_theme/not-find-template/not-find-template.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFindTemplateComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    // core
    CoreModule,
    SharedModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
