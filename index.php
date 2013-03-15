<?php include('includes/header.inc.php'); ?>


<h1>Hello World!</h1>
<div class="col span-2 halves">
    <?php for($i =0; $i < 3;$i ++):?>
        <article class="news">
                
            <figure>
                <img src="http://placekitten.com/g/220/165" alt="cat picture" />
            </figure>

            <div class="article-left-wrapper">

                <h3>Duis a fermentun felis urna quis nunct loritis.</h3>

                <time datetime="2012-02-21">21 Feb</time>

                <ul class="tags">
                    <li><a href="#" title="tag one">Tag one</a>,</li>
                    <li><a href="#" title="tag two">Tag two</a></li>
                </ul>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis a fermentum felis. Vestibulum adipiscing 
                    urna quis nunc lobortis et bibendum dui mollis. Maecenas egestas tellus in augue dapibus ut ornare justo 
                    pharetra. Nullam rutrum vulputate ligula et pulvinar. Pellentesque lobortis nisi tempus sapien auctor imperdiet.</p>

                <a class="btn" href="#" title="Click here to read more">Read more</a>

            </div>

        </article>
    <?php endfor ?>
</div>

<div class="col span-1 third">
    <section class="accordion">
            
        <a href="#" class="accordion-link" title="One"><h3>One</h3></a>
        <article class="accordion-slide">
            <p>This is some content</p>
        </article>

        <a href="#" class="accordion-link" title="Two"><h3>Two</h3></a>
        <article class="accordion-slide">
            <p>This is some more content</p>
        </article>

        <a href="#" class="accordion-link" title="Three"><h3>Three</h3></a>
        <article class="accordion-slide">
            <p>This is even more content</p>
        </article>

        <a href="#" class="accordion-link" title="Four"><h3>Four</h3></a>
        <article class="accordion-slide">
            <p>You guessed it ... content</p>
        </article>

    </section>
</div>

<div class="col span-2 thirds end">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    <div class="row">
        <div class="col span-1 half">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>

        <div class="col span-1 half end">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
    </div>
</div>


<div class="col span-2 halves">
    <div class="gallery">
        <ul>
            <li><img src="http://placehold.it/500x500" alt="test image" /></li>
            <li><img src="http://placehold.it/500x500" alt="test image" /></li>
            <li><img src="http://placehold.it/500x500" alt="test image" /></li>
            <li><img src="http://placehold.it/500x500" alt="test image" /></li>
            <li><img src="http://placehold.it/500x500" alt="test image" /></li>
            <li><img src="http://placehold.it/500x500" alt="test image" /></li>
            <li><img src="http://placehold.it/500x500" alt="test image" /></li>
            
        </ul>
    </div>
</div>



<?php include('includes/footer.inc.php'); ?>