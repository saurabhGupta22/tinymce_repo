var thisITEMid = "et_012345678";
	
/*
    Initialize tool host page API.  This is where we initialize the JS Object model and populate
    its apiData object.  This would be where your implementation would process your data model
    into the tool page's model.  You may choose to make your model do this natively and without
    a level of abstraction like this.
*/
function initToolAPI()
{
    var initObj= new Object();
    initObj.itemID= thisITEMid;
    initObj.saveService= $('#tool_save_service').val();
    initObj.resultsService= $('#tool_results_service').val();
    initObj.supportMessage= "back end communication failed";
    initObj.saveThrottle= 5;
    
    ex_init( initObj );
    
    ex_buildRandoms( $('#combined_randoms').val() );
    
    var policies= JSON.parse( $('#policies_json').val()||0 );
    for (x in policies)
    {
        ex_addPolicy( x, policies[x] );
    }
    
    /*
    ex_addPolicy( "p_showhints", $('#p_showhints').val() );
    ex_addPolicy( "role", $('#role').val() );
    ex_addPolicy( "p_solution", $('#p_solution').val() );
    */
    
    ex_addMedia( $('#combined_media').val() );	
    
    /*
        You'd probably loop through your data model calling ex_addInstance() here.
        For this testRig, we only instantiate one tool and we start over a lot for 
        debugging purposes.  Thus, we do that later in the doit methods below.
    */
}

// instantiate the simulated tool assuming it only understands a combined state
function doit_v1()
{
    initToolAPI();

    ex_addPolicy( "force_combined", "true" );
    
    ex_addInstance(
        "1",
        $('#tool_state').val(), 
        "", 
        $('#tool_mode').val(), 
        $('#tool_score').val(), 
        $('#tool_completion').val(),
        ""
    );
    
    doit( thisITEMid + "_1" );
}

// instantiate the simulated tool assuming it understands a separated state
function doit_v3(toolInstanceId,definition, key, response)
{
    if (!definition) {
      definition = "";
		}
		if(!key) {
			key = '';
		}
		if(!response) {
			response = '';
		}
    ex_addPolicy( "force_combined", null );
    
    var theMode= EZ.mode;
    if (theMode == EX_MODE_DESIGN) theKey= $('#tool_key').val();
    
    ex_addInstance(toolInstanceId, definition, response, theMode, "", "", key);
    
    //doit( thisITEMid + "_1" );
}

// instantiate the tool in the UI
function doit( toolInstance )
{
    var iFrameHTML= '<br>&nbsp;<br><iframe class="wk_ex_iframe" style="z-index: 1" allow="microphone *; camera *" ';
    iFrameHTML += 'name="' + toolInstance + '" id="' + toolInstance + '" frameborder="1" ';
    iFrameHTML += 'src="' + $('#identifier').val() + '?' + toolInstance + '" ';
    iFrameHTML += 'width="' + $('#frame_width').val() + '" ';
    iFrameHTML += 'height="' + $('#frame_height').val() + '">';
    iFrameHTML += '</iframe>';
    $('#testFrame').html(iFrameHTML);
}


/*
    Pull in the data from the tool into the testRig UI.  This IS a DOM operation and ONLY
    for testRig.  You shouldn't store tool data in the DOM - interactions are too expensive
    in terms of performance.
*/
function retrieveCombined()
{
    var toolInstance= "ext_012345678_1";

    try
    {
        $('#output_state').val( window.frames[toolInstance].getState() );
        $('#tool_score').val( window.frames[toolInstance].getScore() );
        $('#tool_completion').val( window.frames[toolInstance].getCompletion( $('#output_state').val() ) );
    }
    catch (err)
    {
        ex_log("Error in retrieveCombined(): " + err);
    }
}

