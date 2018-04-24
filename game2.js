var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-name', { preload: preload, create: create, update: update });

function preload() {


     // We load all the images that we want to use
    game.load.image('bullet', 'assets/bullet24.png');
    game.load.image('enemiesbullet', 'assets/bullet23.png');
	game.load.spritesheet('enemies', 'assets/humstar.png', 32, 32);
    game.load.image('aircraft', 'assets/plane-shadow.png');
    game.load.spritesheet('boom', 'assets/explode.png', 128, 128);
    game.load.image('background', 'assets/sky.png'); 
	game.load.image('cloud1', 'assets/cloud1.png');
	game.load.image('cloud2', 'assets/cloud2.png');
	game.load.image('cloud3', 'assets/cloud3.png');
	game.load.image('cloud4', 'assets/cloud4.png');
	game.load.image('cloud5', 'assets/cloud5.png');
  
	
	
	
}

//We define our variables

var player;
var enemies;
var firebullets;
var firebulletsTime = 0;
var keyButton ;
var fireButton;
var blowup;
var background;
var scoring = 0;
var scoringText = '';
var TextStyling;
var life;
var enemiesbullet;
var finishingtext;
var shootingtimer = 0;
var collectalivingEnemies = [];
var cloud1;
var cloud2;
var cloud3;
var cloud4;
var cloud5;
var filter;
var sprite;

function create() {
	
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Here we call the background and clouds elements
    background = game.add.tileSprite(0, 0, 800, 600, 'background');
	cloud1 = game.add.tileSprite(0, 0, 800, 600, 'cloud1');
	cloud2 = game.add.tileSprite(0, 0, 800, 600, 'cloud2');
	cloud3 = game.add.tileSprite(0, 0, 800, 600, 'cloud3');
	cloud4 = game.add.tileSprite(0, 0, 800, 600, 'cloud4');
	cloud5 = game.add.tileSprite(0, 0, 800, 600, 'cloud5');

	//This function sent the bounderies of our camera...so we can move the camera within this range
	// game.world.setBounds(-100, 0, 1000, 0);
	game.physics.startSystem(Phaser.Physics.P2JS);
	
	
    //My firebullets generator 
	//Also we define the number of bullets to create
    firebullets = game.add.group();
    firebullets.enableBody = true;
    firebullets.physicsBodyType = Phaser.Physics.ARCADE;
    firebullets.createMultiple(30, 'bullet'); 
	
	//This is the position from where the fire sparks
    firebullets.setAll('anchor.x', 0.5); 
    firebullets.setAll('anchor.y', 1);
	
    //Keeps the fire going until the game finish 
    firebullets.setAll('outOfBoundsKill', true);
    firebullets.setAll('checkWorldBounds', true);

	
    // The enemy's firebullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemiesbullet');
	
	//This is the position where the enemies fire spark
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    //Keeps the fire going until the game finish 
	enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);
	
	
	// We add the player
	player = game.add.sprite(400, 500, 'aircraft');
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	
	// Here we make the camera follow the player
	game.camera.follow(player);
	game.physics.p2.enable(player);
	 
	
    //  we define the enemies 
    enemies = game.add.group();
    enemies.enableBody = true;
	createenemies();

    //  The scoring
    scoringText = 'SCORE : ';
    TextStyling = game.add.text(10, 10, scoringText + scoring, { font: '34px Revalia', fill: '#fff' });
    //  life
    life = game.add.group();
    //  Text
    finishingtext = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '34px Revalia', fill: '#fff' });
    finishingtext.anchor.setTo(0.5, 0.5);
    finishingtext.visible = false;

    // setup up explosion 
    blowup = game.add.group();
    blowup.createMultiple(30, 'boom');
    blowup.forEach(setupAircraft, this);

    //  And some controls to play the game with
    keyButton  = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
	
	game.camera.follow(player);
   
}

function createenemies () {

    for (var y = 0; y < 6; y++)  // 6 rows of enemies
    {
        for (var x = 0; x < 12; x++) // 12 enemies per row
        {
            var alien = enemies.create(x * 38, y * 40, 'enemies'); //The space between enemies when we create them
            alien.anchor.setTo(0.5, 0.5);
			
			//We make the enemies move. The [0,1,2,3] are the frames. The 20 is the frame-rate. The TRUE means whether or not the animation is looped or just plays once.
            //The "flyinganimation" is only a given name for the animation that we made
			alien.animations.add('flyinganimation', [ 0, 1, 2, 3 ], 20, true); 
            alien.play('flyinganimation'); // we play our animation "flyinganimation".
            //To let them stay in the screen and not disappear 
			alien.body.moves = false;
        }
    }

	//The starting position for the enemies
    enemies.x = 100;
    enemies.y = 20;
	
    //We move each one of them by 200 in the x axes
	// The 3000 is the the frame updating time for the movement 
	var tween = game.add.tween(enemies).to( { x: 200 }, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);

}

