import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { initDatabase } from './database';

platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .then(() => console.log('Module successfully bootstrapped'))
      .catch((err) => console.error(err));
