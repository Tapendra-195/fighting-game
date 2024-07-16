//Sprite
class Sprite {
    constructor({posdim={position:{x:0,y:0},width:0,height:0}, imageSrc,imageDim,framesMax=1,offset={x:0,y:0}}){
        this.position =posdim.position
        this.imageDim = imageDim
        this.image = new Image()
        this.image.src = imageSrc
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed =0
        this.framesHold =5
        this.offset=offset
        this.characterBox= {
            position: {x:this.position.x, y:this.position.y},
            width: posdim.width,
            height: posdim.height
        }  
    }

    draw(){
        //ctx.strokeRect(this.characterBox.position.x,this.characterBox.position.y,this.characterBox.width,this.characterBox.height)

        ctx.drawImage(this.image,this.framesCurrent*(this.image.width/this.framesMax),0,this.image.width/this.framesMax, this.image.height, this.position.x-this.offset.x,this.position.y-this.offset.y,this.imageDim.width,this.imageDim.height)
        
    }

    animateFrames(){
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold===0){
         if(this.framesCurrent < this.framesMax-1){
             this.framesCurrent++
          }
         else{
             this.framesCurrent = 0
         }
     }
    } 

    update(){
       this.draw()
        this.animateFrames()
    }

}

class Fruit extends Sprite{
    constructor({posdim,imageSrc,imageDim,framesMax,offset={x:0,y:0}}){
        
        super({posdim,imageSrc,imageDim,framesMax,offset})
        this.eaten = false; 
        this.framesCurrent = 0
        this.framesElapsed =0
        this.framesHold =5
        
                
    }


    move(){

        if(this.eaten){
            this.position.x = Math.random() * 900+20;
            this.position.y = Math.random() * 365+20;
            this.characterBox.position.x = this.position.x
            this.characterBox.position.y = this.position.y
            //ctx.fillRect(this.characterBox.position.x-this.characterBox.offset.x,this.characterBox.position.y-this.characterBox.offset.y,this.characterBox.width,this.characterBox.height)
            //this.draw()
        }
        this.eaten = false 
    }

}

//Player class
class Fighter extends Sprite{
    constructor({posdim,velocity,color="red",imageSrc,imageDim,framesMax=1,offset={x:0,y:0},sprites,attackBox}){
        super({posdim,imageSrc,imageDim,framesMax,offset})
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {x:this.position.x, y:this.position.y},
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }

        this.color = color
        this.isAttaking
        this.health = 100

        this.framesCurrent = 0
        this.framesElapsed =0
        this.framesHold =5
        this.sprites = sprites
        for(const sprite in sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        this.dead = false
    }


    update(){
        this.attackBox.position.x = this.position.x+this.attackBox.offset.x
        this.attackBox.position.y = this.position.y+this.attackBox.offset.y
        //ctx.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)

        this.characterBox.position.x = this.position.x
        this.characterBox.position.y = this.position.y
        

        this.draw()
        if(!this.dead){
            this.animateFrames()
        }
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y
        
        if(this.position.y+this.height+this.velocity.y>=canvas.height-96){
            this.velocity.y=0
            this.position.y=330
        }
        else{
            this.velocity.y += gravity
        }
    }

    attack(){
        this.isAttaking = true
        this.switchSprite("attack1")

    }

    takehit(){
        
        this.health -=20
        if(this.health<=0){
            this.switchSprite("death")
        }
        else{
            this.switchSprite("takehit")
        }
    }

    takehealth(){
        if(this.health+20<=100){
            this.health +=20
        }
    }

    switchSprite(sprite){
        if(this.image === this.sprites.attack1.image && this.framesCurrent<this.framesMax-1) return
        if(this.image === this.sprites.takehit.image && this.framesCurrent<this.framesMax-1) return
        if(this.image === this.sprites.death.image){
            if(this.framesCurrent === this.framesMax-1) {
                this.dead = true
            }
            return
        } 


        switch (sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent =0
                }
                break
            case 'run':
                if(this.image != this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent =0
                }
                break;
            case 'jump':
                if(this.image != this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent =0
                }
                break;
            case 'fall':
                if(this.image != this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent =0
                }
                break;
            case 'attack1':
                if(this.image != this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax  
                    this.framesCurrent =0
                }
                break;
            case 'takehit':
                if(this.image != this.sprites.takehit.image){
                    this.image = this.sprites.takehit.image
                    this.framesMax = this.sprites.takehit.framesMax    
                    this.framesCurrent =0
                }
                break;             
            case 'death':
                if(this.image != this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax    
                    this.framesCurrent =0
                }
                break; 
        }
    }
}
