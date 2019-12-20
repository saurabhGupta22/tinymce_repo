
 window.addEventListener('message', function (event) {
    console.log(event.data)
    if (event.data.mceAction === 'customInsertAndClose') {
        var value = {
            variableA: this.document.getElementById('variableA').textContent,
            valueA: this.document.getElementById('valueA').textContent
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
document.getElementById('showMe').addEventListener('click', function (event) {
    var value = {
        variableA: this.document.getElementById('variableA').textContent,
        valueA: this.document.getElementById('valueA').textContent
    };

    window.parent.postMessage({
        mceAction: 'execCommand',
        cmd: 'iframeCommand',
        value
    }, origin);

});



// showMeA = function () {
//     console.log(document.getElementById('valueA').textContent);
//     console.log(document.getElementById('variableA').textContent);
//     return 'dfsdf';
// }
// showMeB = function () {
//     console.log(document.getElementById('valueB').textContent);
//     console.log(document.getElementById('variableB').textContent);
// }
// showMeC = function () {
//     console.log(document.getElementById('valueC').textContent);
//     console.log(document.getElementById('variableC').textContent);
// }
