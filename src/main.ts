import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env/environment';
import { style } from '@angular/animations';

let assetsUrl = environment.assetURL

// add to header
const favicon = document.createElement('link');
favicon.rel = 'shortcut icon';
favicon.href = assetsUrl+'img/favicon.png';
document.head.appendChild(favicon);

if (environment.production) {
  enableProdMode();
  if (window) {
    if (window['console']) {
      console.info(`%c    ________  _______
   / ____/  |/  / __ \\
  / __/ / /|_/ / /_/ /
 / /___/ /  / / ____/
/_____/_/  /_/_/%c Version: ${environment.versions.app}, Build Number: ${environment.versions.build}`, "font-size: 14px;", "")
      let methods = ['dir', 'dirxml', 'trace', 'profile', 'log', 'warning', 'warn', 'error', 'assert', 'debug'];
      methods.forEach((name) => {
        window['console'][name] = function () { };
      })
    }

  }
} else {
  console.info(`%c    ________  _______
   / ____/  |/  / __ \\
  / __/ / /|_/ / /_/ /
 / /___/ /  / / ____/
/_____/_/  /_/_/%c Version: ${environment.versions.app}, Build Number: ${environment.versions.build}`, "font-size: 14px;", "")
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
