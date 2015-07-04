/* ------------------------------------------------------------
	
	filename:	function.js
	created:	080211
	update:		091119
	copyright:	(c)2009 kazuwaya All rights reserved.

------------------------------------------------------------ */

/* ちらつき回避 */
try {
	document.execCommand('BackgroundImageCache', false, true);
} catch(e) {}

//ブラウザ判定
var ua = navigator.userAgent;
var win = (ua.indexOf("Windows")!=-1);
var mac = (ua.indexOf("Macintosh")!=-1);
var ie = (ua.indexOf("MSIE")!=-1);
var ie5 = (ua.indexOf("MSIE 5")!=-1);
var ie6 = (ua.indexOf("MSIE 6")!=-1);
var ie7 = (ua.indexOf("MSIE 7")!=-1);
var ie8 = (ua.indexOf("MSIE 8")!=-1);
var moz = (ua.indexOf("Firefox")!=-1);
var webkit = (ua.indexOf("Safari")!=-1);

$(function(){
	// nav
	$('div#mainContents p').click(function(){
		$.get("?%3Anavigation");
	});
	
	//adclass
	var mC = $('div#mainContents');
	var lo = mC.find('div.locator');
	var tx = $('p,ul,ol,li,dl,dt,dd,table,tr,th,td');

	mC.find('ul,table').each(function(){
		$(this).find('li:odd,tr:odd').addClass('even');
		$(this).find('li:even,tr:even').addClass('odd');
	});
	
	if(ie6||ie7){
		tx.filter(':last-child').not(':only-child').addClass('lastChild');// lastChild
		if(ie6){
			lo.find('h2,h3,h4').filter(':first-child').addClass('firstChild');// ロケータの中に見だしがある場合
			lo.next('h2,h3,h4').addClass('siblingA');// ロケータの次に見出しがある場合
			mC.find('h2 + h3,h3 + h4').addClass('siblingB');// 見出しが連続する場合
			mC.find('h2 + div.locator h3,h3 + div.locator h4').filter(':first-child').addClass('siblingB');// ロケータをはさんで見出しが連続する場合
			tx.filter(':first-child').not(":only-child").addClass('firstChild');// firstChild
		}
	}
	
	//カレント表示
	$('ul#globalNav a').each(function(){
		if (this.href == location.href) {
			$(this.parentNode).addClass('current');
		}
	});

	$('div.toolBar a').each(function(){
		if (this.href == location.href) {
			$(this.parentNode).addClass('current');
		}
	});

	//ie6ツール表示
	if(ie6){
		$('div.toolBar dl#tools').hover(function(){
    	$(this).addClass('hover');
		},function(){
    	$(this).removeClass('hover');
  	});
	}
	
	// フォームにフォーカス
	$("input#word").focus();
		
	// フォームをセレクト
	$("input#autoSelect").click(function(){
		$(this).select();
	});

	//別窓ウインドウ
	$('a[href^="http"]').not('a[href*="'+document.domain+'"],a:has(img)').click(function(){
		window.open(this.href, "_blank");
		return false;
	}).each(function() {
		$(this).append('<img src="common/images/icon-win.gif" width="12" height="10" alt="別ウインドウ" class="external">');
	});

	$('img + img.external').remove();

	$('li.twitter a').click(function(){
		window.open(this.href, "_blank");
		return false;
	});

	// 文字サイズ変更
	var fontSizeS = '83.33%';
	var fontSizeM = '100%';
	var fontSizeL = '116.66%';

	$('div#platform').css('font-size',$.cookie('fontSize'));
	$('#fontSize li').filter('#'+$.cookie('fontId')).addClass('current').css('opacity','0.5');											 

	$('#fontSize li').click(function(){
		var id = $(this).attr('id');
		if(id=='fontS'){ var size = fontSizeS; }
		if(id=='fontM'){ var size = fontSizeM; }
		if(id=='fontL'){ var size = fontSizeL; }
		$('#platform').css('font-size',size);
		$('#fontSize li').removeClass('current').css('opacity','1.0');										 	
		$(this).addClass('current').css('opacity','0.5');										 
		$.cookie('fontId',id,{expires:30,path:'/'});
		$.cookie('fontSize',size,{expires:30,path:'/'});
	});

	// ----------------------------------------------------------------------------
	// markItUp!
	// ----------------------------------------------------------------------------
	// Copyright (C) 2008 Jay Salvat
	// http://markitup.jaysalvat.com/
	// ----------------------------------------------------------------------------
	myWikiSettings = {
			nameSpace:          "wiki", // Useful to prevent multi-instances CSS conflict
			onShiftEnter:       {keepDefault:false, replaceWith:'\n\n'},
			markupSet:  [
					{name:'大見出し', openWith:'*' },
					{name:'中見出し', openWith:'**' },
					{name:'小見出し', openWith:'***' },
					{name:'番号なしリスト', openWith:'-'}, 
					{name:'番号付きリスト', openWith:'+'}, 
					{name:'定義リスト', openWith:':定義語|説明'}, 
					{name:'引用', openWith:'>'},
					{name:'区切り線', openWith:'----'}, 
					{name:'リンク', openWith:'[[[![Link]!]', closeWith:']]'},
					{name:'画像', replaceWith:'#ref([![Url:!:http://]!]);'}, 
					{name:'太字', openWith:"''", closeWith:"''"}, 
					{name:'斜体', openWith:"'''", closeWith:"'''"}, 
			]
	}
	
	$('#editor').markItUp(myWikiSettings);
});