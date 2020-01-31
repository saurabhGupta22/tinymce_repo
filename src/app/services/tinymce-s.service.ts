import { Injectable } from '@angular/core';
import * as $ from 'jquery';
declare var tinymce;
let ed;


@Injectable({
  providedIn: 'root'
})

export class TinymceSService {

  constructor() { }

  doIt() {


    let mediaFilePicker = function(callback, value, meta) {

      tinymce.activeEditor.windowManager.open({

        title: 'Image And Media',
        url: '../assets/demo/imageAndMedia.html',
        buttons: [
          {
            type: 'button',
            name: 'insert-and-close',
            text: 'Insert and Close',
            primary: true,
            align: 'end'
          },
          {
            type: 'button',
            name: 'cancel',
            text: 'Close Dialog'
          }

        ],

        height: 350,
        width: 500,
      },{
      mceAction: 'customInsertAndClose3'});

      // command to insert the image URL in the image tool source textbox
      ed.addCommand('mediaCommand', function(value) {

        if (meta.filetype === 'media') {
          callback(value.Url);
        }
        if (meta.filetype === 'image') {
          if (value.type === 'image') {
          callback(value.Url);
          }
        }

      });
    };

    tinymce.init({
      max_chars: 10000,
      selector: 'textarea.urldialog',
      height: 500,
      menubar: false,
      statusbar: false,
      plugins: ['image preview  wordcount media paste imagetools'],

      toolbar1: 'undo redo |bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media preview',
      toolbar2: 'variablePopUp valueButton variableButton',


      file_picker_types: ' file image media',

      media_url_resolver (data, resolve/*, reject*/) {
        if (data.url.indexOf('../../assets/demo/assets/resources/') !== -1) {
          let embedHtml = '<span style="color: #bdc3c7; " data-mce-style="color: #bdc3c7;"><span class="mce-preview-object mce-object-iframe" style="border:none;" contenteditable="false" data-mce-object="iframe" data-mce-p-frameborder="0" data-mce-p-src="' + data.url + '" data-mce-selected="2"><iframe style="border:none;" src="' + data.url + '" width="400" height="400" frameborder="0"></iframe><span class="mce-shim"></span></span></span>';
          resolve({ html: embedHtml });
        } else if (data.url.indexOf('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/') !== -1) {
          let embedHtml = '<span style="color: #bdc3c7; " data-mce-style="color: #bdc3c7;"><span class="mce-preview-object mce-object-iframe" style="border:none;" contenteditable="false" data-mce-object="iframe" data-mce-p-frameborder="0" data-mce-p-src="' + data.url + '" data-mce-selected="2"><iframe style="border:none;" src="' + data.url + '" width="400" height="400" frameborder="0"></iframe><span class="mce-shim"></span></span></span>';
          resolve({ html: embedHtml });
        } else {
          resolve({ html: '' });
        }
      },

      file_picker_callback (callback, value, meta) {
        if (meta.filetype === 'image') {
          mediaFilePicker(callback, value, meta);
        }
        if (meta.filetype === 'media') {
          mediaFilePicker(callback, value, meta);
        }

      },
      media_live_embeds: true,


      setup (editor) {
        ed = editor;
        let printV = true;
        let printVV = false;

        editor.addButton('variablePopUp', {
          icon: 'media',
          onClick: () => {
            editor.windowManager.open({

              title: 'Value and Variable',
              url: '../assets/demo/tinyDemo.html',
              buttons: [{
                type   : 'button',
                name: 'insert-and-close',
                text: 'Insert and Close',
                primary: true,
                align: 'end'
              },
              {
                type   : 'button',
                name: 'cancel',
                text: 'Close Dialog'
              }

              ],

              height: 350,
              width: 500,
            },{
              mceAction: 'customInsertAndClose'
            });

          }
        });

        editor.addCommand('iframeCommand', function( value) {

          if (printV === true) {
            editor.insertContent(
              `${value.valueA} ${value.variableA}`
            );
          }
          if (printVV === true) {
            editor.insertContent(
              `~${value.valueA} ${value.variableA}~`
            );
          }
        });

        // adding custom tool button in tinymce editor
        editor.addButton('valueButton', {
          text: 'V',
          onClick: () => {
            printV = true;
            printVV = false;

          }
        });

        // adding custom tool button in tinymce editor
        editor.addButton('variableButton', {
          text: 'V.V',
          onClick: () => {
            printVV = true;
            printV = false;
          }
        });

      },
    });

  }


}
