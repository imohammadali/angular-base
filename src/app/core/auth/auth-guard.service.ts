import { Injectable } from '@angular/core';
import { Route, Router, UrlSegment } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { AppState } from '../core.state';
import {LocalStorageService} from "@core/local-storage/local-storage.service";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  {
  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _storage: LocalStorageService
  ) {}

  canLoad(route: Route, segments: UrlSegment[]) {
    if (this._storage.getItem('user')?.token) {
      return of(true);
    }

    this._router.navigate(['/auth/sign-in']);
    return of(false);
  }

}
