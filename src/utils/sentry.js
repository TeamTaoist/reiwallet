import {
  BrowserClient,
  defaultStackParser,
  getDefaultIntegrations,
  makeFetchTransport,
  Scope,
} from "@sentry/browser";

const integrations = getDefaultIntegrations({}).filter((defaultIntegration) => {
  return !["BrowserApiErrors", "Breadcrumbs", "GlobalHandlers"].includes(
    defaultIntegration.name,
  );
});

const client = new BrowserClient({
  dsn: "https://138dedc0535aa4495a3c4e70a88552bb@o4507175892353024.ingest.us.sentry.io/4507983863218176",
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: integrations,
});

const scope = new Scope();
scope.setClient(client);

client.init();

export default scope;
