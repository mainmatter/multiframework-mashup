import { createConfig } from 'ember-mirage';
//import { importEmberDataModels } from 'ember-mirage/ember-data';
import { pluralize, singularize } from 'ember-inflector';
import { createServer } from 'miragejs';

//const emberDataModels = import.meta.glob('../../app/models/**/*');
const mirageConfig = await createConfig({
  factories: import.meta.glob('../factories/*'),
  fixtures: import.meta.glob('../fixtures/*'),
  models: import.meta.glob('../models/*'),
  serializers: import.meta.glob('../serializers/*'),
  identityManagers: import.meta.glob('../identity-managers/*'),
});

export async function makeServer(config, _store) {
  let { inflector, ...rest } = config;

  // Don't attempt to import from test-helpers when running in the app
  let store =
    _store ??
    (await import('@ember/test-helpers'))
      .getContext()
      .owner.lookup('service:store');

  return createServer({
    ...mirageConfig,
    ...rest,

    inflector: {
      pluralize,
      singularize,
      ...inflector,
    },

    models: {
      //...importEmberDataModels(store, emberDataModels),
      ...mirageConfig.models,
      ...config.models,
    },

    serializers: {
      ...mirageConfig.serializers,
      ...config.serializers,
    },

    routes() {
      this.resource('users');
    },
  });
}
