<?php

/*
 * This is where the project download is handled, this is hit via AJAX
 */

require_once('HZip.php');

// variable  for holding all the used modules for this project
$usedModules = array();

// get the JSON data about the project from the post
if( !isset($_POST['data']) || $_POST['data'] == ''){
	exit('could not get post data');
}
$data = str_replace('\"', '"',  $_POST['data']);

// convert to json
$json = json_decode($data);

// make sure it was valid
if(!$json || !isset($json)){
	exit('Could not create json object');
}

// create a hash to use for the download (does not need to be mental)
$hash = base64_encode('s03kljJS' + strtotime('now') + 'BbeosSW2');
$rootDir = realpath('./..');

//create the dir for the tmp files
if(!mkdir($rootDir.'/tmp/'.$hash)){
	exit('Could not create directory');
}

// Create a copy of the standard package into the new downalod folder
recurse_copy($rootDir.'/default/',$rootDir.'/tmp/'.$hash.'/');


// Create a new html file for each template and write the grid to it
foreach($json->templates as $templateName => $templateData){

	$handle = fopen($rootDir.'/tmp/'.$hash.'/'.$templateName.'.php', 'w');

	if(!$handle){
		exit('Could not create template');
	}

	// template file should be created at this stage so now we will write the data string to it
	$fileString  = "<?php include('includes/header.inc.php'); ?>"."\n";


	// loop through the positions and add the grid in the correct order 
	// at the same time we will get a list of the modules need for this project
	foreach($json->templates->$templateName->positions as $key => $gridId){


		$size = $json->templates->$templateName->grid->$gridId->size;
		$end = ($json->templates->$templateName->grid->$gridId->end) ? ' end' : '';
		$modules = ( count($json->templates->$templateName->grid->$gridId->modules) > 0 ) ? $json->templates->$templateName->grid->$gridId->modules : false;

		$fileString .= '<div class="col span-1 '.$size.$end.'">'."\n";

		if(count($modules) > 0){
			// loop through all the modules in the grid
			foreach($modules as $moduleKey => $moduleVal){

				// check if the module is in the global array, if not get the markup data and add to it
				// if it is then use the markup from the global array
				if(in_array($moduleVal, $usedModules)){
					$fileString .= $usedModules[$moduleVal];
				}else{
					$markupData = file_get_contents($rootDir.'/assets/modules/'.$moduleVal.'/markup.html');
					$usedModules[$moduleVal] = $markupData;
					$fileString .= $markupData;
				}
			}
		} // end if there are modules in the grid

		$fileString .= '</div>'."\n";

	}

	$fileString .= "<?php include('includes/footer.inc.php'); ?>"."\n";


	// write data to file 
	fwrite($handle, $fileString);
	fclose($handle);
}


// Add module dependant code to the required files (styles and js)
$jsModules = '';
$jsPlugins = '';
$styleModules = '';

foreach($usedModules as $moduleKey => $moduleVal){
	// Copy used module into new project
	mkdir($rootDir.'/tmp/'.$hash.'/assets/modules/'.$moduleKey);
	recurse_copy($rootDir.'/assets/modules/'.$moduleKey.'/', $rootDir.'/tmp/'.$hash.'/assets/modules/'.$moduleKey.'/');

	// open up the styles.scss and add the import for the module
	$styleModules .= "@import '../modules/".$moduleKey."/sass/style';"."\n";

	// append to the string used later for the script.js file
	if(file_exists($rootDir.'/assets/modules/'.$moduleKey.'/js/script.js')){
		$jsModules .= '@depends ../modules/'.$moduleKey.'/js/script.js'."\n";
	}

	// append to the string later used for the js plugins of there are any
	if($handleJsDir = opendir($rootDir.'/assets/modules/'.$moduleKey.'/js')){
		while (false !== ($file = readdir($handleJsDir))){
        	if ($file != "." && $file != ".." && strtolower(substr($file, strrpos($file, '.') + 1)) == 'js' && $file != 'script.js'){
	            if(!in_array($file, $jsPlugins)){
	            	$jsPlugins .= $file ."\n";
	            }
	        }
	    }
    	closedir($handleJsDir);
	}

}

$handleStylesFile = fopen($rootDir.'/tmp/'.$hash.'/assets/sass/screen.scss', 'a+');
fwrite($handleStylesFile, $styleModules);
fclose($handleStylesFile);

// add the js modules / plugins to the scripts file
$jsFileContents = file_get_contents($rootDir.'/tmp/'.$hash.'/assets/js/script.js');
$jsFileContents = str_replace('INCLUDE PLUGINS', $jsPlugins, $jsFileContents);
$jsFileContents = str_replace('INCLUDE MODULES', $jsModules, $jsFileContents);

file_put_contents($rootDir.'/tmp/'.$hash.'/assets/js/script.js', $jsFileContents);


// Convert folder to zip
HZip::zipDir( $rootDir.'/tmp/'.$hash, $rootDir.'/tmp/'.$hash.'.zip' );

// Actaul downloading of zip file
$downloadFile = $rootDir.'/tmp/'.$hash.'.zip';

if (file_exists($downloadFile)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.basename($downloadFile));
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($downloadFile));
    ob_clean();
    flush();
    readfile($downloadFile);
    

    //clean up 
    rrmdir($rootDir.'/tmp/'.$hash);
    unlink($rootDir.'/tmp/'.$hash.'.zip');

    exit();
}


// function used to copy all the files to start with
function recurse_copy($src,$dst) { 
    $dir = opendir($src); 
    @mkdir($dst); 
    while(false !== ( $file = readdir($dir)) ) { 
        if (( $file != '.' ) && ( $file != '..' )) { 
            if ( is_dir($src . '/' . $file) ) { 
                recurse_copy($src . '/' . $file,$dst . '/' . $file); 
            } 
            else { 
                copy($src . '/' . $file,$dst . '/' . $file); 
            } 
        } 
    } 
    closedir($dir); 
}

function rrmdir($dir) {
    foreach(glob($dir . '/*') as $file) {
        if(is_dir($file))
            rrmdir($file);
        else
            unlink($file);
    }
    rmdir($dir);
}