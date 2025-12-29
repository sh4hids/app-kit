import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@hono/zod-openapi';
import type z4 from 'zod/v4';

import type { ZodIssue, ZodSchema } from '@/api/lib';
import { HttpStatusPhrases } from '@/api/lib';

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

export const IdParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: 'id',
      in: 'path',
      required: true,
    },
    required: ['id'],
    example: 42,
  }),
});

export const IdUUIDParamsSchema = z.object({
  id: z.uuid().openapi({
    param: {
      name: 'id',
      in: 'path',
      required: true,
    },
    required: ['id'],
    example: '4651e634-a530-4484-9b09-9616a28f35e3',
  }),
});

// Regular expression to validate slug format: alphanumeric, underscores, and dashes
const slugReg = /^[\w-]+$/;
const SLUG_ERROR_MESSAGE = 'Slug can only contain letters, numbers, dashes, and underscores';

export const SlugParamsSchema = z.object({
  slug: z
    .string()
    .regex(slugReg, SLUG_ERROR_MESSAGE)
    .openapi({
      param: {
        name: 'slug',
        in: 'path',
        required: true,
      },
      required: ['slug'],
      example: 'slug-param-schema',
    }),
});

type Validator = 'uuid' | 'nanoid' | 'cuid' | 'cuid2' | 'ulid';

export interface ParamsSchema {
  name?: string;
  validator?: Validator | undefined;
}

const examples: Record<Validator, string> = {
  uuid: '4651e634-a530-4484-9b09-9616a28f35e3',
  nanoid: 'V1StGXR8_Z5jdHi6B-myT',
  cuid: 'cjld2cjxh0000qzrmn831i7rn',
  cuid2: 'tz4a98xxat96iws9zmbrgj3a',
  ulid: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
};

export const getParamsSchema = ({ name = 'id', validator = 'uuid' }: ParamsSchema) => {
  return z.object({
    [name]: z[validator]().openapi({
      param: {
        name,
        in: 'path',
        required: true,
      },
      required: [name],
      example: examples[validator],
    }),
  });
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);

export function toZodV4SchemaTyped<T extends z4.ZodTypeAny>(schema: T) {
  return schema as unknown as z.ZodType<z4.infer<T>>;
}