/*
    Pull in the data from the tool into the testRig UI.  This IS a DOM operation and ONLY
    for testRig.  You shouldn't store tool data in the DOM - interactions are too expensive
    in terms of performance.
*/
function retrieveSeparated()
{
    var toolInstance= "ext_012345678_1";
    var definition= "";
    var key= "";
    var response= "";
    var results= "";

    var theMode= $('#tool_mode').val();

    try
    {
        if (typeof window.frames[toolInstance].getDefinition === 'function')
        {
            definition= window.frames[toolInstance].getDefinition();
        }
        else ex_log("getDefinition() unimplemented in tool instance");

        if (theMode == EX_MODE_DESIGN) 
        {
            $('#output_definition').val( definition );

            if (typeof window.frames[toolInstance].getKey === 'function')
            {
                key= window.frames[toolInstance].getKey();
                $('#output_key').val( key );
            }
            else ex_log("getDefinition() unimplemented in tool instance");
        }
        else
        {
            ex_log("Test Rig v3:  Response, Definition, and Key should only be retrieved in design mode.");
            $('#output_definition').val( "" );
            $('#output_key').val( "" );
            $('#tool_response').val( "" );
        }

        if (theMode == EX_MODE_TEST)
        {
            if (typeof window.frames[toolInstance].getResponse === 'function')
            {
                response= window.frames[toolInstance].getResponse();
                $('#tool_response').val( response );
            }
            else ex_log("getResponse() unimplemented in tool instance");

            /*
            if (typeof window.frames[toolInstance].getResults === 'function')
            {
                results= window.frames[toolInstance].getResults( definition, response );
                $('#results').val( results );
            }
            else ex_log("getResults() unimplemented in tool instance");
                    
            var resultsObj= JSON.parse(results);
            if (resultsObj.score) $('#tool_score').val( resultsObj.score );
            if (resultsObj.completion) $('#tool_completion').val( resultsObj.completion );
            if (resultsObj.grading) $('#grading').val( resultsObj.grading );
            */
        }
        else ex_log("Test Rig v3:  Response should only be pushed via save().  Response and Results retrieved for test mode ONLY in test rig.");
    }
    catch (err)
    {
        ex_log("Error in retrieveSeparated(): " + err);
    }
}


function retrieveResults()
{
    var toolInstance= "ext_012345678_1";
    var theMode= $('#tool_mode').val();
    ex_trigger_retrieveResults( theMode, toolInstance, resultsCallback );
}

function resultsCallback( result )
{
    ex_log("TestRig v3:  simulating the return of JSON results with a static call for a JSON doc.");
    
    // demonstrating that the data returned should identify a tool instance in our object model
    var toolIdentifier= result.qid + "_" + result.instanceid;
    var	thisToolObject = apiData.tools[ toolIdentifier ];

    thisToolObject.score= result.score;
    thisToolObject.completion= result.completion;
    
    ex_log("TestRig v3:  ignoring the returned JSON and replacing with actual score and completion from v1 calls.");
    $('#backend_score').val( result.score );
    $('#backend_completion').val( result.completion );
    $('#grading').html( "Warning:  Simulated from JSON doc:\n" + JSON.stringify( result ) );
}


// convenience function for testRig
function copyState()
{
    $('#tool_state').val( $('#output_state').val() );
}


// convenience function for testRig
function copySeparated()
{
    $('#tool_definition').val( $('#output_definition').val() );
    $('#tool_key').val( $('#output_key').val() );
}


// this is the consumer dependent portion of askPublisher
// you'd typically wire this into some means to send this info to customer support
function askPublisherAPI( qid, message )
{
    alert('contactPublisher called for qid ' + qid + ' with message: ' + message);
}








