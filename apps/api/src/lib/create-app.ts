import { OpenAPIHono } from '@hono/zod-openapi';

import { type AppBindings, defaultHook } from '@/api/lib';
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
