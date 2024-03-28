import {Injectable} from "@angular/core";
import {LocalStorageService} from "@core/local-storage/local-storage.service";
import {FeaturesConstant} from "@core/permission/features.constant";
import {NotificationService} from "@shared/services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private _localStorage: LocalStorageService, private _notify: NotificationService) {
  }

  featuresConstant = FeaturesConstant

  get features(): {name: string, actions: string[]}[] {
    let features = []
    let roles: any[] = this._localStorage.getItem('user')?.user?.roles||[]
    roles.map(role => (role?.groups||[])).forEach(groups => {
      groups.forEach(group => {
        features = features.concat(group?.features)
      })
    })
    return features
  }

  checkAccess(accessList: {[key: string]: Array<'delete'|'update'|'read'|'create'>}, toast = false): boolean {
    if (this.checkUserType().includes('super_user')) { return true}
    let allowable = false
    this.features.filter(feature => Object.keys(accessList||{}).includes(feature.name)).forEach(feature => {
      accessList[feature.name].forEach(action => {
        if (feature.actions.includes(action)) {
          allowable = true
        }
      })
    })

    if (!allowable && toast) {
      this._notify.error({message: 'feedback.access_error'})
    }

    return allowable
  }

  checkUserType(): ('super_user'|'customer'|'admin')[] {
    let usersType = []
    if (this._localStorage.getItem('user')?.user?.super_user) usersType.push('super_user')
    if (this._localStorage.getItem('user')?.user?.vendor_user) {
      usersType.push('admin')
    } else usersType.push('customer')
    return  usersType
  }

}
