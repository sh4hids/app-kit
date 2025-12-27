import { drizzle } from 'drizzle-orm/libsql/node';

import * as schema from '@/api/db/schema';
import env from '@/api/env';

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  schema: schema,
});
