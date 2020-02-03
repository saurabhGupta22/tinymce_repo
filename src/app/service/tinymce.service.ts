import { Injectable } from '@angular/core';
declare var tinymce;
import * as $ from 'jquery';
@Injectable({
  providedIn: 'root'
})
export class TinymceService {

  constructor() { }

  doIt() {

    var ed;
    var createHtml;
    var register;
    var ecoMapping;
    tinymce.init({
      selector: 'textarea.urldialog',
      height: 500,
      menubar: true,
      statusbar: false,
      plugins: ['image example'],
      toolbar: 'undo redo | bold italic image example',
      media_live_embeds: true,
      setup(editor: any) {
        ed = editor;
      }
    });

    function Dialog(editor) {

      function open() {
        showDialog([{
          text: 'airplane',
          value: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'
        }, {
          text: 'rabbit',
          value: 'https://homepages.cae.wisc.edu/~ece533/images/arctichare.png'
        }, {
          text: 'gif',
          value: 'https://media.giphy.com/media/gw3IWyGkC0rsazTi/giphy.gif'
        }]);
      }

      function showDialog(imageList) {
        var win = ed.windowManager.open({
          title: 'Images',
          autoScroll: false,
          width: 500,
          height: 500,
          body: [
            {
              type: 'container', html: ecoMapping.createHtml(imageList)
            }
          ],
          buttons: [{
            text: 'Close',
            onClick: 'close'
          }]
        });

        var imageDivs = document.querySelectorAll('.mce-eco-image');
        for (var i = 0; i < imageDivs.length; i++) {
          imageDivs[i].addEventListener('click', function () {
            // ed.insertContent('<span><img alt="Smiley face" height="100" width="100" src="' + this.getAttribute('src') + '"/></span>&nbsp;');
            var textbox = document.querySelectorAll('.mce-textbox');
            console.log(textbox[0]);
            textbox[0].textContent = this.getAttribute('src');
            var someid = textbox[0].id;
            $('#' + someid).val(this.getAttribute('src'));
            win.close();
          });
        }
      }

      return { open: open }
    }


    var generalFormItems = [
      {
        type: 'container',
        label: 'Source',
        layout: 'flex',
        direction: 'row',
        spacing: 5,
        items: [
          {
            name: 'source',
            type: 'textbox',
            label: 'source',
            autofocus: true,
          },
          {
            name: 'button',
            type: 'button',
            label: 'button',
            text: 'Upload',
            onclick: Dialog(ed).open
          },
        ]

      },

      { name: 'title', type: 'textbox', label: 'Image Title' },
      { name: 'alt', type: 'textbox', label: 'Alternate text' },
      { name: 'data-mce-p-longdesc', type: 'textbox', label: 'Long Description', multiline: true },
      {
        type: 'container',
        label: 'Dimensions',
        layout: 'flex',
        direction: 'row',
        align: 'center',
        spacing: 5,
        items: [
          { name: 'width', type: 'textbox', maxLength: 5, size: 3, ariaLabel: 'Width' },
          { type: 'label', text: 'x' },
          { name: 'height', type: 'textbox', maxLength: 5, size: 3, ariaLabel: 'Height' },
          { name: 'constrain', type: 'checkbox', checked: true, text: 'Constrain proportions' }
        ]
      }
    ];

    tinymce.PluginManager.add('example', function (editor, url) {
      editor.addButton('example', {
        text: 'My Button',
        icon: false,
        onclick: function () {
          editor.windowManager.open({
            title: 'Example PLugin',
            body: generalFormItems,
            onsubmit: function (e) {
              editor.insertContent('<span><img alt="Smiley face" height='+e.data.height+' width='+e.data.width+' src="' + e.data.source + '"/></span>&nbsp;');
            }
          })
        }
      });
    })






    tinymce.PluginManager.add('image', function (editor, url) {

      createHtml = function (imageList) {
        var contentDiv = document.createElement('div');
        contentDiv.setAttribute('class', 'mce-eco-panel-content');
        for (var imageIndex = 0; imageIndex < imageList.length; imageIndex++) {
          var title = imageList[imageIndex].text;
          var imageDiv = document.createElement('div');
          imageDiv.setAttribute('class', 'mce-eco-image-cell');
          var image = document.createElement('img');
          var imageTitle = document.createElement('p');
          imageTitle.setAttribute('class', 'mce-eco-image-title');
          imageTitle.innerHTML = title;
          image.setAttribute('src', imageList[imageIndex].value);
          image.setAttribute('class', 'mce-eco-image');
          image.setAttribute('data-id', title.split(' ').join('-'));
          imageDiv.appendChild(image);
          imageDiv.appendChild(imageTitle);
          contentDiv.appendChild(imageDiv);
        }
        return contentDiv.outerHTML;
      };

      register = function (editor) {
        // Add a button that opens a window
        editor.addButton('image', {
          text: '',
          icon: 'image',
          onclick: Dialog(editor).open
        });

        // Adds a menu item to the tools menu
        editor.addMenuItem('image', {
          text: 'EcoImages',
          context: 'insert',
          onclick: Dialog(editor).open
        });

        //Include Plugin Css
        editor.on('init', function () {
          var cssLink = editor.dom.create('link', {
            rel: 'stylesheet',
            href: '../assets/assets/style.css'
          });
          document.getElementsByTagName('head')[0].appendChild(cssLink);
        });
      };

      ecoMapping = {
        createHtml: createHtml,
        register: register
      };

      function Dialog(editor) {

        function open() {
          showDialog([{
            text: 'airplane',
            value: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'
          }, {
            text: 'rabbit',
            value: 'https://homepages.cae.wisc.edu/~ece533/images/arctichare.png'
          }, {
            text: 'gif',
            value: 'https://media.giphy.com/media/gw3IWyGkC0rsazTi/giphy.gif'
          }]);
        }

        function showDialog(imageList) {
          var win = editor.windowManager.open({
            title: 'Images',
            autoScroll: false,
            width: 500,
            height: 500,
            body: [
              {
                type: 'container', html: ecoMapping.createHtml(imageList)
              }
            ],
            buttons: [{
              text: 'Close',
              onClick: 'close'
            }]
          });

          var imageDivs = document.querySelectorAll('.mce-eco-image');
          for (var i = 0; i < imageDivs.length; i++) {
            imageDivs[i].addEventListener('click', function () {
              editor.insertContent('<span><img alt="Smiley face" height="100" width="100" src="' + this.getAttribute('src') + '"/></span>&nbsp;');
              win.close();
            });
          }
        }

        return { open: open }
      }

      register(editor);

      return {
        getMetadata: function () {
          return {
            title: "EcoImages",
            url: "http://www.ecologic.ch"
          };
        }
      };
    });
  }
}
