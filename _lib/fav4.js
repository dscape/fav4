var COOKIE_NAME = 'myFavFour';
var COOKIE_OPTIONS = { path: '/', expires: 90 };
	
$(document).ready(function() {
	

	// vars
	var settingsMode = false;	

	// funcs
	// --------------------------------------------------------------------------------------------------------
	function footerHide (){
		$("#footer").hide();
	}
	
	function showSettings (){
		settingsMode = true;
		$("#settingsModal")
		$("#settingsModal").show();
		// setup bindings here?
			// setup jquery UI
			$("#myFavsOptions, #myFavsList").sortable({
				connectWith: '.connectedList'
			}).disableSelection();
	}
	
	function hideSettings (){
		settingsMode = false;
		$("#settingsModal").hide();	
		$("#footer").show();
	}

	$("#settings").fancybox({
		'autoDimensions'    : false,
		'width'             : 770,
		'height'            : 400,
		'titleShow'			: false,
		'onStart'           : footerHide,
		'onComplete'        : showSettings,
		'onCleanup'         : hideSettings,
		'autoScale'			: false
	});
	
	// setup modal links to have functionality
	$("#modalnav a").click(function(){
		var myID = $(this).attr("id");
		modalNav(myID);
		return false;
	});
	$("#sitesNav2").click(function(){
		modalNav("sitesNav");	
		return false;
	});
	
	// --------------------------------------------------------------------------------------------------------
	// MISC
	$("p.validate").hide();
	
	// we needa check for the existing cookie here
	if ($.cookie(COOKIE_NAME)){
		// clear the lander!
		$(".bodytext ul").html("");
		// get the cookie
		var theCookie = $.cookie(COOKIE_NAME);
		var chunks = theCookie.split("::");
		// do a forced loop of 4 to get the options
		for (i=0;i<=3;i++){
			var chip = chunks[i].split(",");
			var icon = "icon-"+chip[0];
			var dest = chip[1];
			// find this icon in the list
			var $pos = $("#myFavsOptions li span#"+icon);
			var $li = $pos.parents("li");
			$li.remove();
			$("#myFavsList").append("<li>"+$li.html()+"</li>");
			writeBody(chip[0],dest,i);
		}
		$(".bodytext ul li:last-child").addClass("last");
		// and just for good measure, activate the submit button
		$("#favholder a.submit").addClass("active");
		$("#footer a").addClass("settingsCookie");
	}
	
	//$("#content .bodytext").fadeIn(1000);	
	
	
	// --------------------------------------------------------------------------------------------------------
	// CONFIG LISTS
	// make sure list doesn't take user to URL
	$("#myFavsOptions li a, #myFavsList li a").click(function(){ return false; });

		
	// on myFavsList Update
	$("#myFavsList").bind('sortupdate', 
		function(event, ui){
			if ($("#myFavsList li.empty").exists()){
				$("#myFavsList li.empty").remove();	
			}
			var childCount = $(this).children().size();
			if (childCount > 4){
				alert("Fav 4 is limited to 4 options");	
				$(ui.sender).sortable('cancel');
			}
			if (childCount == 4){
				$("#favholder a.submit").addClass("active");
			}
			if (childCount < 4){
				$("#favholder a.submit").removeClass("active");	
			}
		}
	);
	
	
	// --------------------------------------------------------------------------------------------------------
	// SAVE BUTTON
	$("#favholder a.submit").click(function(){
		// make sure we've got the active class to go ahead here
		if ($(this).hasClass("active")){
			saveFavorites();
		}
		return false;
	});
	
    // 

	document.onkeydown = function(event)
	{
	   if (settingsMode)
		return;

	   if (!event)
	      event = window.event;

	   var keycode = (event.which) ? event.which : event.keyCode;

	   switch(keycode)
	   {
	      case 49: case 97: case 65:
	         $('.link1').addClass('numkey');
	         break;

	      case 50: case 98: case 83:
	         $('.link2').addClass('numkey');
	         break;

	      case 51: case 99: case 68:
	         $('.link3').addClass('numkey');
	         break;

	      case 52: case 100: case 70:
	         $('.link4').addClass('numkey');
	         break;

		case 67: // c for config
		   $('#settings').addClass('skey');
		   break;

	      default:
	         break;
	   }
	}

	document.onkeyup = function(event)
	{
	   if (!event)
	      event = window.event;

	   var keycode = (event.which) ? event.which : event.keyCode;

	   if (settingsMode)
	   {
         	if (keycode == 27) // ESC
		{
			$.fancybox.close();
		}
		return;
	   }

	   switch(keycode)
	   {
	      case 49:  case 97: case 65:
		   $('.link1').removeClass('numkey');
	         document.location = $('.link1').attr('href');
	         break;

	      case 50: case 98: case 83:
		   $('.link2').removeClass('numkey');
	         document.location = $('.link2').attr('href');
	         break;

	      case 51: case 99: case 68:
		   $('.link3').removeClass('numkey');
	         document.location = $('.link3').attr('href');
	         break;

	      case 52: case 100: case 70:
		   $('.link4').removeClass('numkey');
	         document.location = $('.link4').attr('href');
	         break;

		case 67: // S is for settings
		   $('#settings').trigger('click');
		   $('#settings').removeClass('skey');
		   break;

	      default:
	         break;
	   }
	}
	// --------------------------------------------------------------------------------------------------------
	
	// CONTACT
	$("#contactBtn").click(function(){
		$(this).attr("disabled",true);
		$(this).css("opacity",.3);
		// error check
		var contactMsg = $("#contactBody").val();
		var youremail  = $("#email").val();
		var theKey		= "fav"+Math.floor(Math.random()*100+1)
		var sMsg = "";
		
		// check it
		if (!checkEmail(youremail)){
			sMsg = "Please provide a valid email.\r\n";
		}
		if (!contactMsg){
			sMsg += "Please provide some text for us!";	
		}
		
		// all okay?
		if (!sMsg){
			// send the msg!
			$.post("_lib/func_email.php",
					{func: "email", msg: contactMsg, key: theKey, email: youremail}, 
					function(data){
						if (data == "ok"){
							// 
							$("#contact p.validate").fadeIn();
							var hideOK = setTimeout("hideSuccess()",10000);
						} else {
							alert(data);
							$(this).attr("disabled",false);
							$(this).css("opacity",1);
						}
					}
				);	
				
		} else {
			alert(sMsg);
			$(this).attr("disabled",false);
			$(this).css("opacity",1);
		}
		
		return false;
	});

	
});


// regular functions
function modalNav(showTarget){
	$("#modalnav ul li a").removeClass("navActive");
	$("#"+showTarget).addClass("navActive");
	
	var showTarget = showTarget.replace("Nav","");
	
	$("#sectionWrapper div").not("#"+showTarget).hide();	
	$("#sectionWrapper div#"+showTarget).show();
	
	
	
}
// function that actually saves our favorites
function saveFavorites(){
	// clear the lander
	$(".bodytext ul").html("");
	
	// pretty simple, we just loop through the myFavs list and save the info into a cookie
	var cookieChunk = ""
	
	$("#myFavsList li").each(function(index){
		var dest = $(this).find("a").attr("href");
		var shorthand = $(this).find("span").attr("id");
		shorthand = shorthand.replace("icon-","");
		
		// shorthand,dest::shorthand,dest::shorthand,dest::shorthand,dest
		cookieChunk += shorthand+","+dest+"::";
		writeBody(shorthand, dest, index);
	});
	// last class that body ul
	$(".bodytext ul li:last-child").addClass("last");
	
	// write the cookie
	$.cookie(COOKIE_NAME, cookieChunk , COOKIE_OPTIONS);
	
	
	
	
	// let them know it worked
	/*$("p.validate").fadeIn("slow", function() {
   		// hide the success msg
		var hideOK = setTimeout("hideValidate()",2000);
 	});*/
	
	$.fancybox.close();
	$("#footer a").addClass("settingsCookie");
	$("#footer").show();
	
	
	// save this data into the db behind the scenes
	$.post("_lib/func_tracker.php",
			{func: "rate"}, 
			function(data){
				if (data){
					// we do absolutely nothing on return
				}
			}
		);
	
}

function hideSuccess(){
	$("#contact p.validate").fadeOut("slow");
	$("#contactBody").val("");	
	$("#contactBtn").attr("disabled",false);
	$("#contactBtn").css("opacity",1);
}
function writeBody(shorthand, dest, index){
	var theTitle = shorthand.replace("-"," ");
	theTitle = ucwords(theTitle);
	
	$(".bodytext ul").append("<li><a id=\""+shorthand+"\" href=\""+dest+"\" class=\"link" + (index+1) + "\">"+shorthand+"</a></li>");	
}
function showBody(){
	
	
}
function ucwords(str) {
    return (str + '').replace(/^(.)|\s(.)/g, function ($1) {
        return $1.toUpperCase();    });
}
function checkEmail(addy) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(addy)){
		return (true)
	} else {
		return (false)
	}
}
// ---------------------------------------------------------------------------------------------------------------------------
// ADD ONS 
jQuery.fn.extend({
	// test if el is animated
	animated: function() {
		if(this.filter(':animated').size() > 0) {
			return true;
		}
		else {
			return false;	
		}
	},
	// test if el is visible
	visible: function() {
		if(this.filter(':visible').size() > 0) {
			return true;
		}
		else {
			return false;	
		}
	},
	// test if el exists
	exists: function() {
		if(this.size() > 0) {
			return true;
		}
		else {
			return false;	
		}
	}
});
