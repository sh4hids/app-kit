import { db } from '@/api/db';
import { users } from '@/api/db/schema';
import { type AppRouteHandler, HttpStatusCodes, HttpStatusPhrases } from '@/api/lib';
import type { CreateUserRoute, GetUserByIdRoute, ListUserRoute } from '@/api/routes/users';

export const listUserHandler: AppRouteHandler<ListUserRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users, HttpStatusCodes.OK);
};

export const createUserHandler: AppRouteHandler<CreateUserRoute> = async (c) => {
  const user = c.req.valid('json');
  const [newUser] = await db.insert(users).values(user).returning();
  return c.json(newUser, HttpStatusCodes.OK);
};

export const getUserByIdHandler: AppRouteHandler<GetUserByIdRoute> = async (c) => {
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
