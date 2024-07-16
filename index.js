const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext("2d")

//set canvas width
canvas.width = 1024
canvas.height = 576

ctx.fillRect(0,0,canvas.width,canvas.height)

let remTime = 50
let timerId
const gravity = 0.7

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './sprite/background/background.png',
    imageDim:{
        width:canvas.width,
        height:canvas.height
    }
})

const shop = new Sprite({
    posdim:{
        position:{
        x:700,
        y:160
        },
        width:0,
        height:0
    },
    imageSrc: './sprite/decorations/shop_anim.png',
    imageDim:{
        width:300,
        height:320
    },
    framesMax: 6
})

const fruit = new Fruit({
    posdim:{
        position:{
            x:0,
            y:0
        },
        width:30,
        height:40
    },
    imageSrc:'./sprite/decorations/heart.png',
    imageDim:{
        width:40,
        height:60
    },
    framesMax: 4,
    offset:{
        x:5,
        y:5
    }
})

const player = new Fighter({
    posdim:{
        position:{
            x:0,
            y:0
        },
        width:85,
        height:150
    },
    velocity:{
        x:0,
        y:4
    },
    offset:0,
    imageSrc:'./sprite/player1/Idle.png',
    imageDim:{
        width:600,
        height:620
    },
    framesMax: 8,
    offset:{
        x:260,
        y:230
    },
    sprites:{
        idle:{
            imageSrc:"./sprite/player1/Idle.png",
            framesMax:8
        },
        run:{
            imageSrc:"./sprite/player1/Run.png",
            framesMax:8
        },
        jump:{
            imageSrc:"./sprite/player1/Jump.png",
            framesMax:2
        },
        fall:{
            imageSrc:"./sprite/player1/Fall.png",
            framesMax:2
        },
        attack1:{
            imageSrc:"./sprite/player1/Attack1.png",
            framesMax:6
        },
        takehit:{
            imageSrc:"./sprite/player1/TakeHit.png",
            framesMax:4
        },
        death:{
            imageSrc:"./sprite/player1/Death.png",
            framesMax:6
        }
    },
    attackBox:{
        offset:{
            x:120,
            y:50
        },
        width:180,
        height:50
    }


})

const enemy = new Fighter({
    posdim:{
        position:{
        x:800,
        y:0
        },
        width:50,
        height:150
    },
    velocity:{
        x:0,
        y:0,
    },
    color: "blue",
    offset: 0,
    imageSrc:'./sprite/player2/Idle.png',
    imageDim:{
        width:600,
        height:620
    },
    framesMax: 4,
    offset:{
        x:260,
        y:245
    },
    sprites:{
        idle:{
            imageSrc:"./sprite/player2/Idle.png",
            framesMax:4
        },
        run:{
            imageSrc:"./sprite/player2/Run.png",
            framesMax:8
        },
        jump:{
            imageSrc:"./sprite/player2/Jump.png",
            framesMax:2
        },
        fall:{
            imageSrc:"./sprite/player2/Fall.png",
            framesMax:2
        },
        attack1:{
            imageSrc:"./sprite/player2/Attack1.png",
            framesMax:4
        },
        takehit:{
            imageSrc:"./sprite/player2/Takehit.png",
            framesMax:3
        },
        death:{
            imageSrc:"./sprite/player2/Death.png",
            framesMax:7
        }
    },
    attackBox:{
        offset:{
            x:-200,
            y:50
        },
        width:180,
        height:50
    }
})

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    }

}


decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    fruit.update()
    player.update()
    enemy.update()
    

    player.velocity.x = 0
    enemy.velocity.x = 0

    if(keys.a.pressed && player.lastKey==="a"){
        player.switchSprite("run")
        player.velocity.x = -5
    }
    else if(keys.d.pressed && player.lastKey==="d"){
        player.switchSprite("run")
        player.velocity.x = 5
    }
    else{
        player.switchSprite("idle")
    }
    //jump
    if(player.velocity.y<0){
        player.switchSprite("jump")
    }
    else if(player.velocity.y>0){
        player.switchSprite("fall")
    }

    if(keys.ArrowLeft.pressed && enemy.lastKey==="ArrowLeft"){
        enemy.switchSprite("run")
        enemy.velocity.x = -5
    }
       else if(keys.ArrowRight.pressed && enemy.lastKey==="ArrowRight"){
        enemy.switchSprite("run")
        enemy.velocity.x = 5
    }
    else{
        enemy.switchSprite("idle")
    }
//jump
    if(enemy.velocity.y<0){
        enemy.switchSprite("jump")
    }
    else if(enemy.velocity.y>0){
        enemy.switchSprite("fall")
    }

    //detect for collision
    //player attacking
    if(rectangularCollision({rectangle1:player.attackBox,rectangle2:enemy.characterBox, isAttaking:player.isAttaking}) && player.framesCurrent ===4){
        player.isAttaking = false
        enemy.takehit()

        let enemyHealth = document.getElementById("enemy-health")
        enemyHealth.style.width = enemy.health+"%"
        
    }

    //attack and miss
    if(player.isAttaking && player.framesCurrent === 4){
        player.isAttaking = false
    }

    console.log(player.isAttaking)

    //enemy attacking
    if(rectangularCollision({rectangle1:enemy.attackBox,rectangle2:player.characterBox, isAttaking:enemy.isAttaking}) && enemy.framesCurrent === 1){
        enemy.isAttaking = false
        player.takehit()

        let playerHealth = document.getElementById("player-health")
        playerHealth.style.width = player.health+"%"
    }

     //attack and miss
     if(enemy.isAttaking && enemy.framesCurrent === 1){
        enemy.isAttaking = false
    }

    //end game based on health
    if(enemy.health<=0 || player.health<=0){
        determineWinner({player,enemy,timerId})
    }

    //detect if player eats fruit
    //if(true){
    if(rectangularCollision({rectangle1:player.characterBox,rectangle2:fruit.characterBox, isAttaking:true})) {
        fruit.eaten=true;
        fruit.move();
        player.takehealth()

        let playerHealth = document.getElementById("player-health")
        playerHealth.style.width = player.health+"%"

    }

     //detect if enemy eats fruit
    //if(true){
        if(rectangularCollision({rectangle1:enemy.characterBox,rectangle2:fruit.characterBox, isAttaking:true})) {
            fruit.eaten=true;
            fruit.move();
            enemy.takehealth()
    
            let enemyHealth = document.getElementById("enemy-health")
            enemyHealth.style.width = enemy.health+"%"
    
        }

}
animate()

window.addEventListener('keydown',(event)=>{
    if(!player.dead){
        switch (event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey = "d"
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = "a"
                break
            case 'w':
                if(player.velocity.y===0){
                    player.velocity.y=-20
                }
                break
            case ' ':
                player.attack()
                break
            }
        }
    if(!enemy.dead){   
        switch(event.key){ 
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = "ArrowRight"
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = "ArrowLeft"
                break
            case 'ArrowUp':
                if(enemy.velocity.y===0){
                    enemy.velocity.y=-20
                }
                break           
            case 'ArrowDown':
                enemy.attack()
                break        
        }
    }
})

window.addEventListener('keyup',(event)=>{
    switch (event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break   
            
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break                 
    }
    
})
