<?php
// $Id: newpage_subdir.inc.php,v 1.2 2003/05/14 15:26:43 rokudo Exp $
// @based_on newpage.inc.php
// @based_on ls2.inc.php
// @thanks to panda (auther of newpage.inc.php/ls2.inc.php)

// 更新履歴
// 09-01-12 マークアップを修正


function build_directory_list($roots, $option) {

	global $WikiName,$BracketName,$script;
	
	$existingPages = get_existpages();	
	foreach($roots as $root) {
		$matched = false;
		foreach($existingPages as $page) {
			$page = strip_bracket($page);
//			if (preg_match("/^$root.*$/", $page)){
			if (strpos($page,$root) === 0){
				if($option['directory only'] && strrpos($page, "/") >= strlen($root) ) {
					$page = substr($page,0, strrpos($page, "/"));
					$list["directory"][] = $page;
				} else {
					$list["directory"][] = $page;
				}
				while( strrpos($page, "/") >= strlen($root) ) {
					$page = substr($page,0, strrpos($page, "/"));
					$list["directory"][] = $page;
				}
				$matched = true;
			}
		}
		if(!$matched) {
			$list["directory"][] = $root;

			$warnings[] = 
			"<font color=\"red\">#$root は該当するページがありません。</font>
			(<a href=\"$script?".rawurlencode($root)."\">作成</a>)<br>\n";
		}
	}
	$list["directory"] = array_unique($list["directory"]);
	natcasesort($list["directory"]);

	if(!$option["quiet"]) {
		$list["warning"] = $warnings;
	}
	return $list;
}

function print_form_string( $list ) {
	global $script,$vars,$_btn_edit,$_msg_newpage;
	
	$form_string = "<form action=\"$script\" method=\"post\">\n";
	$form_string.= "<p>\n";
	$form_string.= "$_msg_newpage: ";

	if($list["directory"]) {
		$form_string.= "<select name=\"directory\">\n";
		foreach( $list["directory"] as $dir ) {
			$form_string.= "<option>$dir/</option>\n";
		}
		$form_string.= "</select>\n";
	}
	
	$form_string.= "<input type=\"hidden\" name=\"plugin\" value=\"newpage_subdir\" />\n";
	$form_string.= "<input type=\"hidden\" name=\"refer\" value=\"$vars[page]\" />\n";
	$form_string.= "<input type=\"text\" name=\"page\" size=\"30\" value=\"\" />\n";
	$form_string.= "<input type=\"submit\" value=\"$_btn_edit\" />\n";
	$form_string.= "</p>\n";
	$form_string.= "</form>\n";

	if($list["warning"]) {
		foreach( $list["warning"] as $warning ) {
			$form_string.= $warning;
		}
	}

	return $form_string;
}

function print_help_message() {
	return 
	'
		#newpage_subdir([directory]... ,[option]... )<br>
		<br>
		DESCRIPTION<br>
		　directoryに指定されたディレクトリ以下に新しいページを追加するフィールドを作成する。<br>
		　パラメータの順番は任意。<br>
		　未定義のオプションを指定した場合、メッセージとともにHelpを表示する。<br>
		<br>
		OPTION<br>
		　-d Directory Only.	子ページをもっているものだけに限定する（明示的に指定されたディレクトリは例外）<br>
		　-h Help.				このデスクリプションを表示する。 <br>
		　-q Quiet.				警告を表示しない。<br>
		<br>
		EXAMPLE<br>
		　#newpage_subdir() -&gt; implies: #newpage_subdir(&lt;current dir&gt;)　<br>
		　#newpage_subdir(foo/var)<br>
		　#newpage_subdir(foo/var, -n)<br>
		　#newpage_subdir(-d,-q, foo/var, foo/vaz)<br>
		　#newpage_subdir(-h)<br>
		　#newpage_subdir(-XYZ) -&gt; implies : #newpage_subdir(-h)<br>
	';
}

function plugin_newpage_subdir_init()
{
  $_plugin_recent_messages = array(
    '_msg_newpage' => 'ページ新規作成'
  );
  set_plugin_messages($_plugin_recent_messages);
}

function plugin_newpage_subdir_convert()
{
	global $vars;
	$available_option="rdhq";

	// parsing all parameters
	foreach(func_get_args() as $arg) {
		$arg = trim($arg);
		// options
		if(preg_match("/^\-[a-z\-\s]+\$/",$arg)) {
			for($i=1;$i<strlen($arg);$i++){
				switch($arg{$i}) {
					case 'd' : 
						$option['directory only'] |= 1; 
						break;
					case 'q' : 
						$option['quiet'] |= 1; 
						break;
					case ' ' :
					case '-' :
						break;
					case 'h' :						
					default:
						$option['help'] |= 1; break;
						break;
				}
			}
		}
		// directory roots
		else {
			$roots[] = $arg;
		}
	}
	
	if($option['help']) {
		return print_help_message();
	}
	if(!$roots) {
		$roots[] = strip_bracket($vars["page"]);
	}

	return print_form_string(build_directory_list($roots, $option));
}

function plugin_newpage_subdir_action()
{
	global $script, $vars, $_msg_newpage;

	if(!$vars["page"]) {
		if($vars["directory"]) {
			$directory = strip_bracket($vars["directory"]);
			$roots[] =  substr($directory, 0, strlen($directory)-1);
			$msg_prefix = $directory."..に";
		}
		$action_messages["msg"] = $msg_prefix . $_msg_newpage;
		$action_messages["body"] = print_form_string(build_directory_list($roots));
		return $action_messages;
	}
	
	header("Location: $script?".rawurlencode($vars['directory'].$vars["page"]));
	die();
}
?>
