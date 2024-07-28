import { EntraIdService } from './entraIdService';
import fetch from 'node-fetch';
import { LoggerService } from '@backstage/backend-plugin-api';

export class ProxyService {
  private readonly baseUrlApiA: string;
  private readonly entraIdService: EntraIdService;

  constructor(baseUrlApiA: string, entraIdService: EntraIdService) {
    this.baseUrlApiA = baseUrlApiA;
    this.entraIdService = entraIdService;
  }

  async getData(
    logger: LoggerService,
    clientToken: string,
    endpoint: string,
  ): Promise<any> {
    const tokenA = await this.entraIdService.acquireTokenOnBehalfOfUser(
      clientToken,
    );

    logger.info(`Proxy made a GET request to ${this.baseUrlApiA}/${endpoint}`);
    if (!tokenA) return null;
    const response = await fetch(`${this.baseUrlApiA}/${endpoint}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      method: 'GET',
    });

    return response.json();
  }
}
