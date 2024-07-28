import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const oboFlowPluginFrontendPlugin = createPlugin({
  id: 'obo-flow-plugin-frontend',
  routes: {
    root: rootRouteRef,
  },
});

export const OboFlowPluginFrontendPage = oboFlowPluginFrontendPlugin.provide(
  createRoutableExtension({
    name: 'OboFlowPluginFrontendPage',
    component: () =>
      import('./components/OboFlowPluginPage').then(m => m.OboFlowPluginPage),
    mountPoint: rootRouteRef,
  }),
);
