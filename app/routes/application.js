import { service } from '@ember/service';
import { isDevelopingApp, macroCondition } from '@embroider/macros';
import Route from '@ember/routing/route';
import { findRecord } from '@warp-drive/utilities/json-api';
import { registerDerivations, withDefaults } from '@warp-drive/schema-record';

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

    const schema = this.store.schema;
    registerDerivations(schema);
    schema.registerResource(
      withDefaults({
        type: 'users',
        fields: [
          {
            kind: 'field',
            name: 'firstName',
            sourceKey: 'first-name',
          },
          {
            kind: 'field',
            name: 'lastName',
            sourceKey: 'last-name',
          },
        ],
      })
    );

    let usersResponse = await this.store.request(findRecord('user', '1'));
    console.log(usersResponse.content.data);
  }
}
