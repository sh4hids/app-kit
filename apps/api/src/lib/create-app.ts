import { OpenAPIHono } from '@hono/zod-openapi';
import type { Schema } from 'hono';

import { type AppBindings, type AppOpenAPI, defaultHook } from '@/api/lib';
import { notFound, onError, pinoLogger } from '@/api/middlewares';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export function createApp() {
  const app = createRouter();
  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route('/', router);
}
