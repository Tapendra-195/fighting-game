function rectangularCollision({rectangle1, rectangle2,isAttaking}){
    if(rectangle1.position.x+rectangle1.width >= rectangle2.position.x && 
       rectangle1.position.x<=rectangle2.position.x+rectangle2.width &&
       rectangle1.position.y+rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        isAttaking){

            console.log("true")
            return true
        }

    return false;
}

function determineWinner({player, enemy,timerId}){
    clearTimeout(timerId)
    let message = document.getElementById("message")
    let msg //message to show
    if(player.health===enemy.health){
        msg = "Tie"
    }
    else if(player.health > enemy.health){
        msg = "Player 1 Wins"
    }
    else{
        msg = "Player 2 Wins"
    }
    message.textContent = msg
}


function decreaseTimer(){
    if(remTime>0){
        timerId = setTimeout(decreaseTimer,1000)
        remTime--
        let timer = document.getElementById("timer")
        timer.textContent = remTime 
    }
    else{
        determineWinner({player,enemy,timerId})
    }
}