/**
	Test Rig API Example for MHE Content Tool API v3.0.1
	API methods to manage state, respone, and results info communication with tools
	API Author:  Malcolm Duncan  W.Malcolm.Duncan@mheducation.com  wmd@clearlearning.com
	
	
	This example is implemented according to an object model in cooperation with testRig.html
	file.  Consumers are free to reimplement this library according to your item object data 
	model as long as your implementation doesn't make or depend upon changes to the toolSideAPI.js
	functions or otherwise communicate across the iFrame boundary with the tool or tool DOM.
	Communication across that boundary should be strictly restricted to the API functions:
	
		ex_get_varByID() - host page responder for API calls to retrieve data for the tool
		ex_get_varByName() - host page responder for API calls to retrieve data for the tool
		
			By data above, I mean state/response/policy/randoms data.  That is the host page keeps
			that data somewhere (in JS Objects for this reference implementation) and the tool
			uses EZ.policy or EZ.param to call these to actually get the data and take appropriate
			actions.
		
		ex_resize() - host page responder to resize the tool iframe
		
			Tools can't change the size of their own iframes and it's important to allow this to
			avoid multiple scroll bars in the UI as the actual tool UI's size can change dynamically.
			If the tool was unable to call this, the tool's UI would force additional scroll bars
			onto the screen when the tool's content exceeded the original iframe size.  Multiple
			scroll bars confuse users.
		
		ex_trigger_save() - host page responder to save the user's combined state
		ex_trigger_saveResponse() - host page responder to save the user's response alone
		
			These save functions are what tools call for onDemand save.  That is, all tools since
			2016 have implemented a call to EZ.save whenever their state/response has changed and
			requires persistence on the back end.  When one of these functions are triggered, these
			functions retrieve the updated data and compare them to previous saves and if changed,
			calls the back end to persist the data.  These functions also autothrottle so they can't
			be called too often.
		
		ex_trigger_contact() - host page responder to trigger an askInstructor or askPublisher action
		
			This is a support function.  If the tool provides a UI to allow users to contact MHE or
			their instructor, it is this function that is called.  This would be implemented as
			appropriate to the consumer platform.
			
		ex_trigger_returnResults() - to retrieve evaluated results from the back end
		
	When the functions above are communicating across the iframe boundary, they, themselves, are
	restricted to calling any of the required MHE Content API functions:
		getState(),
		getResponse(),
		getScore(),
		getCompletion(),
		getResults(),
		getDefinition(),
		getKey()
		
	We strongly warn against calling the MHE Content Tool API's of setState() and setStateResponse()
	from the host page since it can be indeterminate as to when the tool DOM is fully rendered and
	the API functions are prepared to respond.  That's why the tool side API triggers those onReady.
*/

var	API_PARENT_VERSION = "3.0.1";

var	EX_MODE_PREVIEW 		= "preview";	// mode showing correct answers in place
var	EX_MODE_TEST			= "test";		// standard student mode
var	EX_MODE_PREGRADE		= "sample";		// mode to pregrade only items answered
var	EX_MODE_POST_TEST		= "review";		// mode to fully grade/score the object
var	EX_MODE_DESIGN			= "design";		// mode to edit the object

var TOOL_SAVE_THROTTLE		= 5; 			// seconds - don't save any more often than X seconds
var TOOL_SAVE_SERVICE		= "http://localhost/api/tool/v1/putStateJSON";
var TOOL_RESULTS_SERVICE	= "http://localhost:3000/score";

var TOOL_SUPPORT_MESSAGE	= "There was an error saving this question. Reopen assignment to continue.\nSupport link: http://mpss.mhhe.com/contact.php";


// Object based implementation
var apiData;

/*
	Here's where we initialize the JS Object implementation for this reference page.  We keep the
	data for the page and every tool instance on the page in apiData.  apiData.policies should be
	thought of as a catch all for all kinds of params necessary for page or tool operation.
*/
//function ex_init( itemID, service, throttle, support )
function ex_init( toolConfig )
{
	if (toolConfig.saveService != null && toolConfig.saveService.length >= 2) TOOL_SAVE_SERVICE= toolConfig.saveService;
	if (toolConfig.throttle != null && toolConfig.throttle >= 2) TOOL_SAVE_THROTTLE= toolConfig.throttle;
	if (toolConfig.supportMessage != null) TOOL_SUPPORT_MESSAGE= toolConfig.supportMessage;
	if (toolConfig.resultsService != null && toolConfig.resultsService.length >= 2) TOOL_RESULTS_SERVICE= toolConfig.resultsService;
	
	apiData				= new Object();
	apiData.itemID		= toolConfig.itemID;
	apiData.media		= "";
	
	apiData.tools		= new Object();
	apiData.policies	= new Object();
}

/*
	This adds a new tool instance to apiData.  For instance, the consumer has a data model for
	items with tool instances in them.  When the page is instantiated, you could process that
	data model with calls to this function for each tool on the page.
*/
function ex_addInstance( instanceID, state, response, mode, score, completion, key )
{
	var toolIdentifier= apiData.itemID + "_" + instanceID;
	
	apiData.tools[ toolIdentifier ]= new Object();
	apiData.tools[ toolIdentifier ].instanceid= instanceID;
	apiData.tools[ toolIdentifier ].state= state;
	apiData.tools[ toolIdentifier ].response= response;
	apiData.tools[ toolIdentifier ].mode= mode;
	apiData.tools[ toolIdentifier ].score= score;
	apiData.tools[ toolIdentifier ].completion= completion;
	apiData.tools[ toolIdentifier ].timestamp= 0;
	apiData.tools[ toolIdentifier ].previous_completion= 0;
	apiData.tools[ toolIdentifier ].isApiCallQueued = false;
	apiData.tools[ toolIdentifier ].key= key;
	
	// for another system you'd implement your own function to prepopulate the standard params for back end saves
	ex_addEZTparams( apiData.tools[ toolIdentifier ] );

	// Extra credit:  this would be a great place to record a JWT to use in background save calls 
}

/*
	In this particular example, we call a back end API in EZT to record data updates from the tool.
	This function adds the standard parameters necessary for that back in call into the tool's
	apiData array instance.  That way, all our save routines have to do is stringify the tool's
	data instance and send that to the back end's REST API.
	
	I separated this to note that this was unique to EZT.  Another consumer would likely have
	different parameters, tokens, and the like.
*/
function ex_addEZTparams( toolObject )
{
	try 
	{
		toolObject.ezid       = ex_get_varByID("wid");
		toolObject.userId     = ex_get_varByID("userId");
		toolObject.attemptNo  = ex_get_varByID("attemptNo");
		toolObject.activityId = ex_get_varByID("activityId");
		toolObject.sectionId  = ex_get_varByID("sectionId");
		toolObject.qid        = apiData.itemID;
		toolObject.tool       = toolObject.instanceid;

		var role = ex_get_varByID("role");
		if(role && (role === 'instructor' || role === 'instructorPrimary' || role === 'grader')) {
			toolObject.userId = 'instructorPreviewID';
		}
	} 
	catch(err) {
		ex_log("ex_addEZTparams() - exception " + err);
	}
}


// convenience functions for managing randoms in the apiData object
function ex_buildRandoms( combined )
{
	apiData.randoms= combined;
}

function ex_randoms()
{
	return apiData.randoms;
}


// convenience functions for managing policies in the apiData object
function ex_addPolicy( name, value )
{
	apiData.policies[name]= value;
}


// convenience functions for managing media in the apiData object
function ex_addMedia( value )
{
	apiData.media= value;
}

function ex_media()
{
	return apiData.media;
}


// convenience method for logging
function ex_log( message )
{
	try
	{
		if (console && console.log) console.log(message);
	}
	catch (err)
	{
		//window.alert(message);
	}
}




// required API functions

function ex_get_varByID( varname )
{
	ex_log("ex_get_varByID(" + varname + ")");
	
	if (varname.startsWith(apiData.itemID))
	{
		if (varname.endsWith("_rnd")) return( ex_randoms() );
		if (varname.endsWith("_media")) return( ex_media() );
		
		var toolIdentifier= varname.substring(0, varname.lastIndexOf("_"));
		if (varname.endsWith("_instanceid")) return( apiData.tools[ toolIdentifier ].instanceid );
		if (varname.endsWith("_state")) return( apiData.tools[ toolIdentifier ].state );
		if (varname.endsWith("_response")) return( apiData.tools[ toolIdentifier ].response );
		if (varname.endsWith("_mode")) return( apiData.tools[ toolIdentifier ].mode );
		if (varname.endsWith("_eval")) return( apiData.tools[ toolIdentifier ].score );
		if (varname.endsWith("_key")) return( apiData.tools[ toolIdentifier ].key );
	}
	else
		return apiData.policies[varname]; 
	
	ex_log("ex_get_varByID(" + varname + ") unsuccessful");
	return "";
}

// deprecating this by simply calling the id based function
function ex_get_varByName( name )
{
	return ex_get_varByID( name );
}


// for instance, this could be implemented using something other than jQuery
function ex_resize( id, width, height )
{
	$('#' + id).css({
		width : '' + width  + 'px', 
		height: '' + height + 'px'
	});
}


// this clearly depends upon a host page function because it's strongly tied to the consumer
function ex_trigger_contact( mode, qid, message )
{
	if (mode == EX_MODE_PREGRADE) return;
	if (mode == EX_MODE_DESIGN) return;
	
	try 
	{
		if (askPublisherAPI) askPublisherAPI( qid, message );
	}
	catch (err)
	{
		ex_log('error calling askPublisherAPI() in ex_trigger_contact');
	}
}


/*
Handles the communication of combined state/response data to the back end REST API.
It throttles itself and only does the back end call if the data has actually
changed.  You REALLY shouldn't depend on the tool doing that for you.  Trust but
verify...
*/
function ex_trigger_save( mode, toolIdentifier )
{
	if (mode != EX_MODE_TEST) return;
	
	try 
	{
		var currentTime = new Date().getTime(),
		thisToolObject = apiData.tools[ toolIdentifier ],
		previousCallTime = thisToolObject.timestamp,
		elapsedTime = (currentTime - thisToolObject.timestamp) / 1000;

		if (elapsedTime > TOOL_SAVE_THROTTLE)
		{
			var currentState = window.frames[toolIdentifier].getState(),
			completion = deriveCompletion( window.frames[toolIdentifier].getCompletion(currentState) );

			if (thisToolObject.state !== currentState || thisToolObject.completion !== completion) {
				thisToolObject.timestamp = currentTime;
				thisToolObject.state = currentState;
				thisToolObject.score = window.frames[toolIdentifier].getScore();
				thisToolObject.completion = completion;
				
				thisToolObject.isApiCallQueued = false;
				
				var saveObject= Object.assign({}, thisToolObject);
				delete saveObject.isApiCallQueued;
				delete saveObject.previous_completion;
				delete saveObject.key;

				ex_log('TestRig: revealing background save data for ' + toolIdentifier);
				$('#tool_save').val( JSON.stringify(saveObject) );

				// Extra credit:  there are ways to inject a JWT authentication header into ajax calls
				$.ajax({
					type: "POST",
					async: true,
					url: TOOL_SAVE_SERVICE,
					data: JSON.stringify(saveObject),
					contentType: 'application/json',
					dataType: 'json',
					error: function (xhr) {
					  //alert( TOOL_SUPPORT_MESSAGE );
					  thisToolObject.timestamp = previousCallTime;
					}
				});
			}
		} 
		else if (!thisToolObject.isApiCallQueued && elapsedTime) 
		{
			thisToolObject.isApiCallQueued = true;
			var timeLeftToCallApi = (TOOL_SAVE_THROTTLE - elapsedTime) * 1000;
			setTimeout(function() {
				ex_trigger_save( mode, toolIdentifier ); 
			}, timeLeftToCallApi);
		}
	}
	catch (err)
	{
		ex_log('error triggering background save() in ex_trigger_save on ' + toolIdentifier + ' ' + err);
	}
}

/*
Handles the communication of SEPARATED response data to the back end REST API.
It throttles itself and only does the back end call if the data has actually
changed.  You REALLY shouldn't depend on the tool doing that for you.  Trust but
verify...
*/
function ex_trigger_saveResponse( mode, toolIdentifier )
{
	if (mode != EX_MODE_TEST) return;
	
	try 
	{
		var currentTime = new Date().getTime(),
		thisToolObject = apiData.tools[ toolIdentifier ],
		previousCallTime = thisToolObject.timestamp,
		elapsedTime = (currentTime - thisToolObject.timestamp) / 1000;

		if (elapsedTime > TOOL_SAVE_THROTTLE)
		{
			/*
			var currentState = thisToolObject.state;
				
			delete thisToolObject.state; 		// don't send to back end
			delete thisToolObject.score; 		// not used in v3
			delete thisToolObject.completion; 	// not used in v3
			*/
			thisToolObject.timestamp = currentTime;				
			thisToolObject.isApiCallQueued = false;
			thisToolObject.response= window.frames[toolIdentifier].getResponse();
			
			var saveObject= Object.assign({}, thisToolObject);
			saveObject.timestamp = currentTime;				
			saveObject.response = thisToolObject.response;				

			delete saveObject.state;
			delete saveObject.score;
			delete saveObject.completion;
			delete saveObject.isApiCallQueued;
			delete saveObject.previous_completion;
			delete saveObject.key;

			ex_log('TestRig: revealing background save data for ' + toolIdentifier);
			$('#tool_save').val( JSON.stringify(saveObject) );

			// in this example, we're calling the same back end API as for combined states but omitting the state data
			$.ajax({
				type: "POST",
				async: true,
				url: TOOL_SAVE_SERVICE,
				data: JSON.stringify(saveObject),
				contentType: 'application/json',
				dataType: 'json',
				error: function (xhr) {
				  //alert( TOOL_SUPPORT_MESSAGE );
				  thisToolObject.timestamp = previousCallTime;
				}
			});
			
			//thisToolObject.state= currentState; // restore local copy
		} 
		else if (!thisToolObject.isApiCallQueued && elapsedTime) 
		{
			thisToolObject.isApiCallQueued = true;
			var timeLeftToCallApi = (TOOL_SAVE_THROTTLE - elapsedTime) * 1000;
			setTimeout(function() {
				ex_trigger_saveResponse( mode, toolIdentifier ); 
			}, timeLeftToCallApi);
		}
	}
	catch (err)
	{
		ex_log('error triggering background save() in ex_trigger_saveResponse on ' + toolIdentifier + ' ' + err);
	}
}

/*
	This is to pass appropriately reformatted data in the completion property in the case of
	various error conditions - e.g. when we dont get 0..100 from getCompletion() OR if the tool
	has not implemented getCompletion() properly or at all.
*/
function deriveCompletion(completion) {
	if (isNaN(parseInt(completion))) {
		if (startsWith(completion, "OOB (")) {
			try {
				var completionOobValue = completion.replace("OOB (", "");
				completionOobValue = completionOobValue.replace(")", "");
				var completionOob = parseFloat(completionOobValue);
				if (completionOob < 0) {
					return 1;
				}
			} catch (err) {
				console.log("Unable to parse : ", completion, err);
			}
		}
		return 100;
	}
	return completion;
}


function ex_trigger_retrieveResults( mode, toolIdentifier, callback )
{
	try 
	{
		var requestObject= Object.assign({}, apiData.tools[ toolIdentifier ]);
			requestObject.timestamp = new Date().getTime();
			requestObject.randoms =  ex_randoms();
			requestObject.policy = apiData.policies;
			requestObject.key = $('#tool_key').val();
		// var qState = requestObject.state,
		// 	rState = requestObject.response,
		// 	key = $('#tool_key').val();
		// 	data =  window.frames[toolIdentifier].getResults(qState, rState, key);
		
		// delete requestObject.state;
		delete requestObject.score;
		delete requestObject.completion;
		delete requestObject.isApiCallQueued;
		// delete requestObject.response;
		delete requestObject.previous_completion;
		// delete requestObject.key;

		ex_log('TestRig: returnRequest for ' + toolIdentifier + ' ' + JSON.stringify(requestObject));

		$.ajax({
			type: "POST",
			async: true,
			url: TOOL_RESULTS_SERVICE,
			data: JSON.stringify(requestObject),
			contentType: 'application/json',
			dataType: 'json',
			headers: {
                "Access-Control-Allow-Origin": "*"
            }
		}).done(function(data, statusString, xhr){
			callback(data);
		}).fail(function(xhr) {
			  //alert( TOOL_SUPPORT_MESSAGE );
			  thisToolObject.timestamp = previousCallTime;
		});
		// callback(data);
	}
	catch (err)
	{
		ex_log('error triggering background save() in ex_trigger_returnResults on ' + toolIdentifier + ' ' + err);
	}
}

var toolSideApi = document.createElement('script');
toolSideApi.type = "text/javascript";
toolSideApi.src = "./API/toolSideAPI.js";
document.body.appendChild(toolSideApi);

initToolAPI();