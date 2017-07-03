//
// 夜/Internals/Builtins/LinkTo
//

export default {
  component: [
    'LinkTo',
    {
      builtinClasses: ['yoru-builtin', 'yoru-link-to'],

      model() {
        return {
          builtinClasses: this.get('builtinClasses').join(' '),
        };
      },

      afterAppend() {
        const link = this.get('shadow').querySelector('a');
        link.addEventListener('click', () => {
          // This was relevant in an attempt at routing, kept for later use
          // Routing will be implemented after a proper render cycle is defined
          //
          // href was also added to the template so this can be used as a
          // regular HTML link in the meantime
          //
          // const route = this.get('attrs.route');
          // this.get('app').routeTo(route);
        });
      },
    },
  ],
  template: `
    <style media="screen">
      a.yoru-link-to { cursor: pointer }
    </style>
    <a href={{href}}
      class="{{builtinClasses}} {{class}}"
      title="{{or title href}}"
      target="{{if outgoing '_blank'}}"
      rel="{{if outgoing 'noreferrer noopener'}}"
    >
      {{yield}}
    </a>
  `,
};
