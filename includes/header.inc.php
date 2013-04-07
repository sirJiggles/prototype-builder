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
        
        <script type="text/javascript" src="assets/js/vendor/jquery-1.8.2.min.js"></script>
        <script type="text/javascript" src="assets/js/vendor/hammer.min.js"></script>
        <script type="text/javascript" src="assets/modules/jquery-ui/js/script.js"></script>
        
        <?php 
        
        /*
         * Load all files in module js directries that is not script.js and 
         * has not been loaded before
         */
        
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
                    
                    // get all js files other script js and ones that have been included
                    $jsPluginsIncluded = array();
                    if ($jsHandle = opendir(realpath('assets/modules/'.$entry.'/js'))) {
                        while (false !== ($jsEntry = readdir($jsHandle))) {
                            // if not already included 
                            if(!in_array($jsEntry, $jsPluginsIncluded) && $jsEntry !== 'script.js' && $jsEntry != '..' && $jsEntry != '.'){
                                echo '<script type="text/javascript" src="/assets/modules/'.$entry.'/js/'.$jsEntry.'"></script>';
                                $jsPluginsIncluded[] = $jsEntry;
                            }
                            
                        }
                    }

                endif;
            }
            closedir($handle);
        }
        
        
        ?>

        
        <script type="text/javascript" src="assets/js/vendor/nested-sortable.js"></script>
        <script type="text/javascript" src="assets/js/script.js"></script> 
        
        
    </head>
    <body>
        
        
        <!-- Pure awesome lurks -->
        
        <div class="overlay"></div>
        
        <!-- popup for editing the grid container -->
        <div class="popup grid-edit">
            <h2>Edit grid box</h2>
            <a class="close-button" title="Click here to cancel editing this grid box" href="#">Close</a>
            <form method="post" action="">
                <label for="popup-grid-size">Size:</label>
                <select name="popup-grid-size" id="popup-grid-size">
                    <option value="full">Full</option>
                    <option value="half">Half</option>
                    <option value="third">Third</option>
                    <option value="quarter">Quarter</option>
                    <option value="fith">Fith</option>
                    <option value="sixth">Sixth</option>
                </select>
                <label for="popup-grid-text">Text:</label>
                <input type="text" name="popup-grid-text" id="popup-grid-text" value="" placeholder="some text for the box" />
                <label for="popup-grid-end">End Class:</label>
                <input type="checkbox" name="popup-grid-end" id="popup-grid-end" />
                <input type="submit" name="sumit-grid-popup" id="save-grid-box" value="Save changes" />
            </form>
        </div>

        <!-- popup for editing the template -->
        <div class="popup template-edit">
            <h2>Save template</h2>
            <a class="close-button" title="Click here to cancel editing this template" href="#">Close</a>
            <form method="post" action="">
                <label for="popup-template-name">Name:</label>
                <input type="text" name="popup-template-name" id="popup-template-name" value="" placeholder="Name of the template" />
                <input type="submit" name="sumit-template-popup" id="edit-template-button" value="Save Template" />
            </form>
        </div>
        
        <aside class="tools">
            <div class="tools-wrapper">
                <a href="#" title="toggle tools" class="tools-link">&#9776;</a>
                <h3>Grid boxes</h3>
                <ul>
                    <li><a href="#" class="grid-link" id="full">Full</a></li>
                    <li><a href="#" class="grid-link" id="half">Half</a></li>
                    <li><a href="#" class="grid-link" id="third">Third</a></li>
                    <li><a href="#" class="grid-link" id="quarter">Quarter</a></li>
                    <li><a href="#" class="grid-link" id="fith">Fith</a></li>
                    <li><a href="#" class="grid-link" id="sixth">Sixth</a></li>
                </ul>
                <h3>Modules</h3>
                <ul class="modules">
                    <?php 

                    if ($handle = opendir(realpath('assets/modules'))) {
                        while (false !== ($entry = readdir($handle))) {
                            if(!in_array($entry, $ignoreModules)):

                                // get contents of markup file (if exists)
                                if(file_exists(realpath('assets/modules/'.$entry.'/markup.html'))):
                                    $markup = file_get_contents(realpath('assets/modules/'.$entry.'/markup.html'));
                                    // clean up the name of the module for the list
                                    $entryRaw = $entry;
                                    $entry = ucwords(str_replace('-', ' ', $entry));
                                    ?>
                                        <li id="<?php echo $entryRaw; ?>">
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
                <h3>Project</h3>
                <ul class="global-controls">
                    <li><a href="#" title="Click here to edit the name of this template" class="edit-template">Edit Template</a></li>
                    <li><a href="#" title="Click to open saved templates in this project">Open Template</a></li>
                    <li><a href="#" title="Click to download project">Download Project</a></li>
                    <li><a href="#" title="Clear local storage" class="clear-store">Clear storage</a></li>
                </ul>

            </div>
        </aside>
        
        
        

        <!-- used for sticky footer -->
        <div id="site-wrapper">
            
            

            <header id="header" class="row" role="banner">
                
            </header>
            
            <ol class="row main" role="main">


                