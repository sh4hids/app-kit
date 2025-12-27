import { createRoute, z } from '@hono/zod-openapi';

import { createRouter, HttpStatusCodes, jsonContent } from '@/api/lib';
import { listHandler } from '@/api/routes/users';

const tags = ['Users'];

const listRoute = createRoute({
  tags,
  path: '/users',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          email: z.email(),
          firstName: z.string(),
          lastName: z.string(),
        }),
      ),
      'User List',
    ),
  },
});

const router = createRouter().openapi(listRoute, listHandler);

export type ListRoute = typeof listRoute;
export default router;
