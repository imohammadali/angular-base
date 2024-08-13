import { NgModule , ChangeDetectionStrategy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBoxComponent } from './list-box/list-box.component';
import {TranslateModule} from "@ngx-translate/core";
import {BadgeModule} from "primeng/badge";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "@shared/shared.module";



@NgModule({
  declarations: [
    ListBoxComponent,
  ],
    imports: [
        CommonModule,
        TranslateModule,
        BadgeModule,
        ButtonModule,
        RippleModule
    ],
  exports: [
    ListBoxComponent,
  ]
})
export class ComponentsModule { }
