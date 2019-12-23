

window.addEventListener('message', function (event) {
    if (event.data.mceAction === 'customInsertAndClose2') {
        var value = {
            imageValue: document.getElementById('imageselect').value
        };
        window.parent.postMessage({
            mceAction: 'execCommand',
            cmd: 'imageCommand1',
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

        window.parent.postMessage({
            mceAction: 'execCommand',
            cmd: 'iframeCommand',
            value
        }, origin);

        window.parent.postMessage({
            mceAction: 'close'
        }, origin);

    });

    document.getElementById('showMeB').addEventListener('click', function (event) {
        var value = {
            variableA: document.getElementById('variableB').textContent,
            valueA: document.getElementById('valueB').textContent
        };

        window.parent.postMessage({
            mceAction: 'execCommand',
            cmd: 'iframeCommand',
            value
        }, origin);

        window.parent.postMessage({
            mceAction: 'close'
        }, origin);

    });

    document.getElementById('showMeC').addEventListener('click', function (event) {
        var value = {
            variableA: document.getElementById('variableC').textContent,
            valueA: document.getElementById('valueC').textContent
        };

        window.parent.postMessage({
            mceAction: 'execCommand',
            cmd: 'iframeCommand',
            value
        }, origin);

        window.parent.postMessage({
            mceAction: 'close'
        }, origin);

    });



}

var preview = document.createElement("IMG");

function showPreview() {
    var source = document.getElementById('imageselect').value;
    preview.setAttribute("src", source);
    preview.setAttribute("width", "100");
    preview.setAttribute("height", "100")
    document.getElementById("preview").appendChild(preview);

}