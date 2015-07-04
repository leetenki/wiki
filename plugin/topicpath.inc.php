<?php
// PukiWiki - Yet another WikiWikiWeb clone
// $Id: topicpath.inc.php,v 1.6 2005/01/29 14:31:04 henoheno Exp $
//
// 'topicpath' plugin for PukiWiki, available under GPL

// 更新履歴
// 09-11-23 デフォルトページ名を「ホーム」に変更


// Show a link to $defaultpage or not
define('PLUGIN_TOPICPATH_TOP_DISPLAY', 1);

// Label for $defaultpage
define('PLUGIN_TOPICPATH_TOP_LABEL', 'ホーム');

// Separetor / of / topic / path
define('PLUGIN_TOPICPATH_TOP_SEPARATOR', ' &gt; '); // kazuwaya

// Show the page itself or not
define('PLUGIN_TOPICPATH_THIS_PAGE_DISPLAY', 1);

// If PLUGIN_TOPICPATH_THIS_PAGE_DISPLAY, add a link to itself
define('PLUGIN_TOPICPATH_THIS_PAGE_LINK', 0);

function plugin_topicpath_convert()
{
	return '<p id="topicPath">' . plugin_topicpath_inline() . '</p>';
}

function plugin_topicpath_inline()
{
	global $script, $vars, $defaultpage;

	$page = isset($vars['page']) ? $vars['page'] : '';
	if ($page == '' || $page == $defaultpage) return '';

	$parts = explode('/', $page);

	$b_link = TRUE;
	if (PLUGIN_TOPICPATH_THIS_PAGE_DISPLAY) {
		$b_link = PLUGIN_TOPICPATH_THIS_PAGE_LINK;
	} else {
		array_pop($parts); // Remove the page itself
	}

	$topic_path = array();
	while (! empty($parts)) {
		$_landing = join('/', $parts);
		$landing  = rawurlencode($_landing);
		$element = htmlspecialchars(array_pop($parts));
		if (! $b_link)  {
			// This page ($_landing == $page)
			$b_link = TRUE;
			$topic_path[] = $element;
		} else if (PKWK_READONLY && ! is_page($_landing)) {
			// Page not exists
			$topic_path[] = $element;
		} else {
			// Page exists or not exists
			$topic_path[] = '<a href="' . $script . '?' . $landing . '">' .
				$element . '</a>';
		}
	}

	if (PLUGIN_TOPICPATH_TOP_DISPLAY)
		$topic_path[] = make_pagelink($defaultpage, PLUGIN_TOPICPATH_TOP_LABEL);

	return join(PLUGIN_TOPICPATH_TOP_SEPARATOR, array_reverse($topic_path));
}
?>
