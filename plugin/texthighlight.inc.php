<?php
/*
 *  シンタックスハイライトプラグイン - texthighlight 2.0
 * 
 * プログラムコードなどをシンタックスハイライト (＋行番号付け) して
 * 表示するプラグイン。内部で shjs というライブラリを使っています。
 * 
 * by Osamu TAKEUCHI <osamu@big.jp> http://dora.bk.tsukuba.ac.jp/~takeuchi/
 * 
 * 利用・配布・改変は自由に行ってください。
 * ただし、結果について作者は保証しません。
 * 各自の責任で行うようにしてください。
 * 
 * 
 * 使い方：
 * 
 * インストールはまず pukiwiki の plugin フォルダに texthighlight.inc.php 
 * を放り込む。
 * 
 * http://shjs.sourceforge.net/index.html から shjs を落としてきて、
 * pukiwiki フォルダの直下(plugin フォルダと同じ階層)に shjs という
 * 名前のフォルダを掘ってそこに展開する。
 * 
 * このプログラムは実際にはプラグインではなくフィルタのようなものなので、
 * plugin フォルダに入れるだけでは動かない。
 *
 * スキンファイル (skin/pukiwiki.skin.php など) を以下の要領で変更する。
 *
 * return $body; となっている部分を return texthighlight($body); とする。
 * その直前に require_once("plugin/texthighlight.inc.php"); も必要。
 *
 * ヘッダ部分で shjs ライブラリへのリンクを張る
 *   <link rel="stylesheet" type="text/css" href="shjs/css/sh_ide-eclipse.css" />
 *   <script type="text/javascript" src="shjs/sh_main.js"></script>
 * 
 * body onLoad で shjs を呼び出す
 *   <body onLoad="sh_highlightDocument('shjs/lang/', '.js');">
 *
 */

function texthighlight($body)
{
    // 本当は以下のように preg_replace_callback 一発で終わらせたいの
    // だけれども、これだと $body が長くなるとうまくいかないのでちまちまと

//  return preg_replace_callback(
//      "#<pre>(?:LANG(?:UAGE)?:".
//            "([a-zA-Z0-9\#\+\-]+)(\(([^\)]*)\))?\n)?((\n|.)*?)</pre>#",
//      'do_texthighlight', 
//      $body);

    $newbody= "";
    while( trye ){
        $pos= stripos( $body, "<pre>LANG" );
        if($pos===FALSE)
            break;
        $newbody.= substr($body, 0, $pos);
        $body= substr($body, $pos);
        $end= stripos( $body, "</pre>" );
        $pre= substr($body, 0, $end);
        $body= substr($body, $end+6);
        if( preg_match("#<pre>\s*(?:LANG(?:UAGE)?:".
                "([a-zA-Z0-9\#\+\-]+)(\(([^\)]*)\))?\s*\n)?#", 
                $pre, $matches) ) {
            $newbody.= do_texthighlight($matches, substr($pre, strlen($matches[0])));
        }else{
            $newbody.= $pre;
        }
    }
    return $newbody . $body;
}

function do_texthighlight($matches, $source)
{
    $language= strtolower($matches[1]);
    $args= $matches[3] ? split(",", $matches[3]) : array();
    $source= html_entity_decode($source);

    // 別名に対応
    if($language == "c#") $language= "csharp";
    if($language == "c++") $language= "cpp";
    if($language == "s-lang") $language= "slang";

    if( in_array("linenumber", $args) ){
        // 行番号付け
        $n= count(split("\n", $source));
        $numbers= "";
        for($line=1; $line<=$n; $line++)
            $numbers .= sprintf("%d:\n", $line);
        return '<table class="sh_linenumber"><tr><td><pre class="sh_linenumber">' .
               $numbers . '</pre></td><td><pre class="sh_' . $language . '">' . 
               htmlspecialchars($source) . '</pre></td></tr></table>';
    }else
        if( $language ){
        // 横幅を制限するために table に入れている。
        return '<table class="sh_bound"><tr><td><pre class="sh_' . $language . '">' . 
               htmlspecialchars($source) . '</pre></td></tr></table>';
    }else{
        // 横幅を制限するために table に入れている。
        return '<table class="sh_bound"><tr><td><pre>' .
               htmlspecialchars($source) . '</pre></td></tr></table>';
    }
}

?>