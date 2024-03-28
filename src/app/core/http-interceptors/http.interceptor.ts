import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpHeaders, HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {LocalStorageService} from "@core/local-storage/local-storage.service";

@Injectable()
export class HttpBaseInterceptor implements HttpInterceptor {

  constructor(private _localStorage: LocalStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let req;
    let headers;
    const token = 'Bearer ' + this._localStorage.getItem('user')?.token;
    const lang = this._localStorage.getItem('SETTINGS')?.language || 'fa';
    request = request.clone({
      withCredentials: true
    });

    if (request.url.indexOf('login') < 0) {
      headers = new HttpHeaders({
        'Authorization': token,
        'Language': lang
      });
      req = request.clone({ headers: headers });
    } else {
      req = request;
    }
    return next.handle(req);
  }
}
