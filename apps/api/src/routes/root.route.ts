import { createRoute } from '@hono/zod-openapi';

import { createMessageObjectSchema, createRouter, HttpStatusCodes, jsonContent } from '@/api/lib';

const router = createRouter().openapi(
  createRoute({
    tags: ['Root'],
    method: 'get',
    path: '/health',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema('API is up and running!'),
        'API health',
      ),
    },
  }),
  (c) => {
    return c.json(
      {
        message: 'API is up and running',
      },
      HttpStatusCodes.OK,
    );
  },
);

export default router;
