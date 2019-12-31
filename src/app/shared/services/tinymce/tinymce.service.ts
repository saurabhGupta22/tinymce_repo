import { Injectable } from '@angular/core';
import { CONFIG, image_config, media_config } from './../../constants/tinymce.config';
import { ERROR_MESSAGE } from '../../constants/error.constants';
import * as $ from 'jquery';

declare var tinymce: any;
let mt, cb, mt2, cb2;

@Injectable({
  providedIn: 'root'
})
export class TinymceService {
  count: 0;

  constructor() { }

  /*
  to catch the reference error
  */

  get() {

    try {
      if (tinymce) {
        console.log('successfully loaded');
        this.tinymceInit();
      }
    } catch (e) {
      if (e instanceof ReferenceError) {
        console.log('Inside error block');
        this.count++;
        if (this.count < 10) {
          this.waitForTinymceToLoad();
        }
      }
    }
  }

  /*
  Function that initializes tinymce
  */
  tinymceInit() {
    let hasPasteError = false;

    const imageFilePicker = function (callback, value, meta) {
      mt = meta;
      cb = callback;

      tinymce.activeEditor.windowManager.openUrl({
        ...image_config

      });
    };

    const mediaFilePicker = function (callback, value, meta) {
      mt2 = meta;
      cb2 = callback;

      tinymce.activeEditor.windowManager.openUrl({
        ...media_config
      });
    };


    tinymce.init({
      ...CONFIG,

      setup: function (editor) {
        var allowedKeys = [8, 37, 38, 39, 40, 46];
        editor.on('keydown', function (e) {
          tinymceUpdateCharCounter(editor);
          if (allowedKeys.indexOf(e.keyCode) != -1) return true;
          if (tinymce_getContentLength() + 1 > this.settings.max_chars) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          return true;
        });


        editor.addCommand('imageCommand1', function (ui, value) {
          if (mt.filetype === 'image') {
            cb(value.imageValue);
          }
        });
        editor.addCommand('mediaCommand', function (ui, value) {
          if (mt2.filetype === 'media') {
            cb2(value.videoValue);
          }
        });

      },
      paste_preprocess: function (plugin, args) {
        var editor = tinymce.get(tinymce.activeEditor.id);
        var len = editor.contentDocument.body.innerText.length;
        var args_len = args.content.length;
        if (len + args_len > editor.settings.max_chars) {
          hasPasteError = true;
          $('.char_count')
            .text(ERROR_MESSAGE);
          args.content = '';
        }
      },
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
        if (meta.filetype === 'image') {
          imageFilePicker(callback, value, meta);
        }
        if (meta.filetype === 'media') {
          mediaFilePicker(callback, value, meta);
        }
      },

      init_instance_callback: function (editor) {
        console.log('Editor: ' + editor.id + ' is now initialized.');
        return true;
      }
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
        console.log(charCount)
        const totalChar = el.settings.max_chars - charCount;
        if (totalChar == 0) {
          $('.char_count')
            .text(ERROR_MESSAGE);
        }
        else if (totalChar > 0) {
          if (!hasPasteError) {
            $('.char_count')
              .text('');
          }

        }
      }, 400);

      hasPasteError = false;
    }
  }

  /*
  the function below will call the get function until the counter ends
  */

  waitForTinymceToLoad() {
    this.get();
  }

}
