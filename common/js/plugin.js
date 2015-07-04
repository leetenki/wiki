/**
 * Cookie plugin
 * Thickbox 3.1
 * SWFObject v1.4.2
 * markitup v1.1.5
 * ajaxtree
 */

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie=function(name,value,options){if(typeof value!='undefined'){options=options||{};if(value===null){value='';options.expires=-1;}var expires='';if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){var date;if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}else{date=options.expires;}expires='; expires='+date.toUTCString();}var path=options.path?'; path='+options.path:'';var domain=options.domain?'; domain='+options.domain:'';var secure=options.secure?'; secure':'';document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');}else{var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}return cookieValue;}};
/*
 * Thickbox 3.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/
var tb_pathToImage = "common/images/img-loading.gif";

/*!!!!!!!!!!!!!!!!! edit below this line at your own risk !!!!!!!!!!!!!!!!!!!!!!!*/

//on page load call tb_init
$(function(){   
	tb_init('a.thickbox, area.thickbox, input.thickbox');//pass where to apply thickbox
	tb_init('a[href$=".jpg"], a[href$=".gif"], a[href$=".png"]');
	imgLoader = new Image();// preload image
	imgLoader.src = tb_pathToImage;
});

//add thickbox to href & area elements that have a class of .thickbox
function tb_init(domChunk){
	$(domChunk).click(function(){
	var t = this.title || this.name || null;
	var a = this.href || this.alt;
	var g = this.rel || false;
	tb_show(t,a,g);
	this.blur();
	return false;
	});
}

function tb_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link

	try {
		if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
			$("body","html").css({height: "100%", width: "100%"});
			$("html").css("overflow","hidden");
			if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
				$("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
				$("#TB_overlay").click(tb_remove);
			}
		}else{//all others
			if(document.getElementById("TB_overlay") === null){
				$("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
				$("#TB_overlay").click(tb_remove);
			}
		}
		
		if(tb_detectMacXFF()){
			$("#TB_overlay").addClass("TB_overlayMacFFBGHack");//use png overlay so hide flash
		}else{
			$("#TB_overlay").addClass("TB_overlayBG");//use background and opacity
		}
		
		if(caption===null){caption="";}
		$("body").append("<div id='TB_load'><img src='"+imgLoader.src+"' /></div>");//add loader to the page
		$('#TB_load').show();//show loader
		
		var baseURL;
//	   if(url.indexOf("?")!==-1){ //ff there is a query string involved
//			baseURL = url.substr(0, url.indexOf("?"));
//	   }else{ 
	   	baseURL = url;
//	   }

	   var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
	   var urlType = baseURL.toLowerCase().match(urlString);

		if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp'){//code to show images
				
			TB_PrevCaption = "";
			TB_PrevURL = "";
			TB_PrevHTML = "";
			TB_NextCaption = "";
			TB_NextURL = "";
			TB_NextHTML = "";
			TB_imageCount = "";
			TB_FoundURL = false;
			if(imageGroup){
				TB_TempArray = $("a[@rel="+imageGroup+"]").get();
				for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
					var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
						if (!(TB_TempArray[TB_Counter].href == url)) {						
							if (TB_FoundURL) {
								TB_NextCaption = TB_TempArray[TB_Counter].title;
								TB_NextURL = TB_TempArray[TB_Counter].href;
								TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>";
							} else {
								TB_PrevCaption = TB_TempArray[TB_Counter].title;
								TB_PrevURL = TB_TempArray[TB_Counter].href;
								TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>";
							}
						} else {
							TB_FoundURL = true;
							TB_imageCount = "Image " + (TB_Counter + 1) +" of "+ (TB_TempArray.length);											
						}
				}
			}

			imgPreloader = new Image();
			imgPreloader.onload = function(){		
			imgPreloader.onload = null;
				
			// Resizing large images - orginal by Christian Montoya edited by me.
			var pagesize = tb_getPageSize();
			var x = pagesize[0] - 150;
			var y = pagesize[1] - 150;
			var imageWidth = imgPreloader.width;
			var imageHeight = imgPreloader.height;
			if (imageWidth > x) {
				imageHeight = imageHeight * (x / imageWidth); 
				imageWidth = x; 
				if (imageHeight > y) { 
					imageWidth = imageWidth * (y / imageHeight); 
					imageHeight = y; 
				}
			} else if (imageHeight > y) { 
				imageWidth = imageWidth * (y / imageHeight); 
				imageHeight = y; 
				if (imageWidth > x) { 
					imageHeight = imageHeight * (x / imageWidth); 
					imageWidth = x;
				}
			}
			// End Resizing
			
			TB_WIDTH = imageWidth + 30;
			TB_HEIGHT = imageHeight + 60;
			$("#TB_window").append("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a> or Esc Key</div>"); 		
			
			$("#TB_closeWindowButton").click(tb_remove);
			
			if (!(TB_PrevHTML === "")) {
				function goPrev(){
					if($(document).unbind("click",goPrev)){$(document).unbind("click",goPrev);}
					$("#TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
					return false;	
				}
				$("#TB_prev").click(goPrev);
			}
			
			if (!(TB_NextHTML === "")) {		
				function goNext(){
					$("#TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					tb_show(TB_NextCaption, TB_NextURL, imageGroup);				
					return false;	
				}
				$("#TB_next").click(goNext);
				
			}

			document.onkeydown = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				} else if(keycode == 190){ // display previous image
					if(!(TB_NextHTML == "")){
						document.onkeydown = "";
						goNext();
					}
				} else if(keycode == 188){ // display next image
					if(!(TB_PrevHTML == "")){
						document.onkeydown = "";
						goPrev();
					}
				}	
			};
			
			tb_position();
			$("#TB_load").remove();
			$("#TB_ImageOff").click(tb_remove);
			$("#TB_window").css({display:"block"}); //for safari using css instead of show
			};
			
			imgPreloader.src = url;
		}else{//code to show html
				
		  firstQ = url.indexOf("?");
		  secondQ = url.indexOf("?",firstQ+1);
	    if(secondQ!==-1){ //url中に2個「?」があるとき
				var queryString = url.replace(/^[^\?]+\?[^\?]+\??/,'');
			}else{
			  var queryString = url.replace(/^[^\?]+\??/,'');
		  }
		 
			var params = tb_parseQuery( queryString );

			TB_WIDTH = (params['width']*1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
			TB_HEIGHT = (params['height']*1) + 40 || 440; //defaults to 440 if no paramaters were added to URL
			ajaxContentW = TB_WIDTH - 30;
			ajaxContentH = TB_HEIGHT - 45;
			
			if(url.indexOf('TB_iframe') != -1){// either iframe or ajax window		
					urlNoQuery = url.split('TB_');
					$("#TB_iframeContent").remove();
					if(params['modal'] != "true"){//iframe no modal
						$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a> or Esc Key</div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' > </iframe>");
					}else{//iframe modal
					$("#TB_overlay").unbind();
						$("#TB_window").append("<iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'> </iframe>");
					}
			}else{// not an iframe, ajax
					if($("#TB_window").css("display") != "block"){
						if(params['modal'] != "true"){//ajax no modal
					$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'><img src='common/images/img-btn-close.png' alt='close'></a></div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");
						}else{//ajax modal
						$("#TB_overlay").unbind();
						$("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");	
						}
					}else{//this means the window is already up, we are just loading new content via ajax
						$("#TB_ajaxContent")[0].style.width = ajaxContentW +"px";
						$("#TB_ajaxContent")[0].style.height = ajaxContentH +"px";
						$("#TB_ajaxContent")[0].scrollTop = 0;
						$("#TB_ajaxWindowTitle").html(caption);
					}
			}
					
			$("#TB_closeWindowButton").click(tb_remove);
			
				if(url.indexOf('TB_inline') != -1){	
					$("#TB_ajaxContent").append($('#' + params['inlineId']).children());
					$("#TB_window").unload(function () {
						$('#' + params['inlineId']).append( $("#TB_ajaxContent").children() ); // move elements back when you're finished
					});
					tb_position();
					$("#TB_load").remove();
					$("#TB_window").css({display:"block"}); 
				}else if(url.indexOf('TB_iframe') != -1){
					tb_position();
					if($.browser.safari){//safari needs help because it will not fire iframe onload
						$("#TB_load").remove();
						$("#TB_window").css({display:"block"});
					}
				}else{
				$("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()),function(){//to do a post change this load method
					tb_position();
						$("#TB_load").remove();
						tb_init("#TB_ajaxContent a.thickbox");
						$("#TB_window").css({display:"block"});
					});
				}
			
		}

		if(!params['modal']){
			document.onkeyup = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				}	
			};
		}
		
	} catch(e) {
		//nothing here
	}
}

//helper functions below
function tb_showIframe(){
	$("#TB_load").remove();
	$("#TB_window").css({display:"block"});
}

function tb_remove() {
 	$("#TB_imageOff").unbind("click");
	$("#TB_closeWindowButton").unbind("click");
	$("#TB_window").fadeOut("fast",function(){$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	$("#TB_load").remove();
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		$("body","html").css({height: "auto", width: "auto"});
		$("html").css("overflow","");
	}
	document.onkeydown = "";
	document.onkeyup = "";
	return false;
}

function tb_position() {
$("#TB_window").css({marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px', width: TB_WIDTH + 'px'});
	if ( !(jQuery.browser.msie && jQuery.browser.version < 7)) { // take away IE6
		$("#TB_window").css({marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'});
	}
}

function tb_parseQuery ( query ) {
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function tb_getPageSize(){
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	arrayPageSize = [w,h];
	return arrayPageSize;
}

function tb_detectMacXFF() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
    return true;
  }
}
/**
 * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/	
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
if(typeof deconcept=="undefined"){var deconcept=new Object();}if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){if(!document.getElementById){return;}this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(_1){this.setAttribute("swf",_1);}if(id){this.setAttribute("id",id);}if(w){this.setAttribute("width",w);}if(h){this.setAttribute("height",h);}if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){deconcept.SWFObject.doPrepUnload=true;}if(c){this.addParam("bgcolor",c);}var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){this.setAttribute("redirectUrl",_9);}};deconcept.SWFObject.prototype={useExpressInstall:function(_d){this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true);},setAttribute:function(_e,_f){this.attributes[_e]=_f;},getAttribute:function(_10){return this.attributes[_10];},addParam:function(_11,_12){this.params[_11]=_12;},getParams:function(){return this.params;},addVariable:function(_13,_14){this.variables[_13]=_14;},getVariable:function(_15){return this.variables[_15];},getVariables:function(){return this.variables;},getVariablePairs:function(){var _16=new Array();var key;var _18=this.getVariables();for(key in _18){_16[_16.length]=key+"="+_18[key];}return _16;},getSWFHTML:function(){var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath);}_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}var _1c=this.getVariablePairs().join("&");if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath);}_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\">";_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";var _1d=this.getParams();for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}var _1f=this.getVariablePairs().join("&");if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}return _19;},write:function(_20){if(this.getAttribute("useExpressInstall")){var _21=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title);}}if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true;}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}return false;}};deconcept.SWFObjectUtil.getPlayerVersion=function(){var _23=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){var axo=1;var _26=3;while(axo){try{_26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new deconcept.PlayerVersion([_26,0,0]);}catch(e){axo=null;}}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}}return _23;};deconcept.PlayerVersion=function(_29){this.major=_29[0]!=null?parseInt(_29[0]):0;this.minor=_29[1]!=null?parseInt(_29[1]):0;this.rev=_29[2]!=null?parseInt(_29[2]):0;};deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major){return false;}if(this.major>fv.major){return true;}if(this.minor<fv.minor){return false;}if(this.minor>fv.minor){return true;}if(this.rev<fv.rev){return false;}return true;};deconcept.util={getRequestParameter:function(_2b){var q=document.location.search||document.location.hash;if(_2b==null){return q;}if(q){var _2d=q.substring(1).split("&");for(var i=0;i<_2d.length;i++){if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){return _2d[i].substring((_2d[i].indexOf("=")+1));}}}return "";}};deconcept.SWFObjectUtil.cleanupSWFs=function(){var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i>=0;i--){_2f[i].style.display="none";for(var x in _2f[i]){if(typeof _2f[i][x]=="function"){_2f[i][x]=function(){};}}}};if(deconcept.SWFObject.doPrepUnload){if(!deconcept.unloadSet){deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);};window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true;}}if(!document.getElementById&&document.all){document.getElementById=function(id){return document.all[id];};}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;
// ----------------------------------------------------------------------------
// markItUp! Universal MarkUp Engine, JQuery plugin
// v 1.1.5
// Dual licensed under the MIT and GPL licenses.
// ----------------------------------------------------------------------------
// Copyright (C) 2007-2008 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
(function($){$.fn.markItUp=function(settings,extraSettings){var options,ctrlKey,shiftKey,altKey;ctrlKey=shiftKey=altKey=false;options={id:'',nameSpace:'',root:'',previewInWindow:'',previewAutoRefresh:true,previewPosition:'after',previewTemplatePath:'~/templates/preview.html',previewParserPath:'',previewParserVar:'data',resizeHandle:true,beforeInsert:'',afterInsert:'',onEnter:{},onShiftEnter:{},onCtrlEnter:{},onTab:{},markupSet:[{}]};$.extend(options,settings,extraSettings);if(!options.root){$('script').each(function(a,tag){miuScript=$(tag).get(0).src.match(/(.*)jquery\.markitup(\.pack)?\.js$/);if(miuScript!==null){options.root=miuScript[1];}});}return this.each(function(){var $$,textarea,levels,scrollPosition,caretPosition,caretOffset,clicked,hash,header,footer,previewWindow,template,iFrame,abort;$$=$(this);textarea=this;levels=[];abort=false;scrollPosition=caretPosition=0;caretOffset=-1;options.previewParserPath=localize(options.previewParserPath);options.previewTemplatePath=localize(options.previewTemplatePath);function localize(data,inText){if(inText){return data.replace(/("|')~\//g,"$1"+options.root);}return data.replace(/^~\//,options.root);}function init(){id='';nameSpace='';if(options.id){id='id="'+options.id+'"';}else if($$.attr("id")){id='id="markItUp'+($$.attr("id").substr(0,1).toUpperCase())+($$.attr("id").substr(1))+'"';}if(options.nameSpace){nameSpace='class="'+options.nameSpace+'"';}$$.wrap('<div '+nameSpace+'></div>');$$.wrap('<div '+id+' class="markItUp"></div>');$$.wrap('<div class="markItUpContainer"></div>');$$.addClass("markItUpEditor");header=$('<div class="markItUpHeader"></div>').insertBefore($$);$(dropMenus(options.markupSet)).appendTo(header);footer=$('<div class="markItUpFooter"></div>').insertAfter($$);if(options.resizeHandle===true&&$.browser.safari!==true){resizeHandle=$('<div class="markItUpResizeHandle"></div>').insertAfter($$).bind("mousedown",function(e){var h=$$.height(),y=e.clientY,mouseMove,mouseUp;mouseMove=function(e){$$.css("height",Math.max(20,e.clientY+h-y)+"px");return false;};mouseUp=function(e){$("html").unbind("mousemove",mouseMove).unbind("mouseup",mouseUp);return false;};$("html").bind("mousemove",mouseMove).bind("mouseup",mouseUp);});footer.append(resizeHandle);}$$.keydown(keyPressed).keyup(keyPressed);$$.bind("insertion",function(e,settings){if(settings.target!==false){get();}if(textarea===$.markItUp.focused){markup(settings);}});$$.focus(function(){$.markItUp.focused=this;});}function dropMenus(markupSet){var ul=$('<ul></ul>'),i=0;$('li:hover > ul',ul).css('display','block');$.each(markupSet,function(){var button=this,t='',title,li,j;title=(button.key)?(button.name||'')+' [Ctrl+'+button.key+']':(button.name||'');key=(button.key)?'accesskey="'+button.key+'"':'';if(button.separator){li=$('<li class="markItUpSeparator">'+(button.separator||'')+'</li>').appendTo(ul);}else{i++;for(j=levels.length-1;j>=0;j--){t+=levels[j]+"-";}li=$('<li class="markItUpButton markItUpButton'+t+(i)+' '+(button.className||'')+'"><a href="" '+key+' title="'+title+'">'+(button.name||'')+'</a></li>').bind("contextmenu",function(){return false;}).click(function(){return false;}).mouseup(function(){if(button.call){eval(button.call)();}markup(button);return false;}).hover(function(){$('> ul',this).show();$(document).one('click',function(){$('ul ul',header).hide();});},function(){$('> ul',this).hide();}).appendTo(ul);if(button.dropMenu){levels.push(i);$(li).addClass('markItUpDropMenu').append(dropMenus(button.dropMenu));}}});levels.pop();return ul;}function magicMarkups(string){if(string){string=string.toString();string=string.replace(/\(\!\(([\s\S]*?)\)\!\)/g,function(x,a){var b=a.split('|!|');if(altKey===true){return(b[1]!==undefined)?b[1]:b[0];}else{return(b[1]===undefined)?"":b[0];}});string=string.replace(/\[\!\[([\s\S]*?)\]\!\]/g,function(x,a){var b=a.split(':!:');if(abort===true){return false;}value=prompt(b[0],(b[1])?b[1]:'');if(value===null){abort=true;}return value;});return string;}return"";}function prepare(action){if($.isFunction(action)){action=action(hash);}return magicMarkups(action);}function build(string){openWith=prepare(clicked.openWith);placeHolder=prepare(clicked.placeHolder);replaceWith=prepare(clicked.replaceWith);closeWith=prepare(clicked.closeWith);if(replaceWith!==""){block=openWith+replaceWith+closeWith;}else if(selection===''&&placeHolder!==''){block=openWith+placeHolder+closeWith;}else{block=openWith+(string||selection)+closeWith;}return{block:block,openWith:openWith,replaceWith:replaceWith,placeHolder:placeHolder,closeWith:closeWith};}function markup(button){var len,j,n,i;hash=clicked=button;get();$.extend(hash,{line:"",root:options.root,textarea:textarea,selection:(selection||''),caretPosition:caretPosition,ctrlKey:ctrlKey,shiftKey:shiftKey,altKey:altKey});prepare(options.beforeInsert);prepare(clicked.beforeInsert);if(ctrlKey===true&&shiftKey===true){prepare(clicked.beforeMultiInsert);}$.extend(hash,{line:1});if(ctrlKey===true&&shiftKey===true){lines=selection.split(/\r?\n/);for(j=0,n=lines.length,i=0;i<n;i++){if($.trim(lines[i])!==''){$.extend(hash,{line:++j,selection:lines[i]});lines[i]=build(lines[i]).block;}else{lines[i]="";}}string={block:lines.join('\n')};start=caretPosition;len=string.block.length+(($.browser.opera)?n:0);}else if(ctrlKey===true){string=build(selection);start=caretPosition+string.openWith.length;len=string.block.length-string.openWith.length-string.closeWith.length;len-=fixIeBug(string.block);}else if(shiftKey===true){string=build(selection);start=caretPosition;len=string.block.length;len-=fixIeBug(string.block);}else{string=build(selection);start=caretPosition+string.block.length;len=0;start-=fixIeBug(string.block);}if((selection===''&&string.replaceWith==='')){caretOffset+=fixOperaBug(string.block);start=caretPosition+string.openWith.length;len=string.block.length-string.openWith.length-string.closeWith.length;caretOffset=$$.val().substring(caretPosition,$$.val().length).length;caretOffset-=fixOperaBug($$.val().substring(0,caretPosition));}$.extend(hash,{caretPosition:caretPosition,scrollPosition:scrollPosition});if(string.block!==selection&&abort===false){insert(string.block);set(start,len);}else{caretOffset=-1;}get();$.extend(hash,{line:'',selection:selection});if(ctrlKey===true&&shiftKey===true){prepare(clicked.afterMultiInsert);}prepare(clicked.afterInsert);prepare(options.afterInsert);if(previewWindow&&options.previewAutoRefresh){refreshPreview();}shiftKey=altKey=ctrlKey=abort=false;}function fixOperaBug(string){if($.browser.opera){return string.length-string.replace(/\n*/g,'').length;}return 0;}function fixIeBug(string){if($.browser.msie){return string.length-string.replace(/\r*/g,'').length;}return 0;}function insert(block){if(document.selection){var newSelection=document.selection.createRange();newSelection.text=block;}else{$$.val($$.val().substring(0,caretPosition)+block+$$.val().substring(caretPosition+selection.length,$$.val().length));}}function set(start,len){if(textarea.createTextRange){if($.browser.opera&&$.browser.version>=9.5&&len==0){return false;}range=textarea.createTextRange();range.collapse(true);range.moveStart('character',start);range.moveEnd('character',len);range.select();}else if(textarea.setSelectionRange){textarea.setSelectionRange(start,start+len);}textarea.scrollTop=scrollPosition;textarea.focus();}function get(){textarea.focus();scrollPosition=textarea.scrollTop;if(document.selection){selection=document.selection.createRange().text;if($.browser.msie){var range=document.selection.createRange(),rangeCopy=range.duplicate();rangeCopy.moveToElementText(textarea);caretPosition=-1;while(rangeCopy.inRange(range)){rangeCopy.moveStart('character');caretPosition++;}}else{caretPosition=textarea.selectionStart;}}else{caretPosition=textarea.selectionStart;selection=$$.val().substring(caretPosition,textarea.selectionEnd);}return selection;}function preview(){if(!previewWindow||previewWindow.closed){if(options.previewInWindow){previewWindow=window.open('','preview',options.previewInWindow);}else{iFrame=$('<iframe class="markItUpPreviewFrame"></iframe>');if(options.previewPosition=='after'){iFrame.insertAfter(footer);}else{iFrame.insertBefore(header);}previewWindow=iFrame[iFrame.length-1].contentWindow||frame[iFrame.length-1];}}else if(altKey===true){if(iFrame){iFrame.remove();}previewWindow.close();previewWindow=iFrame=false;}if(!options.previewAutoRefresh){refreshPreview();}}function refreshPreview(){if(previewWindow.document){try{sp=previewWindow.document.documentElement.scrollTop}catch(e){sp=0;}previewWindow.document.open();previewWindow.document.write(renderPreview());previewWindow.document.close();previewWindow.document.documentElement.scrollTop=sp;}if(options.previewInWindow){previewWindow.focus();}}function renderPreview(){if(options.previewParserPath!==''){$.ajax({type:'POST',async:false,url:options.previewParserPath,data:options.previewParserVar+'='+encodeURIComponent($$.val()),success:function(data){phtml=localize(data,1);}});}else{if(!template){$.ajax({async:false,url:options.previewTemplatePath,success:function(data){template=localize(data,1);}});}phtml=template.replace(/<!-- content -->/g,$$.val());}return phtml;}function keyPressed(e){shiftKey=e.shiftKey;altKey=e.altKey;ctrlKey=(!(e.altKey&&e.ctrlKey))?e.ctrlKey:false;if(e.type==='keydown'){if(ctrlKey===true){li=$("a[accesskey="+String.fromCharCode(e.keyCode)+"]",header).parent('li');if(li.length!==0){ctrlKey=false;li.triggerHandler('mouseup');return false;}}if(e.keyCode===13||e.keyCode===10){if(ctrlKey===true){ctrlKey=false;markup(options.onCtrlEnter);return options.onCtrlEnter.keepDefault;}else if(shiftKey===true){shiftKey=false;markup(options.onShiftEnter);return options.onShiftEnter.keepDefault;}else{markup(options.onEnter);return options.onEnter.keepDefault;}}if(e.keyCode===9){if(shiftKey==true||ctrlKey==true||altKey==true){return false;}if(caretOffset!==-1){get();caretOffset=$$.val().length-caretOffset;set(caretOffset,0);caretOffset=-1;return false;}else{markup(options.onTab);return options.onTab.keepDefault;}}}}init();});};$.fn.markItUpRemove=function(){return this.each(function(){$$=$(this).unbind().removeClass('markItUpEditor');$$.parent('div').parent('div.markItUp').parent('div').replaceWith($$);});};$.markItUp=function(settings){var options={target:false};$.extend(options,settings);if(options.target){return $(options.target).each(function(){$(this).focus();$(this).trigger('insertion',[options]);});}else{$('textarea').trigger('insertion',[options]);}};})(jQuery);
/*
 * ajaxtree.js - Expand and collapse a tree menu using Ajax
 *
 * Web page:
 *   http://www.revulo.com/PukiWiki/Plugin/AjaxTree.html
 *
 * Copyright (c) 2007-2008 revulo
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
var pukiwiki_ajaxtree={baseUrl:"html/ajaxtree/",init:function(){var tree=document.getElementById("ajaxtree");var isMSIE=false;tree.onclick=this.toggle;tree.onmousedown=function(){return false;};if(isMSIE){tree.ondblclick=this.toggle;tree.onselectstart=function(){return false;};}tree=null;},toggle:function(event){var element=event?event.target:window.event.srcElement;if(element.nodeName=="LI"){var li=element;var ul=li.getElementsByTagName("ul")[0];if(li.className=="expanded"){li.className="collapsed";ul.style.display="none";}else if(li.className=="collapsed"){if(ul){li.className="expanded";ul.style.display="block";}else{pukiwiki_ajaxtree.ajax(li);}}}},ajax:function(li){var req=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();if(req){var a=li.getElementsByTagName("a")[0];var name=this.rawurlencode(a.title).replace(/%/g,"%25");var url=this.baseUrl+name+".html";req.onreadystatechange=function(){if(req.readyState==4&&req.status==200){var ul=document.createElement("ul");ul.innerHTML=req.responseText;li.className="expanded";li.appendChild(ul);req=null;}};req.open("GET",url,true);req.setRequestHeader("If-Modified-Since","Thu, 01 Jan 1970 00:00:00 GMT");req.send("");}},rawurlencode:function(str){try{return encodeURIComponent(str).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A").replace(/~/g,"%7E");}catch(e){return escape(str).replace(/\+/g,"%2B").replace(/\//g,"%2F").replace(/@/g,"%40");}}};
pukiwiki_ajaxtree.init();
//EOF