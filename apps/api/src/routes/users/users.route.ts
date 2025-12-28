import { createRoute, z } from '@hono/zod-openapi';

import { userCreateSchema, userSelectSchema } from '@/api/db/schema';
import {
  createErrorSchema,
  createRouter,
  HttpStatusCodes,
  IdParamsSchema,
  jsonContent,
  jsonContentRequired,
  notFoundSchema,
} from '@/api/lib';
import { createUserHandler, getUserByIdHandler, listUserHandler } from '@/api/routes/users';

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

const getUserByIdRoute = createRoute({
  tags,
  path: '/users/{id}',
  request: {
    params: IdParamsSchema,
  },
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSelectSchema, 'Requested user'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'User not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

const router = createRouter()
  .openapi(listUserRoute, listUserHandler)
  .openapi(createUserRoute, createUserHandler)
  .openapi(getUserByIdRoute, getUserByIdHandler);

export type ListUserRoute = typeof listUserRoute;
export type CreateUserRoute = typeof createUserRoute;
export type GetUserByIdRoute = typeof getUserByIdRoute;

export default router;
