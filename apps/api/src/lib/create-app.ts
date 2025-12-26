import { OpenAPIHono } from '@hono/zod-openapi';

import { notFound, onError, pinoLogger } from '@/api/middlewares';
import type { AppBindings } from '@/api/lib';

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>({
    strict: false,
  });

  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
