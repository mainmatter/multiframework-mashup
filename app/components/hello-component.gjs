import Component from '@glimmer/component';

export default class HelloComponent extends Component {
  get fullName() {
    return this.args.firstName + ' ' + this.args.lastName;
  }

  <template>
    [Ember] Hello {{this.fullName}}!
  </template>
}
