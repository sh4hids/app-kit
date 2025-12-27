import { db } from '@/api/db';
import { users } from '@/api/db/schema';
import { type AppRouteHandler, HttpStatusCodes } from '@/api/lib';
import type { CreateUserRoute, ListUserRoute } from '@/api/routes/users';

export const listUserHandler: AppRouteHandler<ListUserRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users, HttpStatusCodes.OK);
};

export const createUserHandler: AppRouteHandler<CreateUserRoute> = async (c) => {
  const user = c.req.valid('json');
  const [newUser] = await db.insert(users).values(user).returning();
  return c.json(newUser, HttpStatusCodes.OK);
};
