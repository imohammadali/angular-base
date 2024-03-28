import {  Component, ElementRef, Injectable, OnInit, ViewChild , ChangeDetectionStrategy} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Confirmation } from 'primeng/api/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { DialogService as service } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private _confirmationService: ConfirmationService,
    private _dialogService: service,
    private _translateService: TranslateService
  ) {
  }

  confirm(confirmation: Confirmation) {
    this._confirmationService.confirm({
      ...confirmation,
      message: confirmation?.message ? this._translateService.instant(confirmation.message||'') : '',
      header: confirmation?.header ? this._translateService.instant(confirmation.header||'') : '',
      acceptLabel: (confirmation?.acceptVisible===false) ?  '' : this._translateService.instant(confirmation.acceptLabel),
      rejectLabel: (confirmation?.rejectVisible===false) ? '' : this._translateService.instant(confirmation.rejectLabel),
      acceptButtonStyleClass: confirmation?.acceptButtonStyleClass ? confirmation.acceptButtonStyleClass : 'btn btn-warning',
      rejectButtonStyleClass: confirmation?.rejectButtonStyleClass ? confirmation.rejectButtonStyleClass : 'btn btn-text-warning',
    })
  }

}
