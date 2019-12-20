import { Injectable } from '@angular/core';

;

declare var tinymce;
var demoUrl = "./assets/demo/wordcloud.png";

@Injectable({
  providedIn: 'root'
})

export class TinymceSService {


  constructor() { }


  doIt() {

    var imageFilePicker = function (callback, value1, meta) {

      tinymce.activeEditor.windowManager.openUrl({

        title: 'Value and Variable',
        url: '../assets/demo/tinyDemo_filepicker.html',
        buttons: [{
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
          console.log(instance);
          instance.sendMessage({
            mceAction: "customInsertAndClose2"
          });
          

        },
      })
      
      console.log('inside file picker');

    };
    // tinymce.wirisUrl = 'https://wiris-tinymce-dev.mheducation.com/4.8.0.1377';

    tinymce.init({


      selector: 'textarea.urldialog',
      height: 500,

      // external_plugins: { tiny_mce_wiris: tinymce.wirisUrl + '/ui/plugins/tiny_mce_wiris/plugin.js' },
      
      plugins: ['wordcount advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools'],
      toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      toolbar2: 'print preview | forecolor backcolor emoticons',


      toolbar3: 'valueButton variableButton',

      image_advtav: true,
      paste_data_images: true,
      automatic_uploads: true,

      setup: function (editor) {
        var printV: boolean = true
        var printVV: boolean = false


        // editor.ui.registry.addButton('urldialog', {
        //   icon: 'new-document',

        //   onAction: () => {
        //     editor.windowManager.openUrl({

        //       title: 'Value and Variable',
        //       url: '../assets/demo/tinyDemo.html',
        //       buttons: [{
        //         type: "custom",
        //         name: "insert-and-close",
        //         text: "Insert and Close",
        //         primary: true,
        //         align: "end"
        //       },
        //       {
        //         type: "cancel",
        //         name: "cancel",
        //         text: "Close Dialog"
        //       }

        //       ],

        //       height: 350,
        //       width: 500,
        //       onAction: function (instance, trigger) {
        //         instance.sendMessage({
        //           mceAction: "customInsertAndClose"
        //         });
        //       }
        //     })

        //   },
        // });


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


        editor.addCommand("imageCommand", function (ui, value) {
          console.log(value);
          tinymce.activeEditor.insertContent('<img alt="Smiley face" height="100" width="100" src="' + value.imageValue + '"/>');
          // tinymce.execCommand('mceInsertContent', false, '<img  height="42" width="42" src="' + value + '"/>');
          tinymce.activeEditor.insertContent('<video width="400" controls><source src="' + value.videoValue + '" type="video/mp4"></video>')
          tinymce.activeEditor.insertContent('<audio controls><source src="' + value.audioValue + '" type="audio/mpeg"></audio>')
        })


        editor.addCommand("imageCommand1", function (ui, value) {
          demoUrl = value.imageValue;
          console.log(value.imageValue);
          console.log('inside imageCommand1')
          
          
     
          
        })



        editor.ui.registry.addButton('valueButton', {
          text: 'V',
          onAction: (api) => {
            printV = true
            printVV = false

          }
        });


        editor.ui.registry.addButton('variableButton', {
          text: 'V.V',
          onAction: (api) => {
            printVV = true
            printV = false
          }
        })

      },
      file_picker_callback: function (callback, value, meta) {
        imageFilePicker(callback, value, meta);
        
      }
    });


  }

}
