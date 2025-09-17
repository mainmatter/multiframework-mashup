import Component from '@glimmer/component';
import { service } from '@ember/service';
import { findRecord, updateRecord } from '@warp-drive/utilities/json-api';
import { Request } from '@warp-drive/ember';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { checkout } from '@warp-drive/core/reactive';

export default class HelloComponent extends Component {
  @service store;
  @service counter;

  @tracked userRequest;

  get fullName() {
    return this.args.firstName + ' ' + this.args.lastName;
  }

  @action
  async shuffleMirageUser() {
    let immutableUser = this.store.peekRecord('users', '1');
    let editableUser = await checkout(immutableUser);
    editableUser.firstName = immutableUser.lastName;
    editableUser.lastName = immutableUser.firstName;
    await this.store.request(updateRecord(editableUser));
  }

  <template>
    [Ember] Hello
    {{this.fullName}}!

    <h3>Ember Counter</h3>
    <p>
      {{this.counter.count}}
      <button type="button" {{on "click" this.counter.increment}}>+1</button>
    </p>

    <div>
      <Request @query={{findRecord "user" "1"}}>
        <:content as |result|>
          Hello from Ember
          {{result.data.firstName}}
          {{result.data.lastName}}

          <button
            type="button"
            {{on "click" this.shuffleMirageUser}}
          >Shuffle</button>
        </:content>
      </Request>
    </div>
  </template>
}
