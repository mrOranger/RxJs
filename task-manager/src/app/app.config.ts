import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
      providers: [
            provideAnimations(),
            provideRouter(
                  routes,
                  withComponentInputBinding(),
                  withRouterConfig({
                        paramsInheritanceStrategy: 'always',
                  }),
            ),
      ],
};
