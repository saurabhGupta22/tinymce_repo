window.addEventListener('message', function (event) {
    console.log(event.data)
    var args = top.tinymce.activeEditor.windowManager.getParams();
    if (args.mceAction === 'customInsertAndClose') {
        var value = {
            variableA: this.document.getElementById('variableA').textContent,
            valueA: this.document.getElementById('valueA').textContent,
        };
        window.parent.postMessage({
            mceAction: 'execCommand',
            cmd: 'iframeCommand',
            value
        }, origin);

        window.parent.postMessage({
            mceAction: 'close'
        }, origin);
    }

});
window.onload = function () {
    document.getElementById('showMeA').addEventListener('click', function (event) {
        var value = {
            variableA: document.getElementById('variableA').textContent,
            valueA: document.getElementById('valueA').textContent
        };
        var args = top.tinymce.activeEditor.windowManager.getParams();
        top.tinymce.activeEditor.execCommand('iframeCommand',value);
        top.tinymce.activeEditor.windowManager.close();

    });

    document.getElementById('showMeB').addEventListener('click', function (event) {
        var value = {
            variableA: document.getElementById('variableB').textContent,
            valueA: document.getElementById('valueB').textContent
        };

        top.tinymce.activeEditor.execCommand('iframeCommand',value);
        top.tinymce.activeEditor.windowManager.close();

    });

    document.getElementById('showMeC').addEventListener('click', function (event) {
        var value = {
            variableA: document.getElementById('variableC').textContent,
            valueA: document.getElementById('valueC').textContent
        };
        top.tinymce.activeEditor.execCommand('iframeCommand',value);
        top.tinymce.activeEditor.windowManager.close();


    });


}

