var MODE_PREVIEW = "preview";
var MODE_TEST = "test";
var MODE_PREGRADE = "sample";
var MODE_POST_TEST = "review";
var MODE_DESIGN = "design";
var ez_id = "";
var ez_qid = "";
var ez_mode = "";
var ez_state = "";
var ez_astate = "";
var ez_randoms = [];
var ez_mediaurls = [];
var ez_mediabase = "";
var dName = document.domain;
if ((dName.indexOf(".com") > -1) && (dName.indexOf(".") > -1)) {
    var temp = dName.split(".");
    dName = temp[temp.length - 2] + "." + temp[temp.length - 1]
}
document.domain = dName;
var EZ = {
    API_VERSION: "1.4.3",
    MODE_PREVIEW: "preview",
    MODE_TEST: "test",
    MODE_PREGRADE: "sample",
    MODE_POST_TEST: "review",
    MODE_DESIGN: "design",
    id: "",
    qid: "",
    instanceid: "",
    mode: "",
    state: "",
	qstate: "",
	cstate: "",
	rstate: "",
    randoms: [],
    mediaUrls: [],
    mediaBase: "",
    debug: false,
    dcr: "=;()_&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    ncr: "aeiouy0123QRST67JKEFGH45=MN;pqrs(fgh)lmnvwx89_jk&bcdtzABCDILXYZOPUVW",
    getParentVarByID: function(B) {
        var A = "";
        try {
            if (parent.ex_get_varByID) {
                A = parent.ex_get_varByID(B)
            } else {
                this.log("EZ.getParentVarByID() - no ex_get_varByID in parent")
            }
        } catch (C) {
            this.log("EZ.getParentVarByID() - exception " + C)
        }
        return A
    },
    getParentVarByName: function(B) {
        var A = "";
        try {
            if (parent.ex_get_varByName) {
                A = parent.ex_get_varByID(B)
            } else {
                this.log("EZ.getParentVarByName() - no ex_get_varByName in parent")
            }
        } catch (C) {
            this.log("EZ.getParentVarByName() - exception " + C)
        }
        return A
    },
    log: function(A) {
        if (this.debug) {
            if (console && console.log) {
                console.log(A)
            } else {
                window.status = A
            }
        }
    },
    error: function(A) {
        if (this.debug) {
            if (console && console.log) {
                console.log(A)
            } else {
                window.alert(A)
            }
        }
    },
    init: function() {
        this.log("EZ.init()");
        this.id = window.name;
        if (this.id != "") {
            var A = this.id.split("_");
            this.qid = A[0] + "_" + A[1];
            this.mode = this.getParentVarByID(this.id + "_mode");
            this.state = this.getParentVarByID(this.id + "_state");
			
			this.qstate = this.getParentVarByID(this.id + "_qstate");
			this.cstate = this.getParentVarByID(this.id + "_cstate");
			this.rstate = this.getParentVarByID(this.id + "_rstate");
			
            this.instanceid = this.getParentVarByID(this.id + "_instanceid");
            this.getOnDemandSaveInterval();
            this.loadRandoms();
            this.randomSubstitutions();
            this.loadMediaReferences();
			this.bind_mouseup_parent();
            try {
                //setState(this.state, this.astate);
				setSeparateState(this.qstate, this.cstate, this.rstate);
            } catch (B) {
                this.error("Error calling external setState method; is it implemented?" + B)
            }
        }
        this.log("  id         : " + this.id);
        this.log("  qid        : " + this.qid);
        this.log("  instanceid : " + this.qid);
        this.log("  mode       : " + this.mode);
        this.log("  state      : " + this.state);
        ez_id = this.id;
        ez_qid = this.qid;
        ez_mode = this.mode;
        ez_state = this.state;
		ez_astate = this.astate;
    },
    getOnDemandSaveInterval: function() {
        return parseInt(this.getParentVarByID("onDemandSaveTime"))
    },
    getOnDemandExtendedSaveInterval: function() {
        return parseInt(this.getParentVarByID("onDemandExtendedSaveTime"))
    },
    resize: function(B, A) {
        this.log("EZ.resize(" + B + ", " + A + ")");
        try {
            if (parent.ex_resize) {
                result = parent.ex_resize(this.id, B, A)
            } else {
                this.log("EZ.resize() - no ex_resize in parent")
            }
        } catch (C) {
            this.log("EZ.resize() - exception " + C)
        }
    },
    policy: function(A) {
        this.log("EZ.policy(" + A + ")");
        return ( this.getParentVarByID(A)) 
    },
    param: function(A) {
        this.log("EZ.param(" + A + ")");
        return ( this.getParentVarByName(A)) 
    },
    instance: function() {
        this.log("EZ.instance()");
        return ( this.instanceid) 
    },
    loadRandoms: function() {
        this.log("EZ.loadRandoms()");
        try {
            this.randoms = [];
            var C = this.getParentVarByID(this.qid + "_rnd");
            if (C != "") {
                if (C.substring(0, 3) == "%%1") {
                    var B = C.substring(3);
                    C = "";
                    for (var E = 0; E < B.length; E++) {
                        var F = B.charAt(E);
                        var A = this.ncr.indexOf(F);
                        if (A < 0) {
                            C += F
                        } else {
                            C += this.dcr.charAt(A)
                        }
                    }
                }
                var G = C.split(";");
                for (E = 0; E < G.length; E++) {
                    var D = G[E].split("=");
                    if (D.length == 2) {
                        this.randoms.push({
                            name: D[0],
                            value: D[1]
                        })
                    }
                }
            }
        } catch (H) {
            this.error("Error loading external random variables: " + H)
        }
        ez_randoms = this.randoms
    },
    random: function(A) {
        this.log("EZ.random(" + A + ")");
        for (i = 0; i < this.randoms.length; i++) {
            var B = this.randoms[i];
            if (B.name == A) {
                return ( B.value) 
            }
        }
        return null 
    },
    randomSubstitutions: function() {
        this.log("EZ.randomSubstitutions()");
        var A = this.randoms;
        if (A.length == 0) {
            return
        }
        $(".ez_random").each(function(C) {
            var E = $(this).html();
            if (E == null ) {
                return
            }
            if (E.length == 0) {
                return
            }
            var B = E;
            for (i = 0; i < A.length; i++) {
                var G = A[i];
                var D = G.name;
                var F = G.value;
                B = B.split("[" + D + "]").join(F)
            }
            $(this).html(B)
        })
    },
    loadMediaReferences: function() {
        this.log("EZ.loadMediaReferences()");
        try {
            this.mediaUrls = [];
            var B = this.getParentVarByID(this.qid + "_media");
            if (B != "") {
                var A = B.split(",");
                if (A.length > 1) {
                    this.mediaBase = A[0];
                    for (i = 1; i < A.length; i++) {
                        this.mediaUrls.push(A[i])
                    }
                }
            }
        } catch (C) {
            this.error("Error loading external media references: " + C)
        }
        ez_mediaurls = this.mediaUrls;
        ez_mediabase = this.mediaBase
    },
    media: function(A) {
        this.log("EZ.media(" + A + ")");
        return this.mediaBase + A
    },
    save: function() {
        this.log("EZ.save()");
        try {
            if (parent.ex_trigger_save) {
                parent.ex_trigger_save(this.mode, this.id)
            } else {
                this.log("EZ.save() - no ex_trigger_save in parent")
            }
        } catch (A) {
            this.log("EZ.save() - exception " + A)
        }
        return
    },
    contactPublisher: function(B) {
        this.log("EZ.contactPublisher()");
        try {
            if (parent.ex_trigger_contact) {
                parent.ex_trigger_contact(this.mode, this.qid, B)
            } else {
                this.log("EZ.contactPublisher() - no ex_trigger_contact in parent")
            }
        } catch (A) {
            this.log("EZ.contactPublisher() - exception " + A)
        }
        return
    },
	bind_mouseup_parent: function() {
		/*try {
			parent.bind_mouseup_parent(function(){
				var event = new MouseEvent('mouseup');
				document.dispatchEvent(event);
			});
		} catch (A) {
            this.log("EZ.bind_mouseup_parent() - exception " + A);
        }*/
	}
};
$(document).ready(function() {
    window.setTimeout("EZ.init();", 1000)
});
function ez_resize(B, A) {
    EZ.resize(B, A)
}
function ez_policy(A) {
    return EZ.policy(A)
}
function ez_random(A) {
    return EZ.random(A)
}
function ez_media(A) {
    return EZ.media(A)
}
