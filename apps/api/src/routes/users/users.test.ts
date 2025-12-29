import { execSync } from 'node:child_process';
import fs from 'node:fs';

import { testClient } from 'hono/testing';
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from 'vitest';
import { ZodIssueCode } from 'zod';

import env from '@/api/env';
import { createTestApp, HttpStatusPhrases, ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/api/lib';
import router from '@/api/routes/users/users.route';

if (env.NODE_ENV !== 'test') {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));

describe('User routes', () => {
  beforeAll(async () => {
    execSync('pnpm drizzle-kit push');
  });

  afterAll(async () => {
    fs.rmSync('test.db', { force: true });
  });

  it('post /users validates the body when creating', async () => {
    const response = await client.users.$post({
      json: {
        firstName: '',
        lastName: 'Doe',
        email: '',
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('email');
      expect(json.error.issues[0].message).toBe('Invalid email address');
      expect(json.error.issues[1].path[0]).toBe('firstName');
      expect(json.error.issues[1].message).toBe(
        'Too small: expected string to have >=1 characters',
      );
    }
  });

  const userData = {
    id: 1,
    email: 'john@doe.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  it('post /users creates a user', async () => {
    const response = await client.users.$post({
      json: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.email).toBe(userData.email);
      expect(json.firstName).toBe(userData.firstName);
      expect(json.lastName).toBe(userData.lastName);
    }
  });

  it('get /users lists all users', async () => {
    const response = await client.users.$get({});
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expect(json.length).toBe(1);
    }
  });

  it('get /users/{id} validates the id param', async () => {
    const response = await client.users[':id'].$get({
      param: {
        id: 'wat',
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('id');
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it('get /users/{id} returns 404 when user not found', async () => {
    const response = await client.users[':id'].$get({
      param: {
        id: 999,
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it('get /users/{id} gets a single user', async () => {
    const response = await client.users[':id'].$get({
      param: {
        id: userData.id,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.email).toBe(userData.email);
      expect(json.firstName).toBe(userData.firstName);
      expect(json.lastName).toBe(userData.lastName);
    }
  });

  it('patch /users/{id} validates the body when updating', async () => {
    const response = await client.users[':id'].$patch({
      param: {
        id: userData.id,
      },
      json: {
        firstName: '',
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('firstName');
      expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
    }
  });

  it('patch /users/{id} validates the id param', async () => {
    const response = await client.users[':id'].$patch({
      param: {
        id: 'wat',
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('id');
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it('patch /users/{id} validates empty body', async () => {
    const response = await client.users[':id'].$patch({
      param: {
        id: userData.id,
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
    }
  });

  it('patch /users/{id} updates a single property of a user', async () => {
    const response = await client.users[':id'].$patch({
      param: {
        id: userData.id,
      },
      json: {
        lastName: 'Done',
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.lastName).toBe('Done');
    }
  });

  it('delete /users/{id} validates the id when deleting', async () => {
    const response = await client.users[':id'].$delete({
      param: {
        id: 'wat',
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('id');
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it('delete /users/{id} removes a user', async () => {
    const response = await client.users[':id'].$delete({
      param: {
        id: userData.id,
      },
    });
    expect(response.status).toBe(204);
  });
});
