var API_PARENT_VERSION = "1.4.3";
var ex_list = null ;
var ex_looping = 0;
var ex_function = null ;
var ex_arg = null ;
var ex_start = null ;
var EX_MODE_PREVIEW = "preview";
var EX_MODE_TEST = "test";
var EX_MODE_PREGRADE = "sample";
var EX_MODE_POST_TEST = "review";
var EX_MODE_DESIGN = "design";
function ex_get_varByID(A) {
    return $("#" + A).val()
}
function ex_get_varByName(A) {
    return $("input[name=" + A + "]").val()
}
function ex_resize(C, B, A) {
    $("#" + C).css({
        width: "" + B + "px",
        height: "" + A + "px"
    })
}
function ex_startgather(B, A) {
    ex_function = B;
    ex_arg = A
}
function ex_allow_regather() {
    ex_list = null ;
    ex_looping = 0;
    ex_function = null ;
    ex_arg = null ;
    ex_start = null 
}
function ex_gather() {
    if (ex_list == null ) {
        ex_start = (new Date()).getTime();
        ex_looping = 0;
        var C = false;
        ex_list = new Array();
        $(".wk_ex_iframe").each(function() {
            var D = $(this);
            var E = $(this).attr("id");
            var F = new Object();
            try {
                F.state = window.frames[this.name].getState();
                F.statefield = "#" + E + "_state";
                $(F.statefield).val(F.state);
                var theAnswerState = window.frames[this.name].getAnswerState();
    			$('#'+theID+'_astate').val(theAnswerState);
                F.score = window.frames[this.name].getScore();
                F.scorefield = "#" + E + "_eval";
                $(F.scorefield).val(F.score);
                ex_list.push(F)
            } catch (G) {
                if (!C) {
                    C = true;
                    ex_log("failure to implement getState, getScore or the external API correctly")
                }
            }
        })
    }
    if (ex_list.length == 0) {
        ex_list = null ;
        return true
    }
    var B = new Array();
    for (i = 0; i < ex_list.length; i++) {
        var A = $(ex_list[i].statefield).val();
        if (A != ex_list[i].state) {
            B.push(ex_list[i])
        }
    }
    if (B.length == 0) {
        ex_list = B;
        ex_log("finished ex_gather() in " + ((new Date()).getTime() - ex_start) + "ms after " + ex_looping + " loops");
        if (ex_looping > 0) {
            if (ex_function == "backgroundSave") {
                backgroundSave()
            } else {
                if (ex_function == "continueTest") {
                    continueTest(ex_arg)
                } else {
                    if (ex_function == "doExit") {
                        doExit(ex_arg)
                    } else {
                        if (ex_function == "doPregrade") {
                            doPregrade(ex_arg)
                        } else {
                            if (ex_function == "forceSubmission") {
                                forceSubmission()
                            } else {
                                if (ex_function == "eztoChatSave") {
                                    eztoChatSave()
                                }
                            }
                        }
                    }
                }
            }
            ex_function = null ;
            ex_arg = null 
        }
        return true
    }
    ex_looping++;
    if (ex_looping > 120) {
        ex_log("gave up waiting on the DOM in ex_gather() after " + ex_looping + " loops (1 minute) with " + ex_list.length + " externals unvalidated");
        ex_list = new Array();
        if (ex_function == "backgroundSave") {
            backgroundSave()
        } else {
            if (ex_function == "continueTest") {
                continueTest(ex_arg)
            } else {
                if (ex_function == "doExit") {
                    doExit(ex_arg)
                } else {
                    if (ex_function == "doPregrade") {
                        doPregrade(ex_arg)
                    } else {
                        if (ex_function == "forceSubmission") {
                            forceSubmission()
                        } else {
                            if (ex_function == "eztoChatSave") {
                                eztoChatSave()
                            }
                        }
                    }
                }
            }
        }
        ex_function = null ;
        ex_arg = null ;
        return true
    }
    ex_list = B;
    window.setTimeout("ex_gather();", 500);
    return false
}
function ex_log(B) {
    try {
        if (console && console.log) {
            console.log(B)
        }
    } catch (A) {}
}
function extGather() {
    $(".wk_ex_iframe").each(function() {
        var B = $(this);
        var C = $(this).attr("id");
        try {
            var E = window.frames[this.name].getState();
            $("#" + C + "_state").val(E);
            var theAnswerState = window.frames[this.name].getAnswerState();
			$('#'+theID+'_astate').val(theAnswerState);
            var A = window.frames[this.name].getScore();
            $("#" + C + "_eval").val(A)
        } catch (D) {
            ex_log(D.message)
        }
    })
}
function extTestGather() {
    $(".wk_ex_iframe").each(function() {
        var B = $(this);
        var C = $(this).attr("id");
        try {
            //var E = window.frames[this.name].getState();
            //$("#" + C + "_ostate").val(E);
			var qState = window.frames[this.name].getQState();
			$('#'+C+'_oqstate').val(qState);
			
            var cState = window.frames[this.name].getCState();
			$('#'+C+'_ocstate').val(cState);
			
			var rState = window.frames[this.name].getRState();
			$('#'+C+'_orstate').val(rState);
			
            //var A = window.frames[this.name].getScore();
            //$("#" + C + "_eval").val(A)
        } catch (D) {
            if (console && console.log) {
                console.log("failure to implement getState, getScore or the external API correctly")
            } else {
                window.alert("failure to implement getState, getScore or the external API correctly")
            }
        }
    })
}
(function(A) {
    A.fn.replaceTagName = function(B) {
        var D = [];
        for (var C = this.length - 1; 0 <= C; C--) {
            var E = document.createElement(B);
            E.innerHTML = this[C].innerHTML;
            A.each(this[C].attributes, function(G, F) {
                A(E).attr(F.name, F.value)
            });
            A(this[C]).after(E).remove();
            D[C] = E
        }
        return A(D)
    }
})(jQuery);
function extInstantiate(A) {
    $(A).addClass("wk_ex_iframe").replaceTagName("iframe")
}
var EX_SAVE_TIMEOUT = 100;
function ex_trigger_save(C, A) {
    if (C != EX_MODE_TEST) {
        return
    }
    try {
        if (backgroundSave) {
            bgSave = true;
            window.setTimeout(function() {
                backgroundSave();
                ex_allow_regather()
            }, EX_SAVE_TIMEOUT)
        }
        if (console && console.log) {
            console.log("triggering backgroundSave() in " + EX_SAVE_TIMEOUT + "ms")
        } else {
            window.alert("triggering backgroundSave() in " + EX_SAVE_TIMEOUT + "ms")
        }
    } catch (B) {
        if (console && console.log) {
            console.log("error triggering backgroundSave() in ex_trigger_save")
        } else {
            window.alert("error triggering backgroundSave() in ex_trigger_save")
        }
    }
}
function ex_trigger_contact(D, C, B) {
    if (D == EX_MODE_PREGRADE) {
        return
    }
    if (D == EX_MODE_DESIGN) {
        return
    }
    try {
        if (askPublisherAPI) {
            askPublisherAPI(C, B)
        }
    } catch (A) {
        if (console && console.log) {
            console.log("error calling askPublisherAPI() in ex_trigger_contact")
        } else {
            window.alert("error calling askPublisherAPI() in ex_trigger_contact")
        }
    }
}

/*function bind_mouseup_parent(fn){
	$(document).bind('mouseup.tochild', fn);
}
*/
