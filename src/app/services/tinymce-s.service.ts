import { Injectable } from '@angular/core';

declare var tinymce;
var ed;

@Injectable({
  providedIn: 'root'
})

export class TinymceSService {

  constructor() { }

  doIt() {

    // custome file picker that will open an external HTMl file
    var imageFilePicker = function (callback, value, meta) {

      tinymce.activeEditor.windowManager.openUrl({

        title: 'Value and Variable',
        url: '../assets/demo/tinyDemo_filepicker.html',
        buttons: [
          {
            type: "custom",
            name: "insert-and-close",
            text: "Insert and Close",
            primary: true,
            align: "end"
          },
          {
            type: "cancel",
            name: "cancel",
            text: "Close Dialog"
          }

        ],

        height: 350,
        width: 500,

        onAction: function (instance, trigger) {
          instance.sendMessage({
            mceAction: "customInsertAndClose2"
          });
        },
      })

      // command to insert the image URL in the image tool source textbox
      ed.addCommand("imageCommand1", function (ui, value) {

        if (meta.filetype == 'image') {
          callback(value.imageValue);
        }
      })
    };

    // tinymce.wirisUrl = 'https://wiris-tinymce-dev.mheducation.com/4.8.0.1377';

    // tinymce initialization
    tinymce.init({
      selector: 'textarea.urldialog',
      height: 500,
      menubar: false,
      statusbar: false,

      // external_plugins: { tiny_mce_wiris: tinymce.wirisUrl + '/ui/plugins/tiny_mce_wiris/plugin.js' },

      plugins: ['wordcount advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools'],

      toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      toolbar2: 'print preview | forecolor backcolor emoticons',
      toolbar3: 'valueButton variableButton',

      file_picker_types: "image",

      file_picker_callback: function (callback, value, meta) {
        imageFilePicker(callback, value, meta);
      },

      image_advtav: true,
      paste_data_images: true,
      automatic_uploads: true,

      setup: function (editor) {
        ed = editor;
        var printV: boolean = true
        var printVV: boolean = false

        editor.addCommand("iframeCommand", function (ui, value) {

          if (printV === true) {
            editor.insertContent(
              `${value.valueA} ${value.variableA}`
            )
          }
          if (printVV === true) {
            editor.insertContent(
              `~${value.valueA} ${value.variableA}~`
            )
          }
        })

        // adding custom tool button in tinymce editor
        editor.ui.registry.addButton('valueButton', {
          text: 'V',
          onAction: () => {
            printV = true
            printVV = false

          }
        });

        // adding custom tool button in tinymce editor
        editor.ui.registry.addButton('variableButton', {
          text: 'V.V',
          onAction: () => {
            printVV = true
            printV = false
          }
        })

      },
    });
  }
}