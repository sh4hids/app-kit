import { configureOpenAPI, createApp } from '@/api/lib';
import { rootRoute, usersRoute } from '@/api/routes';

const app = createApp();

const routes = [rootRoute, usersRoute];

configureOpenAPI(app);

routes.forEach((route) => {
  app.route('/', route);
});

export default app;
