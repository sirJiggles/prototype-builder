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

    	<title>Basilisk</title>
            
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

        <!-- used for sticky footer -->
        <div id="site-wrapper">

            <header id="header" class="row" role="banner">
                
                <div class="col span-1 half">
                    
                    <h1>SITE TITLE</h1>
                    
                    <nav id="main-nav" role="navigation">

                        <ul>
                            <li><a href="index.php" title="Home" <?php echo ($currentPage == 'index') ? "class='active'" : ''; ?>>Home</a></li>
                            <li><a href="article.php" title="Article" <?php echo ($currentPage == 'article') ? "class='active'" : ''; ?>>Article</a></li>
                            <li><a href="gallery.php" title="Gallery" <?php echo ($currentPage == 'gallery') ? "class='active'" : ''; ?>>Gallery</a></li>
                            <li><a href="news.php" title="News" <?php echo ($currentPage == 'news') ? "class='active'" : ''; ?>>News</a></li>
                            <li><a href="accordion.php" title="Accordion" <?php echo ($currentPage == 'accordion') ? "class='active'" : ''; ?>>Accordion</a></li>
                            <li><a href="contact.php" title="Contact" <?php echo ($currentPage == 'contact') ? "class='active'" : ''; ?>>Contact</a></li>
                        </ul>
                        
                    </nav>
                </div>
                
                
                    
                <div class="col span-1 half end">
                    <p> This is another half ! </p>
                </div>

                
            </header>
            
            <div class="row main" role="main">


                