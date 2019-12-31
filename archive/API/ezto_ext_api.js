/**
 EZTO External Question Open API v1.0.7
 
 YOU MAY NOT EDIT THIS SCRIPT!!!
 
 jQuery 1.3.2 or better required!!!

 Authors: Malcolm Duncan wmd@clearlearning.com
    Chris Patterson chris.s.patterson@gmail.com
*/

/*
** Following constants are deprecated in favor of EZ.* constants...
*/
var MODE_PREVIEW   = "preview"; // mode showing correct answers in place
var MODE_TEST   = "test";  // standard student mode
var MODE_PREGRADE  = "sample";  // mode to pregrade only items answered
var MODE_POST_TEST  = "review";  // mode to fully grade/score the object
var MODE_DESIGN   = "design";  // mode to edit the object

/*
** Following global variables are deprecated in favor of EZ.* instance variables...
*/
var ez_id    = "";    // external identifier from EZTO
var ez_qid    = "";    // parent question identifier from EZTO
var ez_mode    = "";    // rendering mode from EZTO
var ez_state   = "";    // initial state from EZTO
var ez_randoms   = [];   // random variables from EZTO
var ez_mediaurls  = [];   // associated media from EZTO
var ez_mediabase  = "";   // baseURL from EZTO

var dName = document.domain;
if ((dName.indexOf(".com") > -1) && (dName.indexOf(".") > -1)) {
 var temp = dName.split(".");
 dName = temp[temp.length - 2] + "." + temp[temp.length - 1];
}
//alert('api base domain: ' + dName);
document.domain= dName;

var EZ = {

 API_VERSION: "1.0.7",
 
 MODE_PREVIEW:  "preview", // mode showing correct answers in place
 MODE_TEST:  "test",  // standard student mode
 MODE_PREGRADE: "sample", // mode to pregrade only items answered
 MODE_POST_TEST: "review", // mode to fully grade/score the object
 MODE_DESIGN: "design", // mode to edit the object

 id:    "",   // external identifier from EZTO
 qid:   "",   // parent question identifier from EZTO
 instanceid:  "",   // unique identifier from EZTO
 mode:   "",   // rendering mode from EZTO
 state:   "",   // initial state from EZTO
 randoms:  [],   // random variables from EZTO
 mediaUrls:  [],   // associated media from EZTO
 mediaBase:  "",   // baseURL from EZTO
 debug:   false,  // set true to see debug alerts
 
 log: function(str)
 {
  if (this.debug)
  {
   // Use Firebug, Safari debugger, or other external console object if available.
   if (console && console.log)
    console.log(str);
   else
    window.status = str;
  }
 },
 
 error: function(str)
 {
  if (this.debug)
  {
   // Use Firebug, Safari debugger, or other external console object if available.
   if (console && console.log)
    console.log(str);
   else
    window.alert(str);
  }
 },
 
 init: function() 
 {
  this.log("EZ.init()");
  
  this.id= document.location.search.substring(1);
  if (this.id != "")
  {
   var part= this.id.split('_');
   this.qid= part[0] + '_' + part[1];
   
   this.mode = $('#' + this.id + '_mode',  parent.document).val();
   this.state= $('#' + this.id + '_state', parent.document).val();
   this.instanceid= $('#' + this.id + '_instanceid', parent.document).val();
   
   this.loadRandoms();
   this.randomSubstitutions();
   this.loadMediaReferences();

   /*try
   {*/
    setState( this.state );
   /*}
   catch (e)
   {
    this.error("Error calling external setState method; is it implemented?" + e);
   }*/   
  }
  
  this.log("  id         : " + this.id);
  this.log("  qid        : " + this.qid);
  this.log("  instanceid : " + this.qid);
  this.log("  mode       : " + this.mode);
  this.log("  state      : " + this.state);
  
  // Copy values to old global variables
  ez_id    = this.id;
  ez_qid    = this.qid;
  ez_mode   = this.mode;
  ez_state  = this.state;
 },
 
 resize: function(width, height) 
 {
  this.log("EZ.resize(" + width + ", " + height + ")");
  
  $('#' + this.id, parent.document).css({
   width : '' + width  + 'px', 
   height: '' + height + 'px'
  });
 },
 
 policy: function(name) 
 {
  this.log("EZ.policy(" + name + ")");
  
  return ( $('#' + name, parent.document).val() );
 },
 
 param: function(name) 
 {
  this.log("EZ.param(" + name + ")");
  
  return ( $('input[name=' + name + ']', parent.document).val() );
 },
 
 instance: function() 
 {
  this.log("EZ.instance()");
  
  return ( this.instanceid );
 },
 
 loadRandoms: function ()
 {
  this.log("EZ.loadRandoms()");
  
  /*try
  {*/
   this.randoms = [];
   
   var sourceRandoms= $('#' + this.qid + '_rnd', parent.document).val();
   if (sourceRandoms != '')
   {
    var randomArray= sourceRandoms.split(';');
    for (i=0; i<randomArray.length; i++)
    {
     var thisVar= randomArray[i].split('=');
     if (thisVar.length == 2)
     {
      this.randoms.push( { name: thisVar[0], value: thisVar[1] } );
     }
    }
   }
  /*}
  catch (e) 
  {
   this.error("Error loading external random variables: " + e);
  };*/
   //this.randoms = $.parseJSON('[{"name":"b(13)","value":"70"},{"name":"b(16)","value":"3.50"},{"name":"b(19)","value":"5.00"},{"name":"b(30)","value":"-7"},{"name":"b(33)","value":"14"},{"name":"b(3)","value":"8"},{"name":"b(22)","value":"78"},{"name":"b(6)","value":"1"},{"name":"b(25)","value":"84"},{"name":"b(9)","value":"90"},{"name":"b(28)","value":"80"},{"name":"b(11)","value":"80"},{"name":"b(14)","value":"65"},{"name":"b(17)","value":"4.00"},{"name":"b(31)","value":"0"},{"name":"b(34)","value":"21"},{"name":"b(1)","value":"60"},{"name":"b(20)","value":"5.50"},{"name":"b(4)","value":"5"},{"name":"b(23)","value":"80"},{"name":"b(7)","value":"5"},{"name":"b(26)","value":"86"},{"name":"b(29)","value":"-13"},{"name":"b(12)","value":"75"},{"name":"b(15)","value":"3.00"},{"name":"b(18)","value":"4.50"},{"name":"b(32)","value":"7"},{"name":"b(2)","value":"5"},{"name":"b(21)","value":"77"},{"name":"b(5)","value":"2.5"},{"name":"b(24)","value":"82"},{"name":"b(8)","value":"10"},{"name":"b","value":"4"},{"name":"b(27)","value":"4.00"},{"name":"b(10)","value":"85"}]');
   //this.randoms = $.parseJSON('[{"name":"fe","value":"16800"},{"name":"var12","value":"79630"},{"name":"ap","value":"18000"},{"name":"os","value":"3360"},{"name":"ta","value":"96430"},{"name":"td","value":"115600"},{"name":"a","value":"13900"},{"name":"ae","value":"18200"},{"name":"ni","value":"3120"},{"name":"fe","value":"16800"},{"name":"niche","value":"1996800"},{"name":"land","value":"1234"},{"name":"x","value":"168"},{"name":"y","value":"26"},{"name":"z","value":"16"},{"name":"t","value":"8"},{"name":"two","value":"1644"},{"name":"zyx","value":"123"},{"name":"order","value":"001"}]');
   // Copy values to old global variables
  ez_randoms = this.randoms;
  
 },
 
 random: function(varname)
 {
  this.log("EZ.random(" + varname + ")");
  
  for (i=0; i<this.randoms.length; i++)
  {
   var rv = this.randoms[i];
   if (rv.name == varname) return(rv.value);
  }
  return null;
 },
 
 randomSubstitutions: function ()
 {
  this.log("EZ.randomSubstitutions()");
  
  // Dereference this.randoms so we can use it within $.each() below.
  var r = this.randoms;
  
  if (r.length == 0) return;
  
  $('.ez_random').each( function(ndex){
   var content= $(this).html();
   if (content == null) return;
   if (content.length == 0) return;
 
   //EZ.log("ez_random " + ndex + " content before substitutions:");
   //EZ.log(content);
   
   var result= content;
   for (i=0; i<r.length; i++)
   {
    var rv = r[i];
    var name= rv.name;
    var value= rv.value;
    result= result.split('\[' + name + '\]').join(value);
   }
   $(this).html(result);
   
   //EZ.log("ez_random " + ndex + " content after substitutions:");
   //EZ.log(result);
  });
 },
 
 loadMediaReferences: function ()
 {
  this.log("EZ.loadMediaReferences()");

  try
  {
   this.mediaUrls = [];
   
   var sourceMedia= $('#' + this.qid + '_media', parent.document).val();

   if (sourceMedia != '')
   {
    var mediaArray= sourceMedia.split(',');
    if (mediaArray.length > 1)
    {
     this.mediaBase= mediaArray[0];
     for (i=1; i<mediaArray.length; i++)
      this.mediaUrls.push(mediaArray[i]);
    }
   }
  }
  catch (e) 
  {
   this.error("Error loading external media references: " + e);
  };
  
  // Copy values to old global variables
  ez_mediaurls = this.mediaUrls;
  ez_mediabase = this.mediaBase;
 },
 
 media: function(mediaName)
 {
  this.log("EZ.media(" + mediaName + ")");
  
  return this.mediaBase + mediaName;
 }
};


$(document).ready(function(){
  EZ.init();
  //window.setTimeout("EZ.init();", 1000);
});


/*
** Old global functions. These are deprecated in favor of the
** scoped class methods (ie. EZ.resize(w,h) instead of ez_resize(w,h).
*/

function ez_resize( width, height )
{
 EZ.resize(width, height);
}

function ez_policy( name )
{
 return EZ.policy(name);
}

function ez_random( varname )
{
 return EZ.random(varname);
}

function ez_media( medianame )
{
 return EZ.media(medianame);
}

