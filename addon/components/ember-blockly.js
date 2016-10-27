import Ember from 'ember';
import layout from '../templates/components/ember-blockly';


export default Ember.Component.extend({
  layout,
  disablePreloadAudio: true,
  classNames: ['ember-blockly-container'],
  blocks: [],
  current_blocks: Ember.computed.oneWay('blocks'),
  workspaceElement: null,
  workspace: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',

  withZoom: true,       // definirá el parámetro "zoom" al llamar a inject.
  withTrash: true,      // definirá el parámetro "trashcan" al llamar a inject.

  collapse: false,
  comments: true,
  css: true,
  disable: true,
  grid: false,
  horizontalLayout: false,
  maxBlocks: Infinity,
  media: "blockly-package/media/",
  oneBasedIndex: true,
  readOnly: false,
  rtl: false,
  scrollbars: true,
  sounds: true,
  toolboxPosition: "start",

  observeBlocks: Ember.observer('blocks', function() {
    this.set('current_blocks', this.get('blocks'));
    this.updateToolbox(this.get('current_blocks'));
  }),

  observeWorkspace: Ember.observer('workspace', function() {

    let workspace = this.get('workspaceElement');
    let xml_text = this.get('workspace');

    workspace.clear();

    if (xml_text) {
      let dom = Blockly.Xml.textToDom(xml_text)
      Blockly.Xml.domToWorkspace(dom, workspace);
    }

  }),

  didInsertElement() {

    if (this.get('disablePreloadAudio')) {
      Blockly.WorkspaceSvg.prototype.preloadAudio_ = function() {};
    }

    this.createSection("section_control", "Control");
    this.createSection("section_logic", "Lógica");

    let toolbox = this.createToolbox(this.get("current_blocks"));

    let options = {
       toolbox: toolbox,
       trashcan: this.get("withTrash"),

       collapse: this.get("collapse"),
       comments: this.get("comments"),
       css: this.get("css"),
       disable: this.get("disable"),
       horizontalLayout: this.get("horizontalLayout"),
       maxBlocks: this.get("maxBlocks"),
       rtl: this.get("rtl"),
       media: this.get("media"),
       oneBasedIndex: this.get("oneBasedIndex"),
       readOnly: this.get("readOnly"),
       scrollbars: this.get("scrollbars"),
       sounds: this.get("sounds"),
       toolboxPosition: this.get("toolboxPosition"),
     };

     if (this.get('grid')) {
       options['grid'] = this._get_default_grid();
     }

     if (this.get("withZoom")) {
       options['zoom'] = this._get_default_zoom();
     }

    let blocklyDiv = this.$().find("div")[0];
    let blocklyArea = this.$()[0];

    let workspace = Blockly.inject(blocklyDiv, options);
    this.set('workspaceElement', workspace);

    this.set('blocklyDiv', blocklyDiv);
    this.set('blocklyArea', blocklyArea);

    $(window).bind("resize.blockly", () => {
      this._onresize();
    });

    workspace.addChangeListener(() => {
      this.onUpdate();
      this._onresize();
    });

    this._onresize();
  },

  _get_default_grid() {
    return {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true
    };
  },

  _get_default_zoom() {
    return {
      controls: true,
      wheel: false,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    };
  },

  _onresize() {
    let blocklyDiv = this.get('blocklyDiv');
    let blocklyArea = this.get('blocklyArea');
    let element = blocklyArea;
    let x = 0;
    let y = 0;

    // itera 'hacia arriba' en el dom para conocer el desplazamiento total.
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);

    blocklyDiv.style.left = `${x}px`;
    blocklyDiv.style.top = `${y}px`;
    blocklyDiv.style.width = `${blocklyArea.offsetWidth}px`;
    blocklyDiv.style.height = `${blocklyArea.offsetHeight}px`;
    Blockly.svgResize(this.get('workspaceElement'));
  },

  willDestroyElement() {
    $(window).unbind("resize.blockly");
  },

  onUpdate(event) {
    let xml = Blockly.Xml.workspaceToDom(this.get('workspaceElement'));
    let xml_text = Blockly.Xml.domToText(xml);
    this.sendAction("onChangeWorkspace", xml_text);
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

      if (bloque['category']) {
        toolbox.push(`<category name="${bloque.category}">`);

        bloque.blocks.forEach((bloque_en_categoria) => {
          toolbox.push(`  <block type="${bloque_en_categoria}"></block>`);
        });

        toolbox.push('</category>');
      } else {
        toolbox.push(`<block type="${bloque}"></block>`);
      }
    });


    toolbox.push('</xml>');

    return toolbox.join("\n");
  },

  updateToolbox(bloques) {
    let toolbox = null;

    // Si se envió un string XML, lo inserta directamente
    // como toolbox.
    if (/xml/.test(bloques)) {
      toolbox = bloques;
    } else {
      toolbox = this.createToolbox(this.get("current_blocks"));
    }

    this.get('workspaceElement').updateToolbox(toolbox);
  }
});
