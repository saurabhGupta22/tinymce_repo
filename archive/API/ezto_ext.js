	/**
		API function to collect state and score info from the external object
		
		YOU MAY NOT EDIT THIS SCRIPT!!!

		API Author:  Malcolm Duncan wmd@clearlearning.com
	*/
	
	
	function extGather() {
		$('.wk_ex_iframe').each(function(){
			var theFrame= $(this);
			var theID= $(this).attr('id');
			//alert(theID);
		
				var theState= window.frames[this.name].getState();
				$('#'+theID+'_state').val(theState);
				var theScore= window.frames[this.name].getScore();
				$('#'+theID+'_eval').val(theScore);
		
		});
	}
	

	function extTestGather() {
		$('.wk_ex_iframe').each(function(){
			var theFrame= $(this);
			var theID= $(this).attr('id');
			//alert(theID);
		
				var theState= window.frames[this.name].getState();
			 //var theState= window.frames[0].getState();
				$('#'+theID+'_ostate').val(theState);
				var theScore= window.frames[this.name].getScore();
				//var theScore= window.frames[0].getScore();
				$('#'+theID+'_eval').val(theScore);
		
		});
	}