import { type AppRouteHandler, HttpStatusCodes } from '@/api/lib';
import type { ListRoute } from '@/api/routes/users';

export const listHandler: AppRouteHandler<ListRoute> = (c) => {
  return c.json(
    [
      {
        email: 'f0kZ2@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
    ],
    HttpStatusCodes.OK,
  );
};
