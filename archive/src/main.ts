import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
// we have to find better way for this.
setTimeout(() => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
}, 2000);

