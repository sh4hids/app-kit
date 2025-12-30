import { createRoute, z } from '@hono/zod-openapi';

import { userCreateSchema, userSelectSchema, userUpdateSchema } from '@/api/db/schema';
import {
  createErrorSchema,
  createRouter,
  HttpStatusCodes,
  IdParamsSchema,
  jsonContent,
  jsonContentRequired,
  notFoundSchema,
} from '@/api/lib';
import { userHandlers } from '@/api/routes/users';

const tags = ['Users'];

const getAllUsersRoute = createRoute({
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

const updateUserRoute = createRoute({
  tags,
  path: '/users/{id}',
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(userUpdateSchema, 'The user updates'),
  },
  method: 'patch',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSelectSchema, 'Updated user'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'User not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(userCreateSchema).or(createErrorSchema(IdParamsSchema)),
      'Validation error',
    ),
  },
});

const deleteUserRoute = createRoute({
  tags,
  path: '/users/{id}',
  request: {
    params: IdParamsSchema,
  },
  method: 'delete',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'User deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'User not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

const router = createRouter()
  .openapi(getAllUsersRoute, userHandlers.getAll)
  .openapi(createUserRoute, userHandlers.create)
  .openapi(getUserByIdRoute, userHandlers.getById)
  .openapi(updateUserRoute, userHandlers.update)
  .openapi(deleteUserRoute, userHandlers.remove);

export type GetAllUsersRoute = typeof getAllUsersRoute;
export type CreateUserRoute = typeof createUserRoute;
export type GetUserByIdRoute = typeof getUserByIdRoute;
export type UpdateUserRoute = typeof updateUserRoute;
export type DeleteUserRoute = typeof deleteUserRoute;

export default router;
