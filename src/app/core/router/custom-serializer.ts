import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateUrl } from './router.state';
import {BreadcrumbFacade} from "@core/breadcrumb/+state/breadcrumb.facade";
import {environment} from "@env/environment";

@Injectable()
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {

  constructor(private _breadcrumbFacade: BreadcrumbFacade) {
  }

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }



    const {
      url,
      root: { queryParams }
    } = routerState;
    const { params, fragment } = route;

    let url2 = decodeURI(url);

    Object.keys(params).forEach(key => {
      if (url2.includes(params[key])) {
        url2 = url2.replace(params[key], `:${key}`)
      }
    });

    Object.keys(queryParams).forEach(key => {
      if (url2.includes(queryParams[key])) {
        url2 = url2.replace(queryParams[key], `:${key}`)
      }
    });

    this._breadcrumbFacade.setData(url2)

    return { url, params, queryParams };
  }
}
