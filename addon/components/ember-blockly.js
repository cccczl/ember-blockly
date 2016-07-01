import Ember from 'ember';
import layout from '../templates/components/ember-blockly';

export default Ember.Component.extend({
  layout,

  didInsertElement() {

    this.createSection("section_control", "Control");
    this.createSection("section_logic", "Lógica");


    let toolbox = this.createToolbox([
      'section_control', 'controls_if', 'controls_if_else', 'controls_whileUntil',
      'section_logic', 'logic_compare', 'logic_operation', 'logic_boolean']);

    let options = {
       toolbox: toolbox,
       trashcan: true,
       zoom: {
         controls: true,
         wheel: false,
         startScale: 1.0,
         maxScale: 3,
         minScale: 0.3,
         scaleSpeed: 1.2
       },
     };

    let workspace = Blockly.inject('blocklyDiv', options);
  },

  createSection(name, label) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(`  ${label}  `);
        this.setOutput(false);
        this.setNextStatement(false);
        this.setPreviousStatement(false);
        this.setDisabled(true);
      }
    };
  },

  createToolbox(bloques) {
    let toolbox = [];

    toolbox.push('<xml>');

    bloques.forEach((bloque) => {
      toolbox.push(`<block type="${bloque}"></block>`);
    });

    toolbox.push('</xml>');

    return toolbox.join("\n");
  }
});
