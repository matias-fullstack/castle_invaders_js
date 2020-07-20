document.addEventListener("DOMContentLoaded" ,() =>{

    const GRID_WIDTH = 20; // A 20 X 20 squares GRID 

    //player starting point
    //----------------------------------------------------------------------------------------
    let playerPosIndex = 370; //or 350

    //enemy starting pos
    //----------------------------------------------------------------------------------------
    let currentAlienIndex = 0;

    // dead enemies
    //----------------------------------------------------------------------------------------
    let deadAliensArray = [];

    let direction = 1;

    let AlienID;


    //the score display
    //----------------------------------------------------------------------------------------
    let scoreDisplay = document.querySelector("#score");
    let scoreValue = 0;


    // reference for the main grid
    //----------------------------------------------------------------------------------------
    const grid = document.querySelector(".grid");

    // the squares of the map
    //----------------------------------------------------------------------------------------
    let squares = [];


    //fill the game grid with "blocks" aka divs 
    //----------------------------------------------------------------------------------------
    for (let i = 0; i < 400; i++)
    {
        let newDiv = document.createElement("div");

        newDiv.setAttribute("id",i.toString());

        squares[i] = newDiv;

        grid.appendChild(newDiv);
    }




    //define the aliens
    //----------------------------------------------------------------------------------------
    const aliensArray = [
        0,1,2,3,4,5,6,7,8,9,10,11,
        20,21,22,23,24,25,26,27,28,29,30,31,
        40,41,42,43,44,45,46,47,48,49,50,51
    ];


    //draw the aliens
    //----------------------------------------------------------------------------------------
    aliensArray.forEach( 
        (alien) => squares[currentAlienIndex + alien].classList.add("alien"));

    
    
    // draw the player
    //----------------------------------------------------------------------------------------

    squares[playerPosIndex].classList.add("player");


    

    //move the player
    //----------------------------------------------------------------------------------------
    function movePlayer(e)
    {
        squares[playerPosIndex].classList.remove("player");

        switch (e.keyCode)
        {
            // move left --- a key
            case 65:
                
                if(playerPosIndex % GRID_WIDTH !== 0 )
                {
                    playerPosIndex -= 1;
                }
            
            break;



            // move right --- d key
            case 68:
                
                if(playerPosIndex % GRID_WIDTH < (GRID_WIDTH -1))
                {
                    playerPosIndex += 1;
                }
            
            break;
        }

        squares[playerPosIndex].classList.add("player");
    }



    //activate the player movement via callback function 
    //(or registering the function as an event)
    //----------------------------------------------------------------------------------------
    document.addEventListener("keydown",movePlayer);




    //move the aliens
    //----------------------------------------------------------------------------------------
    function moveAliens()
    {
        const leftEdge = aliensArray[0] % GRID_WIDTH === 0 ;
        const rightEdge = aliensArray[aliensArray.length - 1] % GRID_WIDTH === GRID_WIDTH -1;


        // check for edges and set direction (also move down if edges)
        //-----------------------
        if( (leftEdge && (direction === -1)  )  || (rightEdge && (direction === 1) ) ) 
        {
            direction = GRID_WIDTH;
        }
        else if(direction === GRID_WIDTH)
        {
            if(leftEdge)
            {
                direction = 1
            }
            else
            {
                direction = -1
            }
        }



        // remove the aliens "sprite"
        //-----------------------------
        for (let i = 0; i <= aliensArray.length -1; i++)
        {
            squares[aliensArray[i]].classList.remove("alien");
        }


        // move the aliens based on direction
        //-----------------------------
        for (let i = 0; i <= aliensArray.length -1; i++)
        {
            aliensArray[i] += direction;
        }


        // once moved, redrwaw the aliens
        //-----------------------------
        for (let i = 0; i <= aliensArray.length -1; i++)
        {   
            if(!deadAliensArray.includes(i))
            {
                squares[aliensArray[i]].classList.add("alien");
            }
        }



        // win game
        //-----------------------------
        if(deadAliensArray.length === aliensArray.length)
        {
            scoreDisplay.textContent = "You Win !!!";
            clearInterval(AlienID);
        }



        // game over
        //-----------------------------
        if(squares[playerPosIndex].classList.contains("alien","player"))
        {
            scoreDisplay.textContent = "Game Over";

            squares[playerPosIndex].classList.add("boom");

            clearInterval(AlienID);
        }


        for (let i = 0; i < aliensArray.length; i++) 
        {
            if(aliensArray[i] > squares.length - (GRID_WIDTH -1))
            {
                scoreDisplay.textContent = "Game Over";

                clearInterval(AlienID);
            }    
        }

    }


    AlienID = setInterval(moveAliens,500);




    //---------------------------
    let canShoot = true;
    //---------------------------

    //shoot
    //----------------------------------------------------------------------------------------
    function shoot(e)
    {
        let laserID;
        let currentLaserPos = playerPosIndex;


        //move the laser from the player to the alien
        function moveLaser()
        {
            canShoot = false;

            squares[currentLaserPos].classList.remove("laser");
            
            currentLaserPos -= GRID_WIDTH;
            
            squares[currentLaserPos].classList.add("laser");
            
            
            //check if laser hits enemy or the end of the screen
            //------------------------------------
            if(squares[currentLaserPos].classList.contains("alien"))
            {
                squares[currentLaserPos].classList.remove("laser");

                squares[currentLaserPos].classList.remove("alien");
                
                squares[currentLaserPos].classList.add("boom");

                setTimeout( ()=> squares[currentLaserPos].classList.remove("boom"),30);

                clearInterval(laserID);

                //add dead alien to the dead aliens array
                const deadAlien = aliensArray.indexOf(currentLaserPos);
                
                deadAliensArray.push(deadAlien);

                scoreValue ++;

                scoreDisplay.textContent = scoreValue.toString();

                canShoot = true;
            }


            //remove the laser if it reach the end of the game map
            if(currentLaserPos < GRID_WIDTH)
            {
                clearInterval(laserID);
                setTimeout(() => squares[currentLaserPos].classList.remove("laser"),100);

                canShoot = true;
            }
        }


        
        // shoot the laser with space bar
        // if the shoot has hit something
        if(e.keyCode === 32 && canShoot)
        {
            laserID = setInterval(moveLaser,100);
        }

    }



    // prevent the player from shooting until
    // the laser hits something (an enemy or the end of the map)
    document.addEventListener("keydown",
    (e) => 
    {
        if(canShoot)
        {
            shoot(e);
        }
    });



















});