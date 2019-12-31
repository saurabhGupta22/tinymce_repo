export const CONFIG = {
  max_chars: 10,
  menubar: false,
  branding: false,
  statusbar: false,
  selector: 'textarea.mytextarea',
  height: '132px',
  width: '598px',
  plugins: ' textcolor colorpicker advlist lists link  image media charmap wordcount paste ',
  toolbar: 'bold | italic | underline | backcolor | bullist  | link  | image | media | charmap | wiris|valueButton variableButton',
  mode: 'specific_textareas',
  editor_selector: 'mceEditor',
  autoresize: false,
  file_picker_types: ' file image media',
  image_advtav: true,
  paste_data_images: true,
  automatic_uploads: true,
  media_live_embeds: true,

};

export const image_config = {
  title: 'Value and Variable',
  url: '../../../../assets/demo/tinyDemo_filepicker.html',
  buttons: [
    {
      type: 'custom',
      name: 'insert-and-close',
      text: 'Insert and Close',
      primary: true,
      align: 'end'
    },
    {
      type: 'cancel',
      name: 'cancel',
      text: 'Close Dialog'
    }

  ],

  height: 350,
  width: 500,

  onAction: function (instance, trigger) {
    instance.sendMessage({
      mceAction: 'customInsertAndClose2'
    });
  }
}

export const media_config = {
  title: 'Value and Variable',
  url: '../../../../assets/demo/tinyDemo_media.html',
  buttons: [
    {
      type: 'custom',
      name: 'insert-and-close',
      text: 'Insert and Close',
      primary: true,
      align: 'end'
    },
    {
      type: 'cancel',
      name: 'cancel',
      text: 'Close Dialog'
    }

  ],

  height: 350,
  width: 500,

  onAction: function (instance, trigger) {
    instance.sendMessage({
      mceAction: 'customInsertAndClose3'
    });
  },
}
