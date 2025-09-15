import Component from '@glimmer/component';
import { service } from '@ember/service';
import { findRecord, updateRecord } from '@warp-drive/utilities/json-api';
import { Request } from '@warp-drive/ember';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import { Checkout } from '@warp-drive/schema-record';
import { checkout, commit } from '@warp-drive/core/reactive';

export default class HelloComponent extends Component {
  @service store;

  @tracked userRequest;

  get fullName() {
    return this.args.firstName + ' ' + this.args.lastName;
  }

  @action
  fetchUser() {
    this.userRequest = this.store.request(findRecord('user', '1'));
  }

  @action
  async shuffleMirageUser() {
    let immutableUser = this.store.peekRecord('users', '1');
    let editableUser = await immutableUser[Checkout](immutableUser);
    editableUser.firstName = immutableUser.lastName;
    editableUser.lastName = immutableUser.firstName;
    await this.store.request(updateRecord(editableUser));
  }

  <template>
    [Ember] Hello
    {{this.fullName}}!

    <button type="button" {{on "click" this.fetchUser}}>Fetch from Ember!</button>
    {{#if this.userRequest}}
      <Request @request={{this.userRequest}}>
        <:content as |result|>
          Hello
          {{result.data.firstName}}
          {{result.data.lastName}}

          <button
            type="button"
            {{on "click" (fn this.shuffleMirageUser result)}}
          >Shuffle Mirage User</button>
        </:content>
      </Request>
    {{/if}}
  </template>
}
