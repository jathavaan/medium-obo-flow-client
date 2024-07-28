export type ProxyRequestBody = {
  endpoint: string;
};

export type EntraIdConfiguration = {
  tenant_id: string;
  client_id: string;
  client_secret: string;
  scope: string;
};
