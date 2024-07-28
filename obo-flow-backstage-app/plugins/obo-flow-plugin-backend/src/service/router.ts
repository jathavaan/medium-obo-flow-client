import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { EntraIdConfiguration, ProxyRequestBody } from './types';
import { EntraIdService } from './entraIdService';
import { ProxyService } from './proxyService';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const backendBaseUrl = config.getString('backend.backendBaseUrl');
  const clientId = config.getString('msal.clientId');
  const clientSecret = config.getString('msal.clientSecret');
  const tenantId = config.getString('msal.tenantId');
  const scope = `${config.getString('msal.clientIdApiA')}/.default`;

  const entraIdConfiguration: EntraIdConfiguration = {
    tenant_id: tenantId,
    client_id: clientId,
    client_secret: clientSecret,
    scope: scope,
  };

  const entraIdService = new EntraIdService(entraIdConfiguration);
  const proxyService = new ProxyService(backendBaseUrl, entraIdService);

  const router = Router();
  router.use(express.json());

  router.post('/proxy', async (req, res) => {
    try {
      const clientToken = req.header('Authorization');
      if (!clientToken || !clientToken.startsWith('Bearer ')) {
        logger.error('Invalid Bearer token');
        return res.status(401).json({ error: 'Invalid Bearer token' });
      }

      const token = clientToken.replace('Bearer ', '').trim();
      const proxyRequest = req.body as ProxyRequestBody;
      const endpoint = proxyRequest.endpoint;

      const response = await proxyService.getData(logger, token, endpoint);
      return res.status(200).json({ result: response });
    } catch (error: any) {
      logger.error('Error processing proxy request: ', error);
      return res.status(500).json({ error: error.message });
    }
  });

  const middleware = MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());
  return router;
}
