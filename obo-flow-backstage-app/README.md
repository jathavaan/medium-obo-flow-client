# OBO flow Backstage app
This is the backend for the example project presented in the medium article [Tilgangsstyring gjort enkelt med OBO-flyt]().

## Startup

To start the app, run:

```sh
yarn install
yarn dev
```

## Setup

### Microsoft SSO

This part is very alike the Backstage docs
for [Azure authentication provider](https://backstage.io/docs/auth/microsoft/provider)
and [Microsoft tenant data](https://backstage.io/docs/integrations/azure/org/).

#### Step 1: Installing necessary packages

Run the following commands to install the needed packages

```shell 
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-microsoft-provider
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-msgraph
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-guest-provider
```

#### Step 2: Add sign in component and authentication backend

To be able to log in using the Microsoft SSO ensure that you have added the login component. This can be done by
editing `packages/app/src/App.tsx`. The signing component `SignInPage` can be passed an option when creating the app.

```typescript jsx
const app = createApp({
    apis,
    bindRoutes({bind}) {
        bind(catalogPlugin.externalRoutes, {
            createComponent: scaffolderPlugin.routes.root,
            viewTechDoc: techdocsPlugin.routes.docRoot,
            createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
        });
        bind(apiDocsPlugin.externalRoutes, {
            registerApi: catalogImportPlugin.routes.importPage,
        });
        bind(scaffolderPlugin.externalRoutes, {
            registerComponent: catalogImportPlugin.routes.importPage,
            viewTechDoc: techdocsPlugin.routes.docRoot,
        });
        bind(orgPlugin.externalRoutes, {
            catalogIndex: catalogPlugin.routes.catalogIndex,
        });
    },
    components: {
        SignInPage: props => (
            <SignInPage
                {...props}
                auto
                providers={[
                    'guest', // This is the guest login used for local development
                    {
                        id: 'microsoft-auth-provider',
                        title: 'Microsoft',
                        message: 'Sign in using Microsoft',
                        apiRef: microsoftAuthApiRef, // This is the Microsoft authentication API ref provided by backstage
                    },
                ]}
            />
        ),
    },
});
```

To add the authentication backend add the following lines in `packages/backend/src/index.ts`

```typescript
backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-catalog-backend-module-msgraph/alpha'));
```

#### Step 3: Add Entra ID credentials

In `app-config.yaml` add the following

```yaml
auth:
  environment: development
  providers:
    guest: { }
    microsoft:
      development:
        clientId: ${OBO_BACKSTAGE_CLIENT_ID}
        clientSecret: ${OBO_BACKSTAGE_CLIENT_SECRET}
        tenantId: ${OBO_TENANT_ID}
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
            - resolver: emailLocalPartMatchingUserEntityName
            - resolver: emailMatchingUserEntityAnnotation
```

In the same file under `catalog` add

```yaml
providers:
  microsoftGraphOrg:
    default:
      clientId: ${OBO_BACKSTAGE_CLIENT_ID}
      clientSecret: ${OBO_BACKSTAGE_CLIENT_SECRET}
      tenantId: ${OBO_TENANT_ID}
      providerId:
        user:
          filter: accountEnabled eq true and userType eq 'member'
      schedule:
        frequency: PT1H
        timeout: PT50M
        retry: PT5M
```

This will load the users into Backstage from Microsoft Graph and allow you to sign in using SSO.

## Creating a backend plugin

To create a backend plugin in backstage run the following command:

```shell
yarn new --select backend-plugin
```

And add the line under in `packages/src/index.ts` to add the backend plugin to your app:

```typescript
backend.add(import('@internal/backstage-plugin-obo-flow-plugin-backend'));
```

The backend plugin is now ready to be setup as a proxy!

### Entra ID service using the MSAL library

You will need MSAL for Node to acquire a token on behalf of the user. To install it simply run

```shell
yarn add @azure/msal-node -W
```

