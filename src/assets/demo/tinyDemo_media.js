window.addEventListener('message', function (event) {
    console.log(event.data)
    if (event.data.mceAction === 'customInsertAndClose3') {
        var value = {
            videoValue: document.getElementById('videoselect').value,
            audioValue: document.getElementById('audioselect').value
        };
        window.parent.postMessage({
            mceAction: 'execCommand',
            cmd: 'mediaCommand',
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

var preview = document.createElement("VIDEO")

function previewVideo(){
    var source = document.getElementById('videoselect').value;
    preview.setAttribute("controls", "controls");
    preview.setAttribute("src", source+"#t=0,6");
    preview.setAttribute("width", "200");
    preview.setAttribute("height", "200")
    document.getElementById("preview").appendChild(preview);

}
