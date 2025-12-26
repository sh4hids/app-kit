import { createApp } from '@/api/lib';

const app = createApp();

app.get('/', (c) => {
  return c.text('Hello World!');
});

app.get('/error', (c) => {
  c.var.logger.info('This is a log');
  throw new Error('This is an error');
});

export default app;
