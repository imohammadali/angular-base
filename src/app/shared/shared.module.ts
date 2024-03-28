import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PrimeNgModule} from "@shared/primeng.module";
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "@shared/components/components.module";
import {NgApexchartsModule} from "ng-apexcharts";
import {DialogService} from "@shared/services/dialog.service";
import {LoadingDirective} from "@shared/directives/loading.directive";
import {MinMaxDirective} from "@shared/directives/min-max.directive";
import {PermissionModule} from "@core/permission/permission.module";
import {TourDirective} from "@shared/directives/tour.directive";
import {SummeryPipe} from "@shared/pipes/summery.pipe";
import {LoadMoreDirective} from "@shared/directives/load-more.directive";

const imports = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    PrimeNgModule,
    NgApexchartsModule,
    ComponentsModule,
    TranslateModule,
    PermissionModule,
];

@NgModule({
    imports: [...imports],
    exports: [...imports, LoadingDirective, MinMaxDirective, TourDirective, SummeryPipe, LoadMoreDirective],
    providers: [DialogService],
    declarations: [LoadingDirective, MinMaxDirective, TourDirective, SummeryPipe, LoadMoreDirective],
})
export class SharedModule {}
