import { Injectable } from '@angular/core';
import * as $ from 'jquery';
declare var tinymce;
var ed;


@Injectable({
  providedIn: 'root'
})

export class TinymceSService {

  constructor() { }

  doIt() {


    var mediaFilePicker = function (callback, value, meta) {

      tinymce.activeEditor.windowManager.openUrl({

        title: 'Image And Media',
        url: '../assets/demo/imageAndMedia.html',
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
            mceAction: "customInsertAndClose3"
          });
        },
      })

      // command to insert the image URL in the image tool source textbox
      ed.addCommand("mediaCommand", function (ui, value) {

        if (meta.filetype == 'media') {
          callback(value.Url);
        }
        if(meta.filetype == 'image'){
          if(value.type == 'image')
          callback(value.Url)
        }

      })
    };

    tinymce.init({
      max_chars: 10000,
      selector: 'textarea.urldialog',
      height: 500,
      menubar: false,
      statusbar: false,
      plugins: ['adv image preview  wordcount media paste imagetools'],

      toolbar1: 'undo redo |bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media ',
      toolbar2: 'print preview | forecolor backcolor emoticons',
      toolbar3: 'variablePopUp valueButton variableButton',


      file_picker_types: " file image media",

      media_url_resolver: function (data, resolve/*, reject*/) {
        if (data.url.indexOf('../../assets/demo/assets/resources/') !== -1) {
          var embedHtml = '<span style="color: #bdc3c7; " data-mce-style="color: #bdc3c7;"><span class="mce-preview-object mce-object-iframe" style="border:none;" contenteditable="false" data-mce-object="iframe" data-mce-p-frameborder="0" data-mce-p-src="' + data.url + '" data-mce-selected="2"><iframe style="border:none;" src="' + data.url + '" width="400" height="400" frameborder="0"></iframe><span class="mce-shim"></span></span></span>';
          resolve({ html: embedHtml });
        }
        else if (data.url.indexOf('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/') !== -1) {
          var embedHtml = '<span style="color: #bdc3c7; " data-mce-style="color: #bdc3c7;"><span class="mce-preview-object mce-object-iframe" style="border:none;" contenteditable="false" data-mce-object="iframe" data-mce-p-frameborder="0" data-mce-p-src="' + data.url + '" data-mce-selected="2"><iframe style="border:none;" src="' + data.url + '" width="400" height="400" frameborder="0"></iframe><span class="mce-shim"></span></span></span>';
          resolve({ html: embedHtml });
        }
        else {
          resolve({ html: '' });
        }
      },

      file_picker_callback: function (callback, value, meta) {
        if (meta.filetype == 'image') {
          mediaFilePicker(callback, value, meta);
        }
        if (meta.filetype == 'media') {
          mediaFilePicker(callback, value, meta);
        }

      },
      media_live_embeds: true,


      setup: function (editor) {
        ed = editor;
        var printV: boolean = true
        var printVV: boolean = false
        var allowedKeys = [8, 37, 38, 39, 40, 46];
        ed.on('keydown', function (e) {
          tinymceUpdateCharCounter(ed);
          if (allowedKeys.indexOf(e.keyCode) != -1) return true;
          if (tinymce_getContentLength() + 1 > this.settings.max_chars) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          return true;
        });

        editor.ui.registry.addButton('variablePopUp',{
          icon:'new-document',
          onAction: () => {
            editor.windowManager.openUrl({

              title: 'Value and Variable',
              url: '../assets/demo/tinyDemo.html',
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
                instance.sendMessage({
                  mceAction: "customInsertAndClose"
                });
              }
            })

          }
        })

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
    function tinymce_getContentLength() {
      return tinymce.get(tinymce.activeEditor.id).contentDocument.body.innerText.length;
    }

    function tinymceUpdateCharCounter(el) {
      setTimeout(() => {
        let charCount = 0;
        let wordcount;
        wordcount = tinymce.activeEditor.plugins.wordcount;
        if (wordcount) {
          charCount = wordcount.body.getCharacterCount();
        }
        const maxch = el.settings.max_chars
        const totalChar = el.settings.max_chars - charCount;

        if (totalChar >= 0) {
          $('.char_count')
            .text(totalChar + '/' + maxch);
        }
      }, 400);
    }

  }


}