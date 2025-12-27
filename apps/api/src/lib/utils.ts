import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@hono/zod-openapi';

import type { ZodIssue, ZodSchema } from '@/api/lib';

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

export const jsonContentRequired = <T extends ZodSchema>(schema: T, description: string) => {
  return {
    ...jsonContent(schema, description),
    required: true,
  };
};

export const jsonContentOneOf = <T extends ZodSchema>(schemas: T[], description: string) => {
  return {
    content: {
      'application/json': {
        schema: {
          oneOf: oneOf(schemas),
        },
      },
    },
    description,
  };
};

export const oneOf = <T extends ZodSchema>(schemas: T[]) => {
  const registry = new OpenAPIRegistry();

  schemas.forEach((schema, index) => {
    registry.register(index.toString(), schema);
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const components = generator.generateComponents();

  return components.components?.schemas ? Object.values(components.components!.schemas!) : [];
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

export const createErrorSchema = <T extends ZodSchema>(schema: T) => {
  const { error } = schema.safeParse(
    schema._def.type === 'array' ? [schema.element._def.type === 'string' ? 123 : 'invalid'] : {},
  );

  const example = error
    ? {
        name: error.name,
        issues: error.issues.map((issue: ZodIssue) => ({
          code: issue.code,
          path: issue.path,
          message: issue.message,
        })),
      }
    : {
        name: 'ZodError',
        issues: [
          {
            code: 'invalid_type',
            path: ['fieldName'],
            message: 'Expected string, received undefined',
          },
        ],
      };

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example,
      }),
  });
};
