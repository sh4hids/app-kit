import { createRoute, z } from '@hono/zod-openapi';

import { userCreateSchema, userSelectSchema } from '@/api/db/schema';
import {
  createErrorSchema,
  createRouter,
  HttpStatusCodes,
  jsonContent,
  jsonContentRequired,
} from '@/api/lib';
import { createUserHandler, listUserHandler } from '@/api/routes/users';

const tags = ['Users'];

const listUserRoute = createRoute({
  tags,
  path: '/users',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(userSelectSchema), 'User list'),
  },
});

const createUserRoute = createRoute({
  tags,
  path: '/users',
  request: {
    body: jsonContentRequired(userCreateSchema, 'The user to create'),
  },
  method: 'post',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSelectSchema, 'Created user'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(userCreateSchema),
      'Validation error',
    ),
  },
});

const router = createRouter()
  .openapi(listUserRoute, listUserHandler)
  .openapi(createUserRoute, createUserHandler);

export type ListUserRoute = typeof listUserRoute;
export type CreateUserRoute = typeof createUserRoute;

export default router;
