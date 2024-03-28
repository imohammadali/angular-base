import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ElementRef, Injector} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "@shared/services/api.service";
import {NotificationService} from "@shared/services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "@core/local-storage/local-storage.service";
import {select, Store} from "@ngrx/store";
import {selectCaptcha, selectSettingsLanguage} from "@core/settings/settings.selectors";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {actionSettingsGenerateCaptcha} from "@core/settings/settings.actions";
import {AppState} from "@core/core.state";
import {distinctUntilChanged, map} from "rxjs/operators";
import {Utility} from '@shared/services/utility';
import * as moment from "jalali-moment";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent extends Utility implements OnInit, OnDestroy {
  @ViewChild('passwordInput') passwordInput:ElementRef;

  public formGroup: FormGroup;
  public formGroup_otp: FormGroup;
  submitted = false;
  submitted_otp = false;
  showLoading$ = this._api.showLoading$;
  $destroy = new Subject();
  language$ = this.store.pipe(select(selectSettingsLanguage));
  captchaImage$ = new BehaviorSubject('');
  captchaID$ = new BehaviorSubject('');
  signInMethod = '';
  methods = {
    oneTimePass: 'oneTimePass',
    userPass: 'userPass',
    forgetPass: 'forgetPass',
    otpLogin: 'otpLogin',
    otpForgetPass: 'otpForgetPass',
  }
  signInMethod$ = this._activatedRoute.queryParams.pipe(
    takeUntil(this.$destroy),
    map(signInMethod => {
      this.formGroup.get('captcha_challenge').patchValue('')
      this.formGroup_otp.reset()
      this.submitted_otp=false
      this.submitted=false
      this.signInMethod = signInMethod?.method || 'userPass';
      if ([this.methods.otpLogin, this.methods.otpForgetPass].includes(signInMethod?.method)) {
        this.startTimer()
      }
      return signInMethod
  }));
  interval = null
  timerInterval = null
  showPassword: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _api: ApiService,
    private store: Store<AppState>,
    private _notify: NotificationService,
    private _router: Router,
    private _localStorage: LocalStorageService,
    private _activatedRoute: ActivatedRoute,
    private injector:Injector
  ) {
    super(injector)
  }

  ngOnInit(): void {
    if (!this.route.snapshot.queryParams?.['method']) this.router.navigate(['/auth/sign-in'], {queryParams: {method: this.methods.userPass}})
    this._migrateForm();
    this.store.pipe(select(selectCaptcha)).pipe(
      takeUntil(this.$destroy)
    ).subscribe(data => {
      this.captchaID$.next(data.id);
      this.formGroup.get('captcha_id').patchValue(data.id);
      this.formGroup_otp.get('captcha_id').patchValue(data.id);
      this.captchaImage$.next(data.captcha);
    });
    this.interval = setInterval(() => {
      this.generateCaptcha();
    }, 1000 * 60)
    this.generateCaptcha();
  }

  private _migrateForm(): void {
    this.formGroup = this._fb.group({
      username: ["", ([Validators.required])],
      password: ["", ([Validators.required, Validators.minLength(6)])],
      captcha_id: [""],
      captcha_challenge: ["", ([Validators.required])],
      is_email: [false],
    }, {
      validators: (AC: AbstractControl) => {
        switch (this.signInMethod) {
          default:
          case this.methods.userPass: {
            if (!AC.get('password').value) {
              AC.get('password').setErrors({required: true});
            } else if (AC.get('password').value.length < 7) {
              AC.get('password').setErrors({minlength: true});
            }
            break;
          }
          case this.methods.forgetPass:
          case this.methods.oneTimePass: {
            AC.get('password').setErrors(null);
            break;
          }
        }

      }
    });
    this.formGroup_otp = this.fb.group({
      code: ["", ([Validators.required])],
      captcha_id: [""],
    })
  }

  toExpireOTP = new BehaviorSubject(120)
  startTimer() {
    clearInterval(this.timerInterval)
    this.toExpireOTP.next(120)
    this.timerInterval = setInterval(() => {
      if (this.toExpireOTP.value > 0) {
        this.toExpireOTP.next(this.toExpireOTP.value - 1)
      } else {
        clearInterval(this.timerInterval)
      }
    }, 1000)
  }

  submit() {
    this.submitted = true;
    switch (this.signInMethod) {
      default:
      case this.methods.userPass: {
        if (this.formGroup.invalid) return;
        let fv = this.formGroup.getRawValue();
        this._api.set('auth/login', "POST", {
          body: fv
        }, (res) => {
          this._notify.success({
            message: 'feedback.login_success'
          });
          this._localStorage.setItem('user', res);
          this._router.navigate(['/dashboard/main']);
        }, err => {
          this._notify.error({
            message: 'feedback.login_error'
          });
          this.generateCaptcha()
        });
        break;
      }
      case this.methods.forgetPass:
      case this.methods.oneTimePass: {
        if (this.formGroup.invalid) return;
        let fv = this.formGroup.getRawValue();
        this._api.set('auth/otp/request', "POST", {
          body: fv
        }, (res) => {
          this._notify.success({
            message: 'feedback.Send to'
          });
          this.router.navigate(['auth/sign-in'],
            {queryParams: {method: this.signInMethod===this.methods.forgetPass ? 'otpForgetPass' : 'otpLogin', username: fv?.username}})
          this.generateCaptcha()
        }, err => {
          this._notify.error({
            message: 'feedback.unknown_error'
          });
          this.generateCaptcha()
        });
        break;
      }
      case this.methods.otpForgetPass:
      case this.methods.otpLogin: {
        if (this.formGroup_otp.invalid || this.formGroup.get('captcha_challenge').invalid) return;
        let fv = this.formGroup_otp.getRawValue();
        const username = this.route.snapshot.queryParams?.['username']
        this.api.set('auth/otp/confirm', 'POST', {
          id: 'send_otp',
          body: {
            username,
            captcha_challenge:  this.formGroup.get('captcha_challenge').value,
            ...fv
          }
        }, (res) => {
          this._notify.success({
            message: 'feedback.login_success'
          });
          this._localStorage.setItem('user', res);
          if (this.signInMethod==this.methods.otpLogin) {
            this._router.navigate(['/dashboard/main']);
          } else if (this.signInMethod==this.methods.otpForgetPass) {
            this._router.navigate(['/profile/reset-pass']);
          }
        }, err => {
          this._notify.error({
            message: 'feedback.login_error'
          });
          this.generateCaptcha()
        })
        break
      }
    }
  }

  generateCaptcha() {
    this.store.dispatch(actionSettingsGenerateCaptcha({size: {w:'150', h: '80'}}));
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.passwordInput.nativeElement['type'] = this.showPassword ? 'text' : 'password';
  }

  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
    clearInterval(this.interval)
    clearInterval(this.timerInterval)
  }

  protected readonly moment = moment;
}
