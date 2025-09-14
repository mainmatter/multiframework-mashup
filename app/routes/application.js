import { inject as service } from '@ember/service';
import { isDevelopingApp, macroCondition } from '@embroider/macros';
import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  @service store;

  async beforeModel() {
    if (macroCondition(isDevelopingApp())) {
      let { makeServer } = await import('../mirage/servers/default');
      let server = await makeServer(
        {
          environment: 'development',
          scenarios: await import('../mirage/scenarios'),
        },
        this.store
      );
      server.logging = true;
    }
  }
}
