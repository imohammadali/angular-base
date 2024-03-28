import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import {Observable, Subject, throwError as observableThrowError} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {LocalStorageService} from "@core/local-storage/local-storage.service";
import {Router} from "@angular/router";
import {IMessageService, NotificationService} from "@shared/services/notification.service";
import {MessageService} from "primeng/api";

/** Passes HttpErrorResponse to application-wide error handler */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  err_subject = new Subject()

  constructor(
    private _localStorage: LocalStorageService,
    private _router: Router,
    private messageService: MessageService
  ) {
    this.err_subject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(data => {
      this._error(data)
    })
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (typeof err.error?.text == "function") {
          err.error?.text().then(blobErr => {
            if (JSON.parse(blobErr)?.error) {
              err.error = JSON.parse(blobErr).error
            }
            this._showError(err)
          })
        } else {
          this._showError(err)
        }
        return observableThrowError(err);
      })
    );
  }

  private _error(data: IMessageService) {
    this.messageService.add(
      {
        severity: 'error',
        summary: data?.title,
        detail: data?.message,
        closable: data?.closable || true,
        life: 5000
      }
    );
  }

  private _showError(err) {
    switch (err.status) {
      case 400:
        if (err.error["error"] != undefined) {
          if (err.error.error === "Error in loading user" || err.error.error === "خطا در یافتن کاربر") {
            this._localStorage.removeItem('user');
            this._router.navigate(['auth/sign-in']);
          }
          this.err_subject.next({message: err.error["error"], title: '400'});
        } else if (err.error) {
          this.err_subject.next({message: err.error, title: '400'});
        }
        break;
      case 401:
        // this.err_subject.next({message: err.error["error"], title: '401'});
        this._localStorage.removeItem('user');
        this._router.navigate(['auth/sign-in'], {queryParams: {method: 'userPass'}});
        break;
      case 403:
        this.err_subject.next({message: err.error["error"], title: '403'});
        break;
      case 404:
        this.err_subject.next({message: err.error["error"], title: '404'});
        break;
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
      case 505:
      case 506:
      case 507:
      case 508:
      case 510:
      case 511:
        this.err_subject.next({message: err.error["message"], title: '500'});
        break;
      default:
        if (err.status) {
          this.err_subject.next({message: 'feedback.unknown_error'});
        }

        break;
    }
  }

}
