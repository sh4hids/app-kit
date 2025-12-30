import { eq } from 'drizzle-orm';

import { db } from '@/api/db';
import { users } from '@/api/db/schema';
import {
  type AppRouteHandler,
  HttpStatusCodes,
  HttpStatusPhrases,
  ZOD_ERROR_CODES,
  ZOD_ERROR_MESSAGES,
} from '@/api/lib';
import type {
  CreateUserRoute,
  DeleteUserRoute,
  GetAllUsersRoute,
  GetUserByIdRoute,
  UpdateUserRoute,
} from '@/api/routes/users';

export const getAll: AppRouteHandler<GetAllUsersRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateUserRoute> = async (c) => {
  const user = c.req.valid('json');
  const [newUser] = await db.insert(users).values(user).returning();
  return c.json(newUser, HttpStatusCodes.OK);
};

export const getById: AppRouteHandler<GetUserByIdRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!user) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(user, HttpStatusCodes.OK);
};

export const update: AppRouteHandler<UpdateUserRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: 'ZodError',
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();

  if (!user) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(user, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<DeleteUserRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const result = await db.delete(users).where(eq(users.id, id));

  if (result.rowsAffected === 0) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
