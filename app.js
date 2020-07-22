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

    let enemyShotRoutineId = 0;


    //the score display
    //----------------------------------------------------------------------------------------
    let scoreDisplay = document.querySelector("#score");
    let scoreValue = 0;


    // reference for the main grid
    //----------------------------------------------------------------------------------------
    const grid = document.querySelector(".grid");



    // reference for the start/pause/restart button
    //----------------------------------------------------------------------------------------
    const start_btn = document.querySelector(".start_btn");

    // vars for the start/pause/ restart States
    //-------------------------
    let isGameOver = false;
    let isGamePaused = true;




    // the squares of the map
    //----------------------------------------------------------------------------------------
    let squares = [];


    //fill the game grid with "blocks" aka divs 
    //----------------------------------------------------------------------------------------
    for (let i = 0; i < 400; i++)
    {
        let newDiv = document.createElement("div");

        newDiv.setAttribute("id",i.toString());

        if(i > 379)
        {
            newDiv.setAttribute("class","treasure");
        }

        squares[i] = newDiv;

        grid.appendChild(newDiv);
    }




    //define the aliens
    //----------------------------------------------------------------------------------------
    let aliensArray = [
        0,1,2,3,4,5,6,7,8,9,10,11,12,
        40,41,42,43,44,45,46,47,48,49,50,51,52,
        80,81,82,83,84,85,86,87,88,89,90,91,92,
    ];




    //draw the aliens
    //----------------------------------------------------------------------------------------
    for (let i = 0; i < aliensArray.length; i++)
    {
        if(aliensArray[i] < 20)
        {
            squares[currentAlienIndex + aliensArray[i]].classList.add("enemy_type_3","alien");
        }
        else if(aliensArray[i] < 54 )
        {
            squares[currentAlienIndex + aliensArray[i]].classList.add("enemy_type_2","alien");
        }
        else if(aliensArray[i] > 54)
        {
            squares[currentAlienIndex + aliensArray[i] ].classList.add("enemy_type_1","alien");
        }
    }

    
    
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



        // remove the aliens sprite
        //-----------------------------
        for (let i = 0; i <= aliensArray.length -1; i++)
        {
            if(squares[aliensArray[i]].classList.contains("enemy_type_1") )
            {
                squares[aliensArray[i]].classList.remove("alien","enemy_type_1");
            }
            else if(squares[aliensArray[i]].classList.contains("enemy_type_2") )
            {
                squares[aliensArray[i]].classList.remove("alien","enemy_type_2");
            }
            else if(squares[aliensArray[i]].classList.contains("enemy_type_3") )
            {
                squares[aliensArray[i]].classList.remove("alien","enemy_type_3");
            }
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
             //console.log(aliensArray[i])
            if(i < 13 && !deadAliensArray.includes(i))
            {
                squares[currentAlienIndex + aliensArray[i]].classList.add("alien","enemy_type_3");
            }
            else if(i < 26 && !deadAliensArray.includes(i) )
            {
                squares[currentAlienIndex + aliensArray[i]].classList.add("alien","enemy_type_2");
            }
            else if(i >= 26 && !deadAliensArray.includes(i) )
            {
                squares[currentAlienIndex + aliensArray[i] ].classList.add("alien","enemy_type_1");
            }
        }



        // win game
        //-----------------------------
        if(deadAliensArray.length === aliensArray.length)
        {
            scoreDisplay.textContent = "You Win !!!";
            clearInterval(AlienID);

            start_btn.textContent = "Play Again ?";
            isGameOver = true;
        }



        // game over (if alien hits you)
        //-----------------------------
        if(squares[playerPosIndex].classList.contains("alien","player"))
        {
            scoreDisplay.textContent = "Game Over";

            squares[playerPosIndex].classList.add("boom");

            clearInterval(AlienID);

            start_btn.textContent = "Play Again ?";
            isGameOver = true;

            checkGameOver();
            

        }


        // game over (if reach the treasure)
        //-----------------------------
        for (let i = 0; i < aliensArray.length; i++) 
        {
            if(aliensArray[i] > squares.length - (GRID_WIDTH -1))
            {
                scoreDisplay.textContent = "Game Over";

                clearInterval(AlienID);

                isGameOver = true;
                checkGameOver();
                break;
            }    
        }

    }






    //---------------------------
    let canShoot = true;
    //---------------------------

    //shoot
    //----------------------------------------------------------------------------------------
    function shoot(e)
    {
        
        let laserID;
        let currentLaserPos = playerPosIndex;
        let hit = true; // this is to fix a bug in which the laser can hit more than one enemy

        //move the laser from the player to the alien
        function moveLaser()
        {
            canShoot = false;

            if(!isGamePaused && !isGameOver)
            {
                squares[currentLaserPos].classList.remove("laser");
                
                currentLaserPos -= GRID_WIDTH;
                
                squares[currentLaserPos].classList.add("laser");
            }

            
            
            //check if laser hits enemy or the end of the screen
            //------------------------------------
            if(squares[currentLaserPos].classList.contains("alien"))
            {
                hit = true;

                squares[currentLaserPos].classList.remove("laser");

                squares[currentLaserPos].classList.remove("alien");


                // update scores based on enemy killed
                if(squares[currentLaserPos].classList.contains("enemy_type_1"))
                {
                    squares[currentLaserPos].classList.remove("enemy_type_1");

                    scoreValue += 10;
                }
                else if(squares[currentLaserPos].classList.contains("enemy_type_2"))
                {
                    squares[currentLaserPos].classList.remove("enemy_type_2");

                    scoreValue += 20;
                }
                else if(squares[currentLaserPos].classList.contains("enemy_type_3"))
                {
                    squares[currentLaserPos].classList.remove("enemy_type_3");

                    scoreValue += 30;
                }
                
                squares[currentLaserPos].classList.add("boom");

                setTimeout( ()=> squares[currentLaserPos].classList.remove("boom"),60);

                clearInterval(laserID);

                //add dead alien to the dead aliens array
                const deadAlien = aliensArray.indexOf(currentLaserPos);
                
                deadAliensArray.push(deadAlien);

                scoreDisplay.textContent = scoreValue.toString();

                canShoot = true;
            }


            //remove the laser if it reach the end of the game map
            if(currentLaserPos < GRID_WIDTH)
            {
                hit = true;

                clearInterval(laserID);
                setTimeout(() => squares[currentLaserPos].classList.remove("laser"),100);

                canShoot = true;
            }
        }


        
        // shoot the laser with space bar
        // if the shoot has hit something
        if(e.keyCode === 32 && canShoot && !isGamePaused && hit)
        {
            laserID = setInterval(moveLaser,100);
        }

    }




    
    // enemy shoot
    //----------------------------------------------------------------------------------------
    function enemyShot()
    {
        // select a random enemy to shoot
        let randomEnemyIndex = Math.floor(Math.random() * aliensArray.length);

        let enemylaserID;
        let currentLaserPos2 = aliensArray[randomEnemyIndex]; 

        function moveEnemyLaser()
        {

            if(!isGamePaused && !isGameOver)
            {

                squares[currentLaserPos2].classList.remove("enemy_laser");
                    
                currentLaserPos2 += GRID_WIDTH;
                
                squares[currentLaserPos2].classList.add("enemy_laser");
            }


            if(squares[currentLaserPos2].classList.contains("player"))
            {
                // set game over
                isGameOver = true;
                checkGameOver();

                //put dead sprite   
                
            }
            else if(currentLaserPos2 > playerPosIndex)
            {
                clearInterval(enemylaserID);
                setTimeout(() => squares[currentLaserPos2].classList.remove("enemy_laser"),100);
            }



        }


        //only enemies alive and without an enemy in front of them can shoot
        // the * 2 is because the enemy rows are 40 blocks apart from each other
        if(squares[currentLaserPos2].classList.contains("alien") 
           && !squares[currentLaserPos2 + (GRID_WIDTH * 2)].classList.contains("alien"))
        {
            //isGameOver ? 0 : enemylaserID = setInterval(moveEnemyLaser,330);
            if(!isGameOver && !isGamePaused)
            {
                enemylaserID = setInterval(moveEnemyLaser,270);
            }
        }


    }


    
    



    // check shot (only here because paused game and to prevent memory leaks)
    //-----------------------------------
    function check_shot(e)
    {
        if(canShoot)
        {
            shoot(e);
        }
    }




    // checkGameOver
    //----------------------------------------------------------------------------------------
    function checkGameOver()
    {   

        isGamePaused = !isGamePaused;

        isGamePaused ? start_btn.textContent = "Play" : start_btn.textContent = "Pause";

        canShoot = true;

        // if the game is over, and the button is pressed
        // restart the game
        if(isGameOver)
        {   
            start_btn.textContent = "Play Again ?";

            //remove the shots 
            for (let i = 0; i < squares.length; i++)
            {
                if(squares[i].classList.contains("enemy_laser"))
                {
                    squares[i].classList.remove("enemy_laser");
                    console.log("removed");
                }
            }

            // reset the aliens and the player states
            aliensArray.forEach(
                (i) =>
                {
                    if(squares[i].classList.contains("alien"))
                    {
                        squares[i].classList.remove("alien","enemy_type_1","enemy_type_2","enemy_type_3");
                    }
                }
            )

            

            squares[playerPosIndex].classList.remove("boom");
            squares[playerPosIndex].classList.remove("player");


            //restart the player pos and the alien pos
            currentAlienIndex = 0;
            playerPosIndex = 370;

            //console.log(aliensArray);

            
            // restart the aliens array
            //----------------------------------------------------------------------------------------
            aliensArray = [
                0,1,2,3,4,5,6,7,8,9,10,11,12,
                40,41,42,43,44,45,46,47,48,49,50,51,52,
                80,81,82,83,84,85,86,87,88,89,90,91,92,
            ];


            // restart the dead aliens array
            //----------------------------------------------------------------------------------------
            while (deadAliensArray.length)
            {
                deadAliensArray.pop();
            }



            //draw the aliens
            //----------------------------------------------------------------------------------------
            for (let i = 0; i < aliensArray.length; i++)
            {
                if(aliensArray[i] < 20)
                {
                    squares[currentAlienIndex + aliensArray[i]].classList.add("enemy_type_3","alien");
                }
                else if(aliensArray[i] < 54 )
                {
                    squares[currentAlienIndex + aliensArray[i]].classList.add("enemy_type_2","alien");
                }
                else if(aliensArray[i] > 54)
                {
                    squares[currentAlienIndex + aliensArray[i] ].classList.add("enemy_type_1","alien");
                }
            }
            
            
            // draw the player
            //----------------------------------------------------------------------------------------
            squares[playerPosIndex].classList.add("player");


            

            //reset score
            scoreValue = 0;
            scoreDisplay.textContent = "0";

            isGameOver = !isGameOver;

            //console.log(deadAliensArray);
            
        }




        // stop / pause game
        //--------------------------------------------------------------
        if(!isGamePaused && !isGameOver)
        {
            ///-------------------------------- 
            AlienID = setInterval(moveAliens,500);

            //----------------------------------
            enemyShotRoutineId =  setInterval(enemyShot,530);


            //activate the player movement via callback function 
            //(or registering the function as an event)
            //----------------------------------------------------------------------------------------
            document.addEventListener("keydown",movePlayer); ///


            // prevent the player from shooting until
            // the laser hits something (an enemy or the end of the map)
            document.addEventListener("keydown", (e) => check_shot(e));


        }
        else
        {
            
            clearInterval(AlienID);
            clearInterval(enemyShotRoutineId);

            canShoot = false;

            //activate the player movement via callback function 
            //(or registering the function as an event)
            //----------------------------------------------------------------------------------------
            document.removeEventListener("keydown",movePlayer);


            document.removeEventListener("keydown",check_shot);
        }



    }


    // start / pause / restart game --- btn logic
    //--------------------------------------------------------------
    start_btn.addEventListener("click",checkGameOver);





});