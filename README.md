# Prototype Builder

This system is designed to make creating the base of the HTML prototypes that get sent to clients
as quick as possible. Using the interface at [prototype-builder.com](http://prototype-builder.com) create prototypes quickly and downlaod 
what you create.

To be hoenst most of it is self explanitory but after you have downloaded the package you will need
to know the following.

## AUTOMATED TASKS WITH GRUNT

This system uses Grunt, Compass and Juicer (a js compression Gem) to compress / watch the fron end assets to use the system you need to have the following things installed:

* Ruby
    * compass
    * susy
    * rgbapng
* Node
	* grunt
	* Varuous node modules (installed with npm install command when in root fir of project)

Once you have all these things installed on your machine navigate to the root of your new project and run "npm install" this will install the node modules needed (node_modules has been added to git ignore). Then simply run the grunt command in terminal (again in project root dir).

The grunt command will watch for chnages in sass files and re-compile them if changed. It will also watch for js chnanges and re-compile the javascript as it changes. The settings for how these are compiled are in the Gruntfile.js at the root of the project.

When the JS is compiled for example it will not be minified on dev and neither will the css. to chnage from dev to build change the setting at the bottom of the Gruntfile ['dev'] to ['build'].


## GENERAL USE

The whole idea of the system is to be modular, all html 'chunks' of functionality are stored in
the modules directory. These contain a markup.html file, for your own use but also this is part of how
prototype builder works.

A module may contain js and always contains its own styles and media queries. The idea is that sass and juicer
will pull it all together and it is easy to work on modules in a small stand alone file.

To add a modules js to the project add an @depends delaration to the script.js file and re-combine, I add plugins etc
above the window ready and the script.js file for each module in the window ready as you would if you coded normally.

To add module styles add an @includes declaration to assets/sass/screen.scss file. compass is set up to watch the modules 
directory so any chnages will be picked up automaticly by compass

Navigation has been modulised in a simular way (mainly to help with prototype builder) but also it helps to move it out
and work on it alone. This however is site wide and not really a module so I have created a directory in assets/navigation
this will already be added to the assets/style.scss file and included in the js file (if any JS needed) but its good to know

To add more paths to the watch list open up config.rb and you will see how I have adde my own custom ones for navigation
and modules.



## SUBMITTING MODULES

If you would like to submit modules at the moment just email me a ziped file with the module in and I will add. If 
more people start using this I will create some sort of library and so on but not right now.

Please use the following format for modules / navigation

* module-name
    * /sass/style.scss
    * /js/script.js
    * /js/any-plugins-here.js
    * markup.html

Obviously some modules will need more things like images, audio, flash and so on. There is no limit here I would just
ask please use lowercase names and -'s for spaces on files.


========================================================================

Any other enquiries email me:

gareth-fuller@hotmail.co.uk

Enjoy!