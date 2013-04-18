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

        <!-- CUSTOM FONT -->
        <link href='http://fonts.googleapis.com/css?family=Noto+Sans:400,700' rel='stylesheet' type='text/css'>
        
        <!--[if lte IE 8]>
            <link rel="stylesheet" href="assets/css/fixed-width.css" media="screen" type="text/css"/>
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
            <h2>Template</h2>
            <a class="close-button" title="Click here to cancel nameing this template" href="#">Close</a>
            <form method="post" action="">
                <label for="popup-template-name">Name:</label>
                <input type="text" name="popup-template-name" id="popup-template-name" value="" placeholder="Name of the template" />
                <input type="submit" name="submit-template-popup" id="edit-template-button" value="Save" />
            </form>
        </div>

        <!-- popup for confirmation of deleting project -->
        <div class="popup project-delete">
            <h2>Delete project</h2>
            <a class="close-button" title="Click here to cancel deleting the project" href="#">Close</a>
            <p>Are you sure you wish to delete the project?</p>
            <ul>
                <li><a href="#" title="Click here to delete the project" class="delete-project">Yes, remove</a></li>
                <li><a href="#" title="click here to cacel deleting the project" class="cancel-delete">No, what was I thiking</a></li>
           </ul>
        </div>


        <!-- Hidden form that contains the json data for downloading the project -->
        <form action="/includes/download.inc.php" method="post" id="data-form">
            <input type="hidden" name="data" id="data" value="" />
        </form>


        <header id="header" role="banner">
            <h1>Prototype Builder</h1>

            <ul class="template-tabs">

            </ul>

        </header>


        <aside class="tools">

            <a class="built-for" href="http://google.com" title="Built for Google Chrome">Built for Google Chrome</a>
            <div class="tools-wrapper">
                
                <h3>Grid</h3>
                <select name="grid-select" id="grid-select">
                    <option id="default-grid-select" value="select-grid">Select Grid Box</option>
                    <option id="grid-12" value="grid-12">12 Col</option>
                    <option id="grid-11" value="grid-11">11 Col</option>
                    <option id="grid-10" value="grid-10">10 Col</option>
                    <option id="grid-9" value="grid-9">9 Col</option>
                    <option id="grid-8" value="grid-8">8 Col</option>
                    <option id="grid-7" value="grid-7">7 Col</option>
                    <option id="grid-6" value="grid-6">6 Col</option>
                    <option id="grid-5" value="grid-5">5 Col</option>
                    <option id="grid-4" value="grid-4">4 Col</option>
                    <option id="grid-3" value="grid-3">3 Col</option>
                    <option id="grid-2" value="grid-2">2 Col</option>
                    <option id="grid-1" value="grid-1">1 Col</option>
                </select>

                <h3>Modules</h3>
                <select name="module-select" id="module-select">
                    <option id="default-module-select" value="select-module">Select Module</option>
                    <?php 
                    $modules = array();
                    if ($handle = opendir(realpath('assets/modules'))) {
                        while (false !== ($entry = readdir($handle))) {
                            if(!in_array($entry, $ignoreModules)):

                                // get contents of markup file (if exists)
                                if(file_exists(realpath('assets/modules/'.$entry.'/markup.html'))):
                                    $markup = file_get_contents(realpath('assets/modules/'.$entry.'/markup.html'));
                                    // clean up the name of the module for the list
                                    $entryRaw = $entry;
                                    $entry = ucwords(str_replace('-', ' ', $entry));
                                    $modules[$entryRaw] = $markup;
                                    ?>
                                        <option id="<?php echo $entryRaw; ?>" value="<?php echo $entryRaw; ?>"><?php echo $entry; ?></option>
                                        
                                    <?php 
                                endif;
                            endif;
                        }
                        closedir($handle);
                    }
                    ?>
                </select>

                <?php foreach ($modules as $entryRaw => $markup): ?>
                    <code id="code-<?php echo $entryRaw; ?>"><?php echo $markup; ?></code>
                <?php endforeach; ?>

                <h3>Navigation</h3>
                <select name="nav-select" id="nav-select">
                    <option id="default-nav-select" value="select-nav">Select Navigation</option>
                    <?php 
                    $navigations = array();
                    if ($handle = opendir(realpath('assets/navigation'))) {
                        while (false !== ($entry = readdir($handle))) {
                          
                            // get contents of markup file (if exists)
                            if(file_exists(realpath('assets/navigation/'.$entry.'/markup.html'))):
                                $markup = file_get_contents(realpath('assets/navigation/'.$entry.'/markup.html'));
                                // clean up the name of the module for the list
                                $entryRaw = $entry;
                                $entry = ucwords(str_replace('-', ' ', $entry));
                                $navigations[$entryRaw] = $markup;
                                ?>
                                    <option id="<?php echo $entryRaw; ?>" value="<?php echo $entryRaw; ?>"><?php echo $entry; ?></option>
                                    
                                <?php 
                            endif;
                        }
                        closedir($handle);
                    }
                    ?>
                </select>

                <?php foreach ($navigations as $entryRaw => $markup): ?>
                    <code id="code-<?php echo $entryRaw; ?>"><?php echo $markup; ?></code>
                <?php endforeach; ?>

                <h3>Project</h3>
                <ul class="project-controls">
                    <li><a href="#" title="Click to lock / unclock the template" class="lock-template">Lock / Unlock grid</a></li>
                    <li><a href="#" title="Click to download project" class="download-project">Download Project</a></li>
                    <li class="last"><a href="#" title="Delete the project" class="clear-store">Delete Project</a></li>
                </ul>

            </div>
        </aside>
        
        <!-- used for sticky footer -->
        <div id="site-wrapper">
            
            <header id="nav-header" role="banner">
                
            </header>
            
            <ol class="row main" role="main">


                