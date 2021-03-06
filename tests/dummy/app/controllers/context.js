import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    setSimpleToolbar() {
      this.set('blocksDemo2', ['controls_if']);
    },
    setOtherToolbar() {
      this.set('blocksDemo2', [
           'section_control',
           'controls_if', 'controls_if_else', 'controls_whileUntil',
      ]);
    },
    setToolboxFromXMLString() {
      let xmlString = `
        <xml>
            <block type="section_control"></block>
            <block type="controls_if"></block>
            <block type="controls_if_else"></block>
        </xml>
      `;

      this.set('blocksDemo2', xmlString);
    },
    clearWorkspace() {
      this.set('workspaceDemo2', "");
    },
    setASimpleWorkspace() {
      this.set('workspaceDemo2', '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="controls_if" id="f`z3uw:anQ0tZL@R9Im(" x="80" y="27"></block></xml>');
    },
    setAnotherWorkspace() {
      this.set('workspaceDemo2', '<xml xmlns="http://www.w3.org/1993/xhtml"><block type="controls_if_else" id="f`z3u2w:an2Q0tZL@R9Im(" x="180" y="127"></block></xml>');
    },
    onChangeWorkspace(workspace) {
      this.set('workspaceDemoReturned', workspace);
    },
  }
});
