import { Injectable } from '@angular/core';
declare var tinymce;
let ed;
@Injectable({
  providedIn: 'root'
})
export class TinymceService {

  constructor() { }

  doIt() {
    let customMediaPopUp = function(editor) {
      editor.windowManager.open({

        title: 'Value and Variable',
        url: '../assets/demo/imageAndMedia.html',
        buttons: [{
          type: 'button',
          name: 'insert-and-close',
          text: 'Insert and Close',
          primary: true,
          align: 'end'
        },
        {
          type: 'button',
          name: 'cancel',
          text: 'Close Dialog',
          onclick(e) {editor.windowManager.close(); }
        }

        ],

        height: 350,
        width: 500,
      }, {
        mceAction: 'customInsertAndClose'
      });
    };
    tinymce.init({
      max_chars: 1000,
      selector: 'textarea.urldialog',
      height: 500,
      menubar: true,
      statusbar: false,
      plugins: ['customMedia preview'],
      // external_plugins:{
      //   'customMedia': '../customMediaPopup/plugin.min.js'
      // },
      toolbar : 'undo redo |bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent customMedia preview',
      file_picker_types: 'file image media',
      media_live_embeds: true,
      setup(editor: any) {
        ed = editor;

      }
    });

    tinymce.PluginManager.add('customMedia', function(editor, url) {
      editor.addButton('customMedia', {
        icon: 'media',
        onClick: () => {
          customMediaPopUp(editor);

        }
      });

      // editor.addCommand('mediaCommand', (value) => {
      //   if (value.type === 'image') {
      //     insertImage(value);
      //   }
      //   if (value.type === 'video') {
      //     insertVideo(value);
      //   }
      //   if (value.type === 'audio') {
      //    insertAudio(value);
      //   }
      // });
      // function insertImage(value) {
      //   tinymce.activeEditor.insertContent('<span><img alt="Smiley face" height="100" width="100" src="' + value.Url + '"/></span>&nbsp;');
      // }
      // function insertVideo(value) {
      //   tinymce.activeEditor.insertContent('<span><video width="600" controls><source src="' + value.Url + '" type="video/mp4"></video></span>&nbsp;');
      // }
      // function insertAudio(value) {
      //   tinymce.activeEditor.insertContent('<audio controls><source src="' + value.Url + '" type="audio/mpeg"></audio>&nbsp;');
      // }
    });
  }
}
