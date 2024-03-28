import { CanActivate, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { PermissionService } from "@core/permission/permission.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService) { }

  canActivate(route: ActivatedRouteSnapshot): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permission = route.data['permission']
    return of(this.permissionService.checkAccess(permission, true))
  }
}
