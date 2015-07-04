<?php
/**
 * ===========================================================================
 * SyntaxHighlighter for PukiWiki (PukiWiki Plug-in)
 * ===========================================================================
 * 
 * @version
 * ver.0.5 (2009.04.22)
 * 
 * @author
 * ortk
 * http://ortk.main.jp/blog/
 * 
 * @copyright
 * Copyright (C) 2009 ortk.
 * 
 * @license
 * LGPL 3
 * 
 * [library]
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 */

/* ---------------------------------------------------------------------------
 settings
--------------------------------------------------------------------------- */

// SyntaxHighlighter [folder path]
define('SH_PATH', 'skin/sh/');

// SyntaxHighlighter [tag name]
define('SH_TAG_NAME', 'pre'); // 'pre' or 'textarea'

// SyntaxHighlighter [brush aliases]
define('SH_BRUSH', 'plain'); // 'plain', 'html', 'java', 'cpp', 'php', etc...


/* ---------------------------------------------------------------------------
 functions
--------------------------------------------------------------------------- */

function plugin_sh_init(){
	$messages['_sh_messages'] = array(
		'sh_init' => true
	);
	
	set_plugin_messages($messages);
}

function plugin_sh_convert(){
	$args = func_get_args();
	$argsCnt = func_num_args();
	
	$rtn = '';
	
	$contents = ($argsCnt <= 0) ? '' : end($args);
	$options = (1 < $argsCnt) ? $args[0] : SH_BRUSH;
	$rtn .= sh_get_html($contents, $options);
	
	return $rtn;
}

function sh_get_html($contents, $options){
	global $_sh_messages;
	
	$rtn = '';
	
	if($_sh_messages['sh_init']){
		$rtn .= sh_get_js();
		$_sh_messages['sh_init'] = false;
	}
	
	$rtn .= '<' . SH_TAG_NAME . ' class="brush:'. $options . ';">';
	$rtn .= htmlspecialchars($contents);
	$rtn .= '</' . SH_TAG_NAME . '>';
	
	return $rtn;
}

function sh_get_js(){
	$sh_path = SH_PATH;
	$sh_tagname = SH_TAG_NAME;
	
	$body = <<<EOD
<!-- SyntaxHighlighter(2.0) load start -->
<script type="text/javascript" src="{$sh_path}scripts/shCore.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushBash.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushCpp.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushCSharp.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushCss.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushJava.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushJScript.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushPhp.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushPlain.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushPython.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushRuby.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushSql.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushVb.js"></script>
<script type="text/javascript" src="{$sh_path}scripts/shBrushXml.js"></script>
<link type="text/css" rel="stylesheet" href="{$sh_path}styles/shCore.css"/>
<link type="text/css" rel="stylesheet" href="{$sh_path}styles/shThemeDefault.css"/>
<script type="text/javascript">
	SyntaxHighlighter.config.tagName = "{$sh_tagname}";
	SyntaxHighlighter.config.clipboardSwf = "{$sh_path}scripts/clipboard.swf";
	SyntaxHighlighter.all();
</script>
<!-- SyntaxHighlighter load end -->

EOD;

	return $body;
}
?>
