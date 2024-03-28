import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { TableModule as TablePrimeng } from 'primeng/table';
import { StoreModule } from '@ngrx/store';
import { TABLE_FUTURE_KEY } from '@core/table/+state/table.entity';
import { tableReducers } from '@core/table/+state/table.reducers';
import { SharedModule } from '@shared/shared.module';
import { TablePipe } from '@core/table/table.pipe';
import { ColumnRendererComponent } from './column-renderer/column-renderer.component';
import { DateRenderer } from './column-renderer/renderers/date-renderer/date-renderer';
import {ActionButton} from "@core/table/column-renderer/renderers/action-button/action-button";
import {BooleanRenderer} from "@core/table/column-renderer/renderers/boolean-renderer/boolean-renderer";
import {ToggleRenderer} from "@core/table/column-renderer/renderers/toggle-renderer/toggle";
import {IconRendererComponent} from './column-renderer/renderers/icon-renderer/icon-renderer.component';
import {TagRendererComponent} from "@core/table/column-renderer/renderers/tag-renderer/tag-renderer.component";
import {ButtonRenderer} from "@core/table/column-renderer/renderers/button-renderer/button-renderer";
import {TextColorRenderer} from "@core/table/column-renderer/renderers/text-color-renderer/text-color-renderer";
import {LinkRenderer} from "@core/table/column-renderer/renderers/link-renderer/link-renderer";

@NgModule({
  declarations: [
    TableComponent,
    TablePipe,
    ColumnRendererComponent,
    DateRenderer,
    BooleanRenderer,
    ToggleRenderer,
    ActionButton,
    IconRendererComponent,
    TagRendererComponent,
    ButtonRenderer,
    TextColorRenderer,
    LinkRenderer
  ],
  exports: [
    TableComponent,
    TablePipe
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(TABLE_FUTURE_KEY, tableReducers),
    TablePrimeng,
    SharedModule
  ]
})
export class TableModule { }
