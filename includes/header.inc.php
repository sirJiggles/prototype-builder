<?php

/*
 * Header file that is included on all pages 
 * 
 * @author Gareth Fuller
 * 
 */

$currentPage = str_replace('.php', '', end(explode('/', $_SERVER['SCRIPT_FILENAME'])));

?>

<!DOCTYPE html>
<html lang="en" class="no-js">
    <head>

    	<title>Prototype builder</title>
            
        <!--[if lt IE 9]>
            <script src="assets/js/vendor/htmlshiv.min.js"></script>
        <![endif]-->

        <!-- META -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    	<meta name="description" content="" />
    	<meta name="author" content="" />
        <meta name="keywords" content="" />
	
        <!-- Humans file -->
        <link rel="author" type="text/plain" href="/humans.txt" />

        <!-- Favicons -->
        <link rel="shortcut icon" href="assets/favicons/16.ico" />
    	<link rel="apple-touch-icon-precomposed" sizes="57x57" href="assets/favicons/57.png" />
    	<link rel="apple-touch-icon-precomposed" sizes="72x72" href="assets/favicons/72.png" />
    	<link rel="apple-touch-icon-precomposed" sizes="114x114" href="assets/favicons/114.png" />
    	<link rel="apple-touch-icon-precomposed" sizes="144x144" href="assets/favicons/144.png" />
        
    	<!-- CSS -->
        <link rel="stylesheet" href="assets/css/screen.css" media="screen" type="text/css" />
    	<link rel="stylesheet" href="assets/css/print.css" media="print" type="text/css"/>
        
        <!--[if lte IE 7]>
            <link rel="stylesheet" href="assets/css/fixed-width.css" media="screen" type="text/css"/>
        <![endif]-->

        <!--[if lt IE 9]>
            <link rel="stylesheet" href="assets/css/all-media.css" media="screen" type="text/css"/>
        <![endif]-->
              
        
        
    </head>
    <body>
        
        
        <!-- Pure awesome lurks -->
        
        <div class="overlay"></div>
        
        
        <div class="popup">
            <form method="post" action="">
                <label for="size">Size:</label>
                <select name="size" id="size">
                    <option value="">Full</option>
                    <option value="half">Half</option>
                    <option value="third">Third</option>
                    <option value="quarter">Quarter</option>
                    <option value="fith">Fith</option>
                    <option value="sixth">Sixth</option>
                </select>
                <label for="title">Title:</label>
                <input type="title" name="title" id="title" value="" />
                <label for="blurb"
                <label for="image">Image:</label>
                <input type="file" name="image" id="image" />
                
            </form>
        </div>
        
        <aside class="tools">
            <div class="tools-wrapper">
                <a href="#" title="toggle tools" class="tools-link">&#9776;</a>
                <ul>
                    <li><a href="#" class="grid-link" id="">Full</a></li>
                    <li><a href="#" class="grid-link" id="half">Half</a></li>
                    <li><a href="#" class="grid-link" id="third">Third</a></li>
                    <li><a href="#" class="grid-link" id="quarter">Quarter</a></li>
                    <li><a href="#" class="grid-link" id="fith">Fith</a></li>
                    <li><a href="#" class="grid-link" id="sixth">Sixth</a></li>
                </ul>
                <ul class="modules">
                    <?php 

                    // work out modules to ignore
                    if (file_exists(realpath('assets/modules/ignore.txt'))){
                        $ignoreString = file_get_contents(realpath('assets/modules/ignore.txt'));
                        $ignoreModules = explode(',', $ignoreString);
                    }else{
                        $ignoreModules = array('..', '.');
                    }

                    if ($handle = opendir(realpath('assets/modules'))) {
                        while (false !== ($entry = readdir($handle))) {
                            if(!in_array($entry, $ignoreModules)):

                                // get contents of markup file (if exists)
                                if(file_exists(realpath('assets/modules/'.$entry.'/markup.html'))):
                                    $markup = file_get_contents(realpath('assets/modules/'.$entry.'/markup.html'));
                                    // clean up the name of the module for the list
                                    $entry = ucwords(str_replace('-', ' ', $entry));
                                    ?>
                                        <li>
                                            <a href="#" title="Insert module <?php echo $entry; ?>"><?php echo $entry; ?></a>
                                            <code><?php echo $markup; ?></code>
                                        </li>

                                    <?php 
                                endif;
                            endif;
                        }
                        closedir($handle);
                    }
                    ?>
                </ul>
            </div>
        </aside>
        
        
        

        <!-- used for sticky footer -->
        <div id="site-wrapper">
            
            

            <header id="header" class="row" role="banner">
                
            </header>
            
            <ol class="row main" role="main">


                