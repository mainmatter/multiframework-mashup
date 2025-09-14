import { pageTitle } from 'ember-page-title';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { hash } from '@ember/helper';
import { action } from '@ember/object';

import HelloEmberComponent from '../components/hello-component.gjs';
import HelloSvelteComponent from '../components/hello-component.svelte';
import HelloReactComponent from '../components/hello-component.jsx';

import ReactBridge from '../components/react-bridge.gjs';
import SvelteBridge from '../components/svelte-bridge.gjs';
import { on } from '@ember/modifier';

export default class ApplicationRouteComponent extends Component {
  @tracked firstName = 'Nick';
  @tracked lastName = 'Schot';

  @action
  shuffleName() {
    let firstName = this.firstName;
    this.firstName = this.lastName;
    this.lastName = firstName;
  }

  <template>
    {{pageTitle "MultiframeworkMashup"}}
    <h2 id="title">Multiframework Mashup!</h2>

    <button type="button" {{on "click" this.shuffleName}}>Shuffle!</button>

    <div>
      <HelloEmberComponent
        @firstName={{this.firstName}}
        @lastName={{this.lastName}}
      />
      <ReactBridge
        @component={{HelloReactComponent}}
        @props={{hash firstName=this.firstName lastName=this.lastName}}
      />
      <SvelteBridge
        @component={{HelloSvelteComponent}}
        @props={{hash firstName=this.firstName lastName=this.lastName}}
      />
    </div>
  </template>
}
