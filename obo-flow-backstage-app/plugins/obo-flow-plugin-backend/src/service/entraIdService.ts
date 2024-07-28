import { EntraIdConfiguration } from './types';
import {
  ConfidentialClientApplication,
  Configuration,
  OnBehalfOfRequest,
} from '@azure/msal-node';

export class EntraIdService {
  private entraIdConfig: EntraIdConfiguration;
  private clientApplication: ConfidentialClientApplication;

  constructor(entraIdConfig: EntraIdConfiguration) {
    this.entraIdConfig = entraIdConfig;
    const msalConfig: Configuration = {
      auth: {
        clientId: this.entraIdConfig.client_id,
        clientSecret: this.entraIdConfig.client_secret,
        authority: `https://login.microsoftonline.com/${this.entraIdConfig.tenant_id}`,
      },
    };

    this.clientApplication = new ConfidentialClientApplication(msalConfig);
  }

  async acquireTokenOnBehalfOfUser(token: string) {
    const request: OnBehalfOfRequest = {
      oboAssertion: token, // The assertion is the Client token
      scopes: [this.entraIdConfig.scope], // <API-A-audience>/.default
    };

    const response = await this.clientApplication.acquireTokenOnBehalfOf(
      request,
    );

    return response?.accessToken; // The output is Token A
  }
}
