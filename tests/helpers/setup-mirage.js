import { setupMirage as _setupMirage } from 'ember-mirage/test-support';
import { makeServer } from 'multiframework-mashup/mirage/servers/default';

export function setupMirage(hooks, options) {
  options = options || {};
  options.createServer = options.makeServer || makeServer;

  _setupMirage(hooks, {
    ...options,
    config: {
      ...options.config,
      environment: 'test',
    },
  });

  hooks.beforeEach(function (assert) {
    // This will log if the server responds with a Mirage error (generally a 500 from Mirage throwing in the handler code).
    this.server.pretender.prepareBody = function (body) {
      try {
        let parsed = JSON.parse(body);
        if (
          typeof parsed.stack === 'string' &&
          parsed.stack.startsWith('Mirage:')
        ) {
          let error = new Error(parsed.message ?? 'Unknown Error');
          error.stack = parsed.stack;
          assert.pushResult({
            result: false,
            expected: '',
            actual: error.stack,
            message:
              'Error in Mirage request handler. See console for details.',
          });

          console.error(error);
        }
      } catch {
        // ignore because an un-parseable body is valid (e.g. an empty body) and Mirage errors should always be parseable
      }

      return body;
    };
  });
}
