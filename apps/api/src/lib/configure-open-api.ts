import { Scalar } from '@scalar/hono-api-reference';

import type { AppOpenAPI } from '@/api/lib';

import pkg from '../../package.json';

export function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.3',
    info: {
      version: pkg.version,
      title: '@sh4hids/app-kit',
    },
  });

  app.get('/reference', Scalar({ url: '/doc', theme: 'deepSpace', layout: 'classic' }));
}
