$(document).ready(function() {
	//access to the data of the game canvas
	var canvas = document.getElementById('game_canvas');
    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    //var stableBalls = [];
    var nextPostion; //this will store the x,y coordinates of the most recent click
    var playBall;
    var blocks = [];
    var gameState = "pre-begin";

    //draw a ball at the coordinates of the input ball object
  	var drawBall = function(ballObj) {
        //context.lineWidth = 5;
        context.beginPath();
        context.strokeStyle = "black";
        context.arc(ballObj.xCoor, ballObj.yCoor, ballObj.radius, 0, 2*Math.PI);
        context.fillStyle = ballObj.color;
        context.fill();
        context.closePath();
        context.stroke();
    }

    //draw a block
    var drawBlock = function(blockObj) {
        //console.log("im called");
        context.beginPath();
        context.fillStyle = blockObj.color;
        //context.strokeStyle = "black";
        context.fillRect(blockObj.xCoor, blockObj.yCoor, blockObj.width, blockObj.height);
        context.closePath();
        context.stroke();        
    }

    //write context at (x,y)
    var writeContext = function(input, x, y, color, font) {
        context.font = font;
        context.fillStyle = color;
        context.fillText(input, x, y);
    }

    //set up blocks
    var setBlocks = function() {
        var passageWidth = 65;
        var possibleHeights = [50, 80, 150, 30, 460, 60, 370];
        var possibleWidths = [40, 25, 12, 56, 30, 72];
        var startingY = 0;

        var WidthTracker = 150;
        while (WidthTracker < width-150) {
            //console.log(WidthTracker);
            //console.log(width-150);
            var startingX = WidthTracker;
            var randHeight = possibleHeights[randNum(0,possibleHeights.length)];
            var randWidth = possibleWidths[randNum(0, possibleWidths.length)];
            var upBlock = {
                xCoor: startingX,
                yCoor: startingY,
                height: randHeight,
                width: randWidth,
                color: getRandomColor()
            }
            blocks.push(upBlock); //don't know what to do with this array know, but just in case
            drawBlock(upBlock);

            if (randHeight < height - passageWidth) {
                var secondX = startingX;
                var secondY = startingY + randHeight + passageWidth;
                var secondHeight = height-passageWidth-randHeight;
                var secondWidth = randWidth;
                var downBlock = {
                    xCoor: secondX,
                    yCoor: secondY,
                    height: secondHeight,
                    width: secondWidth,
                    color: getRandomColor()
                }
                blocks.push(downBlock);
                drawBlock(downBlock);
            }
            WidthTracker += (randWidth + passageWidth)
        }
    }


    //set the starting point and ending point
    var setStart_and_End = function() {
        var mBall = {
            xCoor: 20+25,
            yCoor: Math.floor(height/2)+25,
            color: "White",
            radius: 25,
            vx: 0,
            vy: 0
        }
        playBall = mBall;
    }

 
    //determine whether you have lost
    var doLose = function() {
        for (var n = 0; n<blocks.length; n++) {
            var theBlock = blocks[n];
            var ballX = playBall.xCoor;
            var ballY = playBall.yCoor;
            var blockX = theBlock.xCoor;
            var blockY = theBlock.yCoor;
            var rad = playBall.radius;
            if (n%2 == 0) {
                var leftVertexX = blockX;
                var leftVertexY = blockY + theBlock.height;
                var rightVertexX = blockX + theBlock.width;
                var rightVertexY = leftVertexY;
                var distL = Math.sqrt((ballX-leftVertexX)*(ballX-leftVertexX) + (ballY-leftVertexY)*(ballY-leftVertexY));
                var distR = Math.sqrt((ballX-rightVertexX)*(ballX-rightVertexX) + (ballY-rightVertexY)*(ballY-rightVertexY));
                //testing vertices
                if (ballY > leftVertexY) {   
                    if (distL < rad) {
                        console.log("a");
                        return true;
                    }
                    if (distR < rad) {
                        console.log("b");
                        return true;
                    }
                }
                //testing edges
                if (ballY < leftVertexY) {  
                    if (Math.sqrt(distL*distL-(ballY-leftVertexY)*(ballY-leftVertexY)) < rad) { 
                        console.log("c");
                        return true;   
                    }
                    if (Math.sqrt(distR*distR-(ballY-rightVertexY)*(ballY-rightVertexY)) < rad) {
                        console.log("d");
                        return true;
                    }
                }
            }else {
                var leftVertexX = blockX;
                var leftVertexY = blockY;
                var rightVertexX = blockX + theBlock.width;
                var rightVertexY = leftVertexY;
                var distL = Math.sqrt((ballX-leftVertexX)*(ballX-leftVertexX) + (ballY-leftVertexY)*(ballY-leftVertexY));
                var distR = Math.sqrt((ballX-rightVertexX)*(ballX-rightVertexX) + (ballY-rightVertexY)*(ballY-rightVertexY));
                //testing vertices
                if (ballY < leftVertexY) {   
                    if (distL < rad) {
                        console.log("e");
                        return true;
                    }
                    if (distR < rad) {
                        console.log("f");
                        return true;
                    }
                }
                //testing edges
                if (ballY > leftVertexY) {  
                    if (Math.sqrt(distL*distL-(ballY-leftVertexY)*(ballY-leftVertexY)) < rad) { 
                        console.log("g");
                        return true;   
                    }
                    if (Math.sqrt(distR*distR-(ballY-rightVertexY)*(ballY-rightVertexY)) < rad) {
                        console.log("h");
                        return true;
                    }
                }
            }
        }
        //console.log(playBall.xCoor+playBall.radius);
        //console.log(theBlock.xCoor);
        return false;
    }

    var doWin = function() {
        var lastBlock = blocks[blocks.length-1];
        if (playBall.xCoor-playBall.radius > lastBlock.xCoor+lastBlock.width+10) {
            return true;
        }
        return false;
    }

    //get a random number within the limit
    var randNum = function(lowerBound,upperBound) {
        var num = Math.floor(Math.random()*upperBound+lowerBound);
        if (num > upperBound) {
            num -= lowerBound;
        }
        return num;
    }

  	//get random color (with its hex representation)
  	var getRandomColor = function() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
  	}


  	//update the game canvas each time called
  	var updateGame = function() {
        drawBall(playBall);
        context.fillStyle = "#FFFACD";
        context.fillRect(0, 0, width, height);
        
        for (var j = 0; j<blocks.length; j++) {
            drawBlock(blocks[j]);
        }
        drawBall(playBall);
        if (doLose() == false) {
            //console.log("hack");
            if (doWin() == true) {
                gameState = "win";
                //console.log(gameState);
                writeContext("YOU WIN!!",width/2-60,height/2, "#FF0000");
                return;
            }
        }else if (doLose() == true) {
            gameState = "lose";
            console.log(gameState);
            writeContext("YOU CAN'T TOUCH IT!",width/2-250,height/2,"#000000");
            return;
        }
        requestAnimationFrame(updateGame);
        //setTimeout(updateGame, 1);
  	}
  	
  	//handle click on the game canvas
  	$("#game_canvas").click(function(e) {
        if (gameState == "pre-begin") {
            gameState = "playing";
            updateGame();
        }else if (gameState == "playing") {
            console.log("what");
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            var newPos = {
                xCoor: x,
                yCoor: y
            }
            nextPostion = newPos;
            //calculate playBall's velocity
            playBall.vx = Math.floor((nextPostion.xCoor - playBall.xCoor)/10);
            playBall.vy = Math.floor((nextPostion.yCoor - playBall.yCoor)/10);
            //update playBall's x,y coordinates
            playBall.xCoor += playBall.vx;
            playBall.yCoor += playBall.vy;
            nextPostion = newPos; //set the next position to be the new click's position
        }
  	});

    if (gameState == "playing") {
        updateGame();
    }else if (gameState == "pre-begin") {
        setStart_and_End();
        setBlocks();
        writeContext("Click to START", width/2-150, height/2, "black", "50px Impact");
    }
});
