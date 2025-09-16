import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'multiframework-mashup/config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';

import { buildSignalConfig as buildEmberSignalConfig } from '@warp-drive/ember/install';
import { buildSignalConfig as buildReactSignalConfig } from '@warp-drive/react/install';
import { setupSignals } from '@warp-drive/core/configure';

function buildCombinedSignalConfig(options) {
  const emberConfig = buildEmberSignalConfig(options);
  const reactConfig = buildReactSignalConfig(options);

  return {
    createSignal() {
      return {
        ember: emberConfig.createSignal(...arguments),
        react: reactConfig.createSignal(...arguments),
      };
    },
    notifySignal(signal) {
      emberConfig.notifySignal(signal.ember);
      reactConfig.notifySignal(signal.react);
    },
    consumeSignal(signal) {
      emberConfig.consumeSignal(signal.ember);
      reactConfig.consumeSignal(signal.react);
    },
    createMemo() {
      emberConfig.createMemo(...arguments);
      return reactConfig.createMemo(...arguments);
    },
    waitFor(promise) {
      return emberConfig.waitFor(reactConfig.waitFor(promise));
    },
    willSyncFlushWatchers() {
      return (
        emberConfig.willSyncFlushWatchers() ||
        reactConfig.willSyncFlushWatchers()
      );
    },
  };
}
setupSignals(buildCombinedSignalConfig);

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
}

loadInitializers(App, config.modulePrefix, compatModules);
