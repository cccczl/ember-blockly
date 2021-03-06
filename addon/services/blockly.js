import Ember from 'ember';

export default Ember.Service.extend({

  createCustomBlock(name, options) {
    let previousStatement = true;
    let nextStatement = true;
    let colour = 160;

    if (Blockly.Blocks[name]) {
      console.warn(`Redefiniendo el bloque ${name}`);
    }

    Blockly.Blocks[name] = {
      init: function() {
        this.jsonInit(options);
      }
    };

    if (!Blockly.MyLanguage) {
      Blockly.MyLanguage = Blockly.JavaScript;
    }

    if (options.code) {
      Blockly.MyLanguage[name] = function(block) {
        let variables = options.code.match(/\$(\w+)/g);
        let code = options.code;

        if (variables) {
          variables.forEach((v) => {
            let regex = new RegExp('\\' + v, "g");
            let variable_name = v.slice(1);

            var variable_object = Blockly.MyLanguage.valueToCode(block, variable_name) || null;

            code = code.replace(regex, variable_object);
          });
        }

        return code;
      };
    }

  },

  createCustomBlockWithHelper(name, options) {
    let color = goog.color.hexToHsv('#4a6cd4');

    this.createCustomBlock(name, {
      message0: `%1 ${options.descripcion}`,
      colour: color,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `iconos/${options.icono}`,
          "width": 16,
          "height": 16,
          "alt": "*"
        }
      ],
      code: `hacer(actor_id, "${options.comportamiento}", ${options.argumentos});`,
    });
  }
});
