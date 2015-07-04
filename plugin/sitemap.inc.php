<?php

/**
 * sitemap.inc.php - Output a sitemap for search engine crawlers
 *
 * @author     revulo
 * @licence    http://www.gnu.org/licenses/gpl-2.0.html  GPLv2
 * @version    1.0
 * @link       http://www.revulo.com/PukiWiki/Plugin/Sitemap.html
 * @link       http://www.sitemaps.org/
 */

// Black list
if (!defined('PLUGIN_SITEMAP_BLACK_LIST')) {
    define('PLUGIN_SITEMAP_BLACK_LIST', '');
}

// White list
if (!defined('PLUGIN_SITEMAP_WHITE_LIST')) {
    define('PLUGIN_SITEMAP_WHITE_LIST', '');
}

// Variable names of system page
if (!isset($GLOBALS['PLUGIN_SITEMAP_SYSTEM_PAGE_VARS'])) {
    $GLOBALS['PLUGIN_SITEMAP_SYSTEM_PAGE_VARS'] = array(
        'whatsnew', 'whatsdeleted', 'menubar', 'sidebar', 'navigation'
    );
}


function plugin_sitemap_action()
{
    $lastmodified = filemtime(CACHE_DIR . 'recent.dat');

    if ($lastmodified <= plugin_sitemap_if_modified_since()) {
        header('HTTP/1.1 304 Not Modified');
    } else {
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastmodified) . ' GMT');
        plugin_sitemap_output_sitemap();
    }
    exit;
}

function plugin_sitemap_if_modified_since()
{
    if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) === true) {
        $str = $_SERVER['HTTP_IF_MODIFIED_SINCE'];
        if (($pos = strpos($str, ';')) !== false) {
            $str = substr($str, 0, $pos);
        }
        if (strpos($str, ',') === false) {
            $str .= ' GMT';
        }
        $time = strtotime($str);
        if (is_int($time) === true) {
            return $time;
        }
    }
    return -1;
}

function plugin_sitemap_filter_pages(&$pages)
{
    global $non_list, $read_auth;

    foreach ($GLOBALS['PLUGIN_SITEMAP_SYSTEM_PAGE_VARS'] as $var) {
        if (isset($GLOBALS[$var])) {
            $page = $GLOBALS[$var];
            $key  = encode($page) . '.txt';
            unset($pages[$key]);
        }
    }

    if (PLUGIN_SITEMAP_WHITE_LIST !== '') {
        $includes = preg_grep('/' . PLUGIN_SITEMAP_WHITE_LIST . '/', $pages);
    } else {
        $includes = array();
    }

    if (PLUGIN_SITEMAP_BLACK_LIST !== '') {
        $pattern = '/(?:' . $non_list . ')|(?:' . PLUGIN_SITEMAP_BLACK_LIST . ')/';
    } else {
        $pattern = '/' . $non_list . '/';
    }
    if (version_compare(PHP_VERSION, '4.2.0', '>=')) {
        $pages = preg_grep($pattern, $pages, PREG_GREP_INVERT);
    } else {
        $pages = array_diff($pages, preg_grep($pattern, $pages));
    }

    if ($includes) {
        $pages += $includes;
    }

    if ($read_auth) {
        foreach ($pages as $key => $page) {
            if (check_readable($page, false, false) === false) {
                unset($pages[$key]);
            }
        }
    }
}

function plugin_sitemap_get_page_url($page)
{
    global $defaultpage;
    static $script;

    if (isset($script) === false) {
        $script = get_script_uri();
    }

    if ($page === $defaultpage) {
        return $script;
    } else {
        return $script . '?' . rawurlencode($page);
    }
}

function plugin_sitemap_output_sitemap()
{
    $pages = get_existpages();
    plugin_sitemap_filter_pages($pages);

    $timestamps = array();
    foreach ($pages as $page) {
        $timestamps[$page] = get_filetime($page);
    }

    $timezone = substr_replace(date('O'), ':', 3, 0);

    header('Content-type: application/xml');

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    foreach ($timestamps as $page => $timestamp) {
        $url  = plugin_sitemap_get_page_url($page);
        $date = date('Y-m-d\TH:i:s', $timestamp) . $timezone;

        echo ' <url>' . "\n";
        echo '  <loc>' . $url . '</loc>' . "\n";
        echo '  <lastmod>' . $date . '</lastmod>' . "\n";
        echo ' </url>' . "\n";
    }

    echo '</urlset>' . "\n";
}

?>