function setupAircraft (enemies) {

    enemies.anchor.x = 0.5;
    enemies.anchor.y = 0.5;
    enemies.animations.add('boom');

}


function update() {
	
	
	
	//To make the background and clouds move. 
	background.tilePosition.y += 0;
	
	//cloud.tilePosition.y += 2;
	
	cloud1.tilePosition.x += 6;
	 
	cloud2.tilePosition.y += 6;
	cloud3.tilePosition.x += 0;
	
	//cloud3.tilePosition.y += 4;
	 
	cloud4.tilePosition.y += 8;

    cloud5.tilePosition.x += 2;
	 
	cloud5.tilePosition.y += 2;

	 //If we still in the game //alive is a builtin function
    if (player.alive)
    {
		
        //We reset the position of the player before applying the key movement. 
		//If I delete this line the player will move all the way in the axis
        player.body.velocity.setTo(0, 0);

		// Here we define the keys and their speeds movement 
        if (keyButton .left.isDown)
        {
            player.body.velocity.x = -190; 
        }
        else if (keyButton .right.isDown)
        {
            player.body.velocity.x = 190;
        }

        if (fireButton.isDown)
        {
            fireBullet();
        }

        if (game.time.now > shootingtimer)
        {
            enemyshoot();
        }

        // If the player hits the enemy 
        game.physics.arcade.overlap(firebullets, enemies, playerHitsEnemy, null, this);
		
		
		// If the opposit happens and the enemy hits the player
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    }
	

}


function playerHitsEnemy (bullet, alien) {

    //If the player hits an enemy kill him "delete" and kill the bullet as well
    bullet.kill();
    alien.kill();

    // Then add 1000 to the current scoring
    scoring += 1000;
    TextStyling.text = scoringText + scoring;

    //  Make explosion
    var explosion = blowup.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('boom', 30, false, true);

	
	// Here when the player kills all the enemies. 
    if (enemies.countLiving() == 0)
    {
        scoring += 1000;
        TextStyling.text = scoringText + scoring;
        enemyBullets.callAll('kill',this);
        finishingtext.text = " CONGRATULATIONS YOU WON, \n CLICK TO PLAY AGAIN";
        finishingtext.visible = true;
        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer (player,bullet) {
    
	//If the enemy hits the player
	// delete the bullet
    bullet.kill();

    live = life.getFirstAlive();


    //  Make explosion
    var explosion = blowup.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('boom', 30, false, true);
    
	
    // If the player dies
    if (life.countLiving() < 1)   // the only live we have 
    {
		// destroy "delete" the player and all the current active firebullets
        player.kill();
        enemyBullets.callAll('kill');

		// Show the game over text
        finishingtext.text=" GAME OVER \n CLICK TO RESTART";
        finishingtext.visible = true;

		scoring = 0;
	    TextStyling.text = scoringText + scoring;
		
        //Manage the restart action
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyshoot () {
    enemiesbullet = enemyBullets.getFirstExists(false);

	// This is array that we want to put all enemies inside 
	// so later, we select a random enemy from this array and make him shoot the player ^_^
    collectalivingEnemies.length=0;

    enemies.forEachAlive(function(alien){

        // Here we push them inside the array
        collectalivingEnemies.push(alien);
    });


	// As long as we have enemies
    if (enemiesbullet && collectalivingEnemies.length > 0)
    {
        
		//This is a random variables from 0 to the number of enemies we have
        var random=game.rnd.integerInRange(0,collectalivingEnemies.length-1);
        // Here we randomley select one enemy to shoot
        var shooter=collectalivingEnemies[random];
        // And fire the bullet from this enemy
        enemiesbullet.reset(shooter.body.x, shooter.body.y);

		// We aime the shooting toward the player by this function
        game.physics.arcade.moveToObject(enemiesbullet,player,120);
        shootingtimer = game.time.now + 1500;
    }
	
}

function fireBullet () {  // This is to start shooting



    //  when the game start, then we can fire
    if (game.time.now > firebulletsTime)
    {
		// We take the first bullet
        bullet = firebullets.getFirstExists(false);
		
        if (bullet)
        {
			
			// This is the location of our bullet
            bullet.reset(player.x, player.y + 8);
			
			// How fast they resist the gravity " How fast the firebullets go up"
            bullet.body.velocity.y = -400;
			// This is how many shoots the player can fire in milleseconds
            firebulletsTime = game.time.now + 200;
        }
    }
	
	

}



function restart () {

  
    //  Here when we restart the game..we kill all the existing enemies and then creat new ones
    enemies.removeAll();

    createenemies();
    
    // We make the player alive
    player.revive();
	
    //hides the text
    finishingtext.visible = false;

}