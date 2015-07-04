<?php
// PukiWiki - Yet another WikiWikiWeb clone.
// $Id: pukiwiki.skin.php,v 1.48 2006/03/07 14:03:02 henoheno Exp $
// Copyright (C)
//   2002-2006 PukiWiki Developers Team
//   2001-2002 Originally written by yu-ji
// License: GPL v2 or (at your option) any later version
//
// PukiWiki default skin

// ------------------------------------------------------------
// 更新履歴
// 09-07-11：url inputにidを付与

// ------------------------------------------------------------
// Settings (define before here, if you want)

// Set site identities
$_IMAGE['skin']['logo']     = 'lee.png';
$_IMAGE['skin']['favicon']  = ''; // Sample: 'image/favicon.ico';

// SKIN_DEFAULT_DISABLE_TOPICPATH // kazuwaya
//   1 = Show reload URL
//   0 = Show topicpath
//if (! defined('SKIN_DEFAULT_DISABLE_TOPICPATH'))
//	define('SKIN_DEFAULT_DISABLE_TOPICPATH', 1); // 1, 0

// Show / Hide navigation bar UI at your choice
// NOTE: This is not stop their functionalities!
if (! defined('PKWK_SKIN_SHOW_NAVBAR'))
	define('PKWK_SKIN_SHOW_NAVBAR', 1); // 1, 0
	
if (! defined('PKWK_SKIN_SHOW_NEWPAGE'))
	define('PKWK_SKIN_SHOW_NEWPAGE', 1); // 1, 0	

// Show / Hide toolbar UI at your choice
// NOTE: This is not stop their functionalities!
if (! defined('PKWK_SKIN_SHOW_TOOLBAR'))
	define('PKWK_SKIN_SHOW_TOOLBAR', 0); // 1, 0 // kazuwaya

// ------------------------------------------------------------
// Code start

// Prohibit direct access
if (! defined('UI_LANG')) die('UI_LANG is not set');
if (! isset($_LANG)) die('$_LANG is not set');
if (! defined('PKWK_READONLY')) die('PKWK_READONLY is not set');

$lang  = & $_LANG['skin'];
$link  = & $_LINK;
$image = & $_IMAGE['skin'];
$rw    = ! PKWK_READONLY;

// Decide charset for CSS
$css_charset = 'iso-8859-1';
switch(UI_LANG){
	case 'ja': $css_charset = 'Shift_JIS'; break;
}

// ------------------------------------------------------------
// Output

// HTTP headers
pkwk_common_headers();
header('Cache-control: no-cache');
header('Pragma: no-cache');
header('Content-Type: text/html; charset=' . CONTENT_CHARSET);

// HTML DTD, <html>, and receive content-type
if (isset($pkwk_dtd)) {
	$meta_content_type = pkwk_output_dtd($pkwk_dtd);
} else {
	$meta_content_type = pkwk_output_dtd();
}

?>
<head>
<?php echo $meta_content_type ?>
<meta http-equiv="content-style-type" content="text/css" />
<meta http-equiv="content-script-type" content="text/javascript" />
<title><?php echo $title ?>&nbsp;|&nbsp;<?php echo $page_title ?></title>
<?php if ($nofollow || ! $is_read)  { ?>
<meta name="robots" content="NOINDEX,NOFOLLOW" />
<?php } ?>
<link rel="shortcut icon" href="<?php echo $image['favicon'] ?>" />
<link rel="alternate" type="application/rss+xml" title="RSS" href="<?php echo $link['rss'] ?>" />
<link rel="home" href="<?php echo $link['top'] ?>" title="ホーム" />
<link rel="help" href="<?php echo $link['help'] ?>" title="ヘルプ" />
<link rev="made" href="<?php echo $link['about'] ?>" title="このサイトについて" />
<link rel="stylesheet" type="text/css" href="common/css/import.css" media="all" />
<?php // RSS auto-discovery ?>
<?php if (PKWK_ALLOW_JAVASCRIPT && $trackback_javascript) { ?>
<script type="text/javascript" src="skin/trackback.js"></script>
<?php } ?>
<?php echo $head_tag ?>
</head>
<body>
<ul id="skipNavi">
<li><a href="#mainContents">ページ内容へ</a></li>
<li><a href="#globalNav">ナビゲーションへ</a></li>
</ul>
<noscript>
<p class="noscript">当サイトをご覧いただくにはブラウザの設定で<strong>JavaScriptを有効に設定</strong>する必要がございます。</p>
</noscript>
<div id="platform" class="typeD">
<div id="header">
<p id="siteId"><a href="<?php echo $link['top'] ?>"><!--<img src="common/images/lee.png" alt="PUKIWIKI" width="70" height="70" />--></a></p>
<ul id="remoteNav">
<!--
<li><a href="<?php echo $link['list'] ?>">ページの一覧</a></li>
<li><a href="<?php echo $link['recent'] ?>">最終更新一覧</a></li>
<li><a href="<?php echo $link['help'] ?>">ヘルプ</a></li>
<li><a href="<?php echo $link['rss'] ?>" title="rss"><img src="image/rss.png" alt="RSS" width="36" height="14" /></a></li>
</ul>
-->
<ul id="globalNav">
<!--
<li><a href="<?php echo $link['top'] ?>">ホーム</a></li>
<li><a href="<?php echo $link['about'] ?>">このサイトについて</a></li>
-->
</ul>
<form action="<?php echo $script ?>" method="post">
<p id="search">
<input type="hidden" name="cmd" value="search" />
<input type="hidden" name="type" id="searchAND" value="AND"  checked="checked" class="condition" />
<input type="text"  name="word" id="word" size="64" class="txt" tabindex="1" accesskey="f" />
<input type="submit" value="検索" class="submit"  tabindex="2" accesskey="k" />
</p>
</form>
<!--
<dl id="fontSize">
<dt><img src="common/images/img-fontchange.png" width="50" height="10" alt="文字サイズ" /></dt>
<dd>
<ul>
<li id="fontS">文字サイズ：小</li>
<li id="fontM">文字サイズ：中</li>
<li id="fontL">文字サイズ：大</li>
</ul>
</dd>
</dl>
-->
<!-- /header --></div>
<div id="mainContents">
<div class="toolBar">
<?php if (! $is_page) { ?>
<p class="backNav"><a href="javascript:history.back()">1つ前のページに戻る</a></p>
<?php } ?>
<?php if(PKWK_SKIN_SHOW_NAVBAR) { ?>
<?php
function _navigator($key, $value = '', $javascript = ''){
	$lang = & $GLOBALS['_LANG']['skin'];
	$link = & $GLOBALS['_LINK'];
	if (! isset($lang[$key])) { echo 'LANG NOT FOUND'; return FALSE; }
	if (! isset($link[$key])) { echo 'LINK NOT FOUND'; return FALSE; }
	if (! PKWK_ALLOW_JAVASCRIPT) $javascript = '';

	echo '<a href="' . $link[$key] . '" ' . $javascript . '>' .
		(($value === '') ? $lang[$key] : $value) .
		'</a>';

	return TRUE;
}
?>
<?php if ($is_page) { ?>
<?php if ($rw) { ?>
<ul id="tab">
<li>
<?php _navigator('reload') ?>
</li>
<li>
<?php _navigator('edit') ?>
</li>
</ul>
<dl id="tools">
<dt><span>ツール</span></dt>
<dd>
<ul>
<li>
<?php _navigator('rename') ?>
</li>
<li>
<?php (! $is_freeze) ? _navigator('freeze') : _navigator('unfreeze') ?>
</li>
<li>
<?php _navigator('diff') ?>
</li>
<?php if ($do_backup) { ?>
<li>
<?php _navigator('backup') ?>
</li>
<?php } ?>
<?php if ((bool)ini_get('file_uploads')) { ?>
<li>
<?php _navigator('upload') ?>
</li>
<?php } ?>
<li>
<?php _navigator('copy') ?>
</li>
<?php if (arg_check('list')) { ?>
<li>
<?php _navigator('filelist') ?>
</li>
<?php } ?>
<?php if ($trackback) { ?>
<li>
<?php _navigator('trackback', $lang['trackback'] . '(' . tb_count($_page) . ')',
 	($trackback_javascript == 1) ? 'onclick="OpenTrackback(this.href); return false"' : '') ?>
</li>
<?php } ?>
<?php if ($referer) { ?>
<li>
<?php _navigator('refer') ?>
</li>
<?php } ?>
</ul>
</dd>
</dl>
<?php } ?>
<!--<p class="btn"><a href="javascript:window.print();">印刷</a></p>-->
<?php } ?>
<?php } // PKWK_SKIN_SHOW_NAVBAR ?>
<!-- /toolBar --></div>
<div class="inner">
<!--
<?php require_once(PLUGIN_DIR.'topicpath.inc.php'); echo plugin_topicpath_convert(); ?>
-->
<h1><?php echo $page ?></h1>
<?php if (arg_check('read')) { ?>
<!--
<div class="articleInfo">
<p id="lastModified">更新日: <?php echo $lastmodified ?></p>
</div>
-->
<?php } ?>
<?php echo $body ?>
<?php if ($notes != '') { ?>
<ol class="notes">
<?php echo $notes ?>
</ol>
<?php } ?>
<?php if ($lastmodified != '') { ?>
<?php } ?>
<!-- /inner --></div>
<?php if (arg_check('read')) { ?>
<div id="function">
<?php if ($attaches != '') { ?>
<p><?php echo $attaches ?></p>
<?php } ?>
<?php if ($related != '') { ?>
<dl id="relatedLinks">
<dt>Link：</dt>
<dd><?php echo $related ?></dd>
</dl>
<?php } ?>
<!--
<dl id="share">
<dt>このページを共有：</dt>
<dd>
<ul>
<li class="twitter"><a href="http://twitter.com/?status=<?php echo $link['reload'] ?>"><img src="common/images/icon/twitter.png" alt="つぶやく" title="つぶやく" width="16" height="16" /></a></li>
<li class="hatena"><a href="http://b.hatena.ne.jp/add?mode=confirm&amp;url=<?php echo $link['reload'] ?>&amp;title=<?php echo $title ?>"><img src="common/images/icon/b_entry.gif" width="16" height="12" alt="このページをはてなブックマークに追加" title="このページをはてなブックマークに追加" /></a> <a href="http://b.hatena.ne.jp/entry/<?php echo $link['reload'] ?>"><img src="http://b.hatena.ne.jp/entry/image/<?php echo $link['reload'] ?>" alt="このページを含むはてなブックマーク" title="このページを含むはてなブックマーク" /></a></li>
<li class="livedoor"><a href="http://clip.livedoor.com/clip/add?link=<?php echo $link['reload'] ?>&amp;title=<?php echo $title ?>%20%7C%20<?php echo $page_title ?>&amp;ie=utf-8" class="ldclip-redirect"><img src="http://parts.blog.livedoor.jp/img/cmn/clip_16_16_w.gif" width="16" height="16" alt="このページをlivedoor クリップに追加" title="このページをlivedoor クリップに追加" /></a> <a href="http://clip.livedoor.com/page/<?php echo $link['reload'] ?>"><img src="http://image.clip.livedoor.com/counter/<?php echo $link['reload'] ?>" alt="このページを含むlivedoor クリップ" title="このページを含むlivedoor クリップ" /></a></li>
<li class="yahoo"><a href="javascript:location.href='http://bookmarks.yahoo.co.jp/action/bookmark?t='+encodeURIComponent(document.title)+'&amp;u='+encodeURIComponent(location.href);"><img src="http://i.yimg.jp/images/sicons/ybm16.gif" width="16" height="16" alt="このページをYahoo!ブックマークに追加" title="このページをYahoo!ブックマークに追加" /></a></li>
<li class="delicious"><a href="javascript:location.href='http://del.icio.us/post?url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title)"><img src="common/images/icon/delicious.gif" width="12" height="12" alt="このページをdel.icio.usに追加" title="このページをdel.icio.usに追加" /></a></li>
<li class="google"><a href="http://www.google.com/bookmarks/mark?op=edit&amp;bkmk=<?php echo $link['reload'] ?>&amp;title=<?php echo $title ?>%20%7C%20<?php echo $page_title ?>"><img src="http://www.google.co.jp/favicon.ico" alt="このページをGoogleブックマークに追加" title="このページをGoogleブックマークに追加" /></a></li>
</ul>
</dd>
</dl>
<p id="pageurl">このページのURL：
<input name="pageurl" type="text" value="<?php echo $link['reload'] ?>" size="64" tabindex="100" id="autoSelect" />
</p>
-->
<!-- /function --></div>
<?php } ?>
<!-- /mainContents --></div>
<div id="subContents">
<?php if(PKWK_SKIN_SHOW_NEWPAGE) { ?>
<?php
function _newpage($key, $value = '', $javascript = ''){
	$lang = & $GLOBALS['_LANG']['skin'];
	$link = & $GLOBALS['_LINK'];
	if (! isset($lang[$key])) { echo 'LANG NOT FOUND'; return FALSE; }
	if (! isset($link[$key])) { echo 'LINK NOT FOUND'; return FALSE; }
	if (! PKWK_ALLOW_JAVASCRIPT) $javascript = '';

	echo '<a href="' . $link[$key] . '" ' . $javascript . '>' .
		(($value === '') ? $lang[$key] : $value) .
		'</a>';

	return TRUE;
}
?>
<?php if ($rw) { ?>	
<div id="newPage">
<p class="btn"><a href="#TB_inline?width=400&height=112&inlineId=platformF" class="thickbox">ページ新規作成</a></p>
<!--<p>新しいページはこちらから投稿できます。</p>-->
<!-- /newPage --></div>
<?php } ?>
<?php } // PKWK_SKIN_SHOW_NEWPAGE ?>
<?php if (exist_plugin_convert('menu')) { ?>
<div id="menu"><?php echo do_plugin_convert('menu') ?>
<!-- /menu --></div>
<?php } ?>
<!-- /subContents --></div>
<div id="footer">
<?php if (PKWK_SKIN_SHOW_TOOLBAR) { ?>
<div class="toolBar">
<p>
<?php

// Set toolbar-specific images
$_IMAGE['skin']['reload']   = 'reload.png';
$_IMAGE['skin']['new']      = 'new.png';
$_IMAGE['skin']['edit']     = 'edit.png';
$_IMAGE['skin']['freeze']   = 'freeze.png';
$_IMAGE['skin']['unfreeze'] = 'unfreeze.png';
$_IMAGE['skin']['diff']     = 'diff.png';
$_IMAGE['skin']['upload']   = 'file.png';
$_IMAGE['skin']['copy']     = 'copy.png';
$_IMAGE['skin']['rename']   = 'rename.png';
$_IMAGE['skin']['top']      = 'top.png';
$_IMAGE['skin']['list']     = 'list.png';
$_IMAGE['skin']['search']   = 'search.png';
$_IMAGE['skin']['recent']   = 'recentchanges.png';
$_IMAGE['skin']['backup']   = 'backup.png';
$_IMAGE['skin']['help']     = 'help.png';
$_IMAGE['skin']['rss']      = 'rss.png';
$_IMAGE['skin']['rss10']    = & $_IMAGE['skin']['rss'];
$_IMAGE['skin']['rss20']    = 'rss20.png';
$_IMAGE['skin']['rdf']      = 'rdf.png';

function _toolbar($key, $x = 20, $y = 20){
	$lang  = & $GLOBALS['_LANG']['skin'];
	$link  = & $GLOBALS['_LINK'];
	$image = & $GLOBALS['_IMAGE']['skin'];
	if (! isset($lang[$key]) ) { echo 'LANG NOT FOUND';  return FALSE; }
	if (! isset($link[$key]) ) { echo 'LINK NOT FOUND';  return FALSE; }
	if (! isset($image[$key])) { echo 'IMAGE NOT FOUND'; return FALSE; }

	echo '<a href="' . $link[$key] . '">' .
		'<img src="' . IMAGE_DIR . $image[$key] . '" width="' . $x . '" height="' . $y . '" ' .
			'alt="' . $lang[$key] . '" title="' . $lang[$key] . '" />' .
		'</a>';
	return TRUE;
}
?>
<?php _toolbar('top') ?>
<?php if ($is_page) { ?>
<?php if ($rw) { ?>
<?php _toolbar('edit') ?>
<?php if ($is_read && $function_freeze) { ?>
<?php if (! $is_freeze) { _toolbar('freeze'); } else { _toolbar('unfreeze'); } ?>
<?php } ?>
<?php } ?>
<?php _toolbar('diff') ?>
<?php if ($do_backup) { ?>
<?php _toolbar('backup') ?>
<?php } ?>
<?php if ($rw) { ?>
<?php if ((bool)ini_get('file_uploads')) { ?>
<?php _toolbar('upload') ?>
<?php } ?>
<?php _toolbar('copy') ?>
<?php _toolbar('rename') ?>
<?php } ?>
<?php _toolbar('reload') ?>
<?php } ?>
<?php if ($rw) { ?>
<?php _toolbar('new') ?>
<?php } ?>
<?php _toolbar('list')   ?>
<?php _toolbar('search') ?>
<?php _toolbar('recent') ?>
<?php _toolbar('help') ?>
<?php _toolbar('rss10', 36, 14) ?>
</p>
<!-- /toolBar --></div>
<?php } // PKWK_SKIN_SHOW_TOOLBAR ?>
<!--
<address>
Site admin: <a href="<?php echo $modifierlink ?>"><?php echo $modifier ?></a>
</address>
<p><?php echo S_COPYRIGHT ?>.Powered by PHP <?php echo PHP_VERSION ?>. HTML convert time: <?php echo $taketime ?> sec.</p>
<address>
Copyright&copy; 2009 <a href="http://www.kazuwaya.jp">kazuwaya.jp</a>
</address>
-->
<!-- /footer --></div>
<p id="goToTop"><a href="#platform"><img src="common/images/img-gototop.gif" width="40" height="24" alt="TOP" /></a></p>
<!-- /platform --></div>
<div id="platformF">
<div id="floatNewPage">
<?php if (exist_plugin_convert('newpage')) {
echo do_plugin_convert('newpage');
} ?>
<!--
<?php if (exist_plugin_convert('newpage_subdir')) {
echo do_plugin_convert('newpage_subdir');
} ?>
-->
<!-- /floatNewPage --></div>
<!-- /platformF --></div>
<script type="text/javascript" src="common/js/import.js"></script>
</body>
</html>