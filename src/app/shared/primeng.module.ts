import { MultiSelectModule } from 'primeng/multiselect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ToastModule} from 'primeng/toast';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {SpeedDialModule} from 'primeng/speeddial';
import { SharedModule, Header, Footer } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { FocusTrapModule } from 'primeng/focustrap';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { ConfirmationService } from 'primeng/api';
import {DividerModule} from "primeng/divider";
import {BadgeModule} from "primeng/badge";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputNumberModule} from "primeng/inputnumber";
import {PasswordModule} from "primeng/password";
import {ToolbarModule} from "primeng/toolbar";
import {AvatarModule} from "primeng/avatar";
import {CardModule} from "primeng/card";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DynamicDialogModule} from "primeng/dynamicdialog";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import {AnimateModule} from "primeng/animate";
import {AutoFocusModule} from "primeng/autofocus";
import {TooltipModule} from "primeng/tooltip";
import {EditorModule} from "primeng/editor";
import {FileUploadModule} from "primeng/fileupload";
import {PrimeCalendarModule} from "@shared/components/prime-calendar/prime-calendar";
import {TagModule} from "primeng/tag";
import {FieldsetModule} from "primeng/fieldset";
import {ChipsModule} from "primeng/chips";
import {SkeletonModule} from "primeng/skeleton";
import {TreeSelectModule} from "primeng/treeselect";
import {KeyFilterModule} from "primeng/keyfilter";
import {KnobModule} from "primeng/knob";
import {DataViewModule} from "primeng/dataview";
import {ChipModule} from "primeng/chip";
import {DragDropModule} from "primeng/dragdrop";
import {ImageModule} from "primeng/image";
// ===========================================================================


const imports = [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    TableModule,
    OverlayPanelModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    TabViewModule,
    SelectButtonModule,
    DialogModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    SpeedDialModule,
    PanelModule,
    PaginatorModule,
    ProgressBarModule,
    AutoCompleteModule,
    MultiSelectModule,
    ListboxModule,
    ButtonModule,
    AutoCompleteModule,
    DividerModule,
    DropdownModule,
    BadgeModule,
    RippleModule,
    CheckboxModule,
    RadioButtonModule,
    InputSwitchModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    PasswordModule,
    ToolbarModule,
    AvatarModule,
    OverlayPanelModule,
    CardModule,
    TabViewModule,
    ToastModule,
    DialogModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    BreadcrumbModule,
    PaginatorModule,
    MessageModule,
    AngularSvgIconModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    TriStateCheckboxModule,
    AnimateModule,
    AutoFocusModule,
    TooltipModule,
    EditorModule,
    FileUploadModule,
    AccordionModule,
    PrimeCalendarModule,
    TagModule,
    TreeModule,
    FieldsetModule,
    ChipsModule,
    SkeletonModule,
    PanelModule,
    TreeSelectModule,
    KeyFilterModule,
    KnobModule,
    DataViewModule,
    ChipModule,
    DragDropModule,
    ImageModule
];

@NgModule({
    imports: [...imports],
    exports: [...imports],
    declarations: [],
})
export class PrimeNgModule {}
