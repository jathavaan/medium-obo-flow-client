import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { oboFlowPluginFrontendPlugin, OboFlowPluginFrontendPage } from '../src/plugin';

createDevApp()
  .registerPlugin(oboFlowPluginFrontendPlugin)
  .addPage({
    element: <OboFlowPluginFrontendPage />,
    title: 'Root Page',
    path: '/obo-flow-plugin-frontend',
  })
  .render();
