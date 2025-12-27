import { z } from '@hono/zod-openapi';

import type { ZodSchema } from '@/api/lib';

export const jsonContent = <T extends ZodSchema>(schema: T, description: string) => {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
  };
};

export const createMessageObjectSchema = (exampleMessage: string = 'Hello World') => {
  return z
    .object({
      message: z.string(),
    })
    .openapi({
      example: {
        message: exampleMessage,
      },
    });
};
