import type { OpenAPIHono, RouteConfig, RouteHandler, z } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
export type ZodIssue = z.core.$ZodIssue;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
