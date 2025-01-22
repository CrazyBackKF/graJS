const scale = {
    x: 1.5,
    y: 1.5
}

const scaleCharacter = {
    x: 2,
    y: 2
}

class Player {
    constructor({animations, collisionBlocks2d})
    {
        this.lastDirection = "right"
        this.isJumping = false;
        this.isAttacking = false;
        this.isCollidingLeft = false;
        this.isCollidingRight = false
        this.canJump = false;
        this.isAttackingState = false;
        this.health = 200;
        
        this.hitbox = {
            position: {
                x: 0,
                y: 20
            },
            width: 18,
            height: 34,
        }

        this.camerabox = {
            position: {
                x: -275,
                y: -100
            },
            width: 600,
            height: 300,
            translate: {
                x: 0,
                y: -600
            }
        }
        
        this.position = {
            x: 0,
            y: 0
        }
        
        this.velocity = {
            x: 0,
            y: 0
        }

        this.speed = {
            left: -1,
            right: 1,
            jump: -3.5,
            gravity: 0.05,
            sprint: 1.3
        }

        this.attackbox = {
            position: {
                x: 0,
                y: 0
            },
            width: 15,
            height: 10,
            attack: 20
        }

        this.image = new Image();
        
        this.state = "IdleR";
        
        this.animations = animations;
      
        this.collisionBlocks2d = collisionBlocks2d;
    }

    update()
    {
        player.updateAttackBox();
        player.attack();
        player.hurt();
        player.updateCamera();
        player.checkState();
        player.changeState();
        ctx.save();
        ctx.scale(scaleCharacter.x, scaleCharacter.y);
        player.draw();
        player.drawCharacter();
        ctx.restore();
        player.fall();
        player.move();
        player.checkCollisions2();
        player.checkCollisions();
        player.jump();
        player.physics();
        player.checkIfHitCanvas();
        player.moveCameraRight();
        player.moveCameraLeft();
        player.moveCameraDown();
        player.moveCameraUp();
    }

    updateAttackBox()
    {
        if (this.lastDirection == "right") this.attackbox.position.x = this.hitbox.position.x + 10;
        if (this.lastDirection == "left") this.attackbox.position.x = this.hitbox.position.x - 7;
        this.attackbox.position.y = this.hitbox.position.y + 10;
    }

    updateCamera()
    {
        if (this.hitbox.position.x != 0 && this.hitbox.position.x < 682) this.camerabox.position.x += this.velocity.x;
        this.camerabox.position.y += this.velocity.y;
    }
    
    draw()
    {
        //ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
        //ctx.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)
        //
        //ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        //ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

        ctx.fillStyle = "rgba(0, 0, 255, 0.5)"
        ctx.fillRect(this.attackbox.position.x, this.attackbox.position.y, this.attackbox.width, this.attackbox.height)
    }

    drawCharacter()
    {
        if(!this.image) return;
        const cropbox = 
        {
            position: {
              x: this.animations[this.state].currentFrame * (this.image.width / this.animations[this.state].allFrames),
              y: 0,
            },
            width: this.image.width / this.animations[this.state].allFrames,
            height: this.image.height,
        }
    
        if (this.lastDirection == "right")
        {
            ctx.drawImage(
                this.image,
                cropbox.position.x,
                cropbox.position.y,
                cropbox.width,
                cropbox.height,
                this.hitbox.position.x - 4,
                this.hitbox.position.y - 13,
                this.image.width / this.animations[this.state].allFrames,
                this.image.height
            )
        }

        else if (this.lastDirection == "left")
            {
                ctx.drawImage(
                    this.image,
                    (this.animations[this.state].allFrames - this.animations[this.state].currentFrame - 1) * (this.image.width / this.animations[this.state].allFrames),
                    cropbox.position.y,
                    cropbox.width,
                    cropbox.height,
                    this.hitbox.position.x - 8 - this.hitbox.width,
                    this.hitbox.position.y - 13,
                    this.image.width / this.animations[this.state].allFrames,
                    this.image.height
                )
            }
        
        
    if (this.animations[this.state].framesCounter % this.animations[this.state].frameBuffer == 0)
    {
        if(this.animations[this.state].currentFrame < this.animations[this.state].allFrames - 1) this.animations[this.state].currentFrame++;
        else if (!(this.animations[this.state].isRepetitive))
        {
            this.animations[this.state].currentFrame = 0;
            if (this.lastDirection == "right") this.state = "IdleR";
            if (this.lastDirection == "left") this.state = "IdleL";
            this.isAttackingState = false;
        }
        else this.animations[this.state].currentFrame = 0;
    } 
    this.animations[this.state].framesCounter++;
        
    }

    fall()
    {
        if ((this.hitbox.position.y + this.hitbox.height + this.velocity.y < canvas.height / scale.x)) 
        {
            this.velocity.y += this.speed.gravity;
            this.canJump = false;
        }
        else 
        {
            this.velocity.y = 0;
            this.canJump = true;
        }    
            
    }

    move()
    {
        if((!key.d && !key.a) || (key.a && key.d)) 
        {
            this.velocity.x = 0;
        }    
            
        else if(key.d) 
        {
            if(key.shift) this.velocity.x = this.speed.right * this.speed.sprint;
            else this.velocity.x = this.speed.right;
            player.lastDirection = "right";
        }
        else if(key.a) 
        {    
            if(key.shift) this.velocity.x = this.speed.left * this.speed.sprint;
            else this.velocity.x = this.speed.left;
            player.lastDirection = "left";
        }
        else return;
    }

    jump()
    {
        if(key.w && this.canJump)
        { 
            this.velocity.y = this.speed.jump;
            this.gravity = 0.05;
            this.isJumping = true;
            this.canJump = false;
        }
    }

    attack()
    {
        if(this.isAttacking)
        {
            if (this.attackbox.position.y + this.attackbox.height >= slime.hitbox.position.y &&
                this.attackbox.position.y <= slime.hitbox.position.y + slime.hitbox.height &&
                this.attackbox.position.x <= slime.hitbox.position.x + slime.hitbox.width &&
                this.attackbox.position.x + this.attackbox.width >= slime.hitbox.position.x && 
                this.isAttacking)
            {
                if ((this.state = "AttackL" && this.animations.AttackL.currentFrame >= 4) || 
                (this.state = "AttackR" && this.animations.AttackR.currentFrame >= 4))
                {   
                    slime.health -= 20;
                    this.isAttacking = false;
                }
                
            }
        }
    }

    hurt()
    {
        if (this.hitbox.position.y + this.hitbox.height >= slime.hitbox.position.y &&
            this.hitbox.position.y <= slime.hitbox.position.y + slime.hitbox.height &&
            this.hitbox.position.x <= slime.hitbox.position.x + slime.hitbox.width &&
            this.hitbox.position.x + this.hitbox.width >= slime.hitbox.position.x)
        {
            if (Date.now() - slime.lastAttackTime > 1000)
            {
                this.health -= slime.attack; 
                slime.lastAttackTime = Date.now();
            }
            
        }
    }

    physics()
    {
        this.hitbox.position.y += this.velocity.y;
        this.hitbox.position.x += this.velocity.x;
    }

    checkIfHitCanvas()
    {
        if((this.hitbox.position.x + this.hitbox.width) >= canvas.width / scale.x) this.hitbox.position.x = (canvas.width / scale.x) - this.hitbox.width;
        if(this.hitbox.position.x < 0) this.hitbox.position.x = 0;
    }

    checkState()
    {
        if (this.isAttackingState)
        {
            if (this.lastDirection == "right") this.state = "AttackR";
            else if (this.lastDirection == "left") this.state = "AttackL";
        }
        
        else if (!this.isJumping)
        {
            if (this.velocity.x != 0)
            {
                if (key.shift)
                {
                    if (this.lastDirection == "right") this.state = "RunR";
                    else if (this.lastDirection == "left") this.state = "RunL";
                }
                else
                {
                    if (this.lastDirection == "right") this.state = "WalkR";
                    else if (this.lastDirection == "left") this.state = "WalkL";
                }    
            }
            else
            {
                if (this.lastDirection == "right") this.state = "IdleR";
                else if (this.lastDirection == "left") this.state = "IdleL";
            }
        }

        else if (this.isJumping)
        {
            if (this.lastDirection == "right") this.state = "JumpR";
            else if (this.lastDirection == "left") this.state = "JumpL";
        }


    }

    changeState()
    {
        switch(this.state)
        {
            case "IdleR":
                this.image.src = this.animations.IdleR.imageSrc;
                break;
            
            case "JumpR":
                this.image.src = this.animations.JumpR.imageSrc;
                break;
            
            case "AttackR":
                this.image.src = this.animations.AttackR.imageSrc;
                break;
            
            case "RunR":
                this.image.src = this.animations.RunR.imageSrc;
                break;
            
            case "WalkR":
                this.image.src = this.animations.WalkR.imageSrc;
                break;
            
            case "IdleL":
                this.image.src = this.animations.IdleL.imageSrc;
                break;
            
            case "JumpL":
                this.image.src = this.animations.JumpL.imageSrc;
                break;
            
            case "AttackL":
                this.image.src = this.animations.AttackL.imageSrc;
                break;
            
            case "RunL":
                this.image.src = this.animations.RunL.imageSrc;
                break;
            
            case "WalkL":
                this.image.src = this.animations.WalkL.imageSrc;
                break;
        }
    }

    checkCollisions() 
    {
        
        for (let i = 0; i < this.collisionBlocks2d.length; i++)
        {
            this.isCollidingLeft = false;
            this.isCollidingRight = false;
            const scaledY = (this.collisionBlocks2d[i].position.y + this.camerabox.translate.y) * 0.75;
            const scaledX = (this.collisionBlocks2d[i].position.x + this.camerabox.translate.x) * 0.75;
            const scaledWidth = this.collisionBlocks2d[i].width * 0.75;
            const scaledHeight = this.collisionBlocks2d[i].height * 0.75;

            if (this.hitbox.position.y + this.hitbox.height + this.velocity.y >= scaledY &&
                this.hitbox.position.y + this.velocity.y <= scaledY + scaledHeight &&
                this.hitbox.position.x + this.velocity.x <= scaledX + scaledWidth &&
                this.hitbox.position.x + this.hitbox.width + this.velocity.x >= scaledX)
            {

                if (this.velocity.x > 0)
                {
                    key.d = false;
                    this.isCollidingRight = true;
                    this.velocity.x = 0;
                    break;
                }

                if (this.velocity.x < 0)
                {
                    key.a = false
                    this.isCollidingLeft = true;
                    this.velocity.x = 0;
                    break;
                }

            }

        }
    }

    checkCollisions2()
    {
        for (let i = 0; i < this.collisionBlocks2d.length; i++)
            {
                const scaledY = (this.collisionBlocks2d[i].position.y + this.camerabox.translate.y) * 0.75;
                const scaledX = (this.collisionBlocks2d[i].position.x + this.camerabox.translate.x) * 0.75;
                const scaledWidth = this.collisionBlocks2d[i].width * 0.75;
                const scaledHeight = this.collisionBlocks2d[i].height * 0.75;
    
                if (this.hitbox.position.y + this.hitbox.height + this.velocity.y >= scaledY &&
                    this.hitbox.position.y + this.velocity.y <= scaledY + scaledHeight &&
                    this.hitbox.position.x + this.velocity.x <= scaledX + scaledWidth &&
                    this.hitbox.position.x + this.hitbox.width + this.velocity.x >= scaledX)
                {

                    if (this.velocity.y < 0)
                    {
                        this.velocity.y = 1;
                        break;
                    }
                    
                    if (this.velocity.y > 0)
                    {
                        this.velocity.y = 0;
                        this.canJump = true;
                        this.isJumping = false;
                        break;
                    }
    
                }
    
            }
    }

    moveCameraRight()
    {
        if (this.camerabox.translate.x <= -5450) return;
        if ((this.camerabox.position.x + this.camerabox.width) * scaleCharacter.x >= canvas.width && key.d)
        {
            if (key.shift)
            {
                this.camerabox.translate.x -= (this.velocity.x * this.speed.sprint);
                this.hitbox.position.x -= (this.velocity.x * this.speed.sprint);
                this.camerabox.position.x -= (this.velocity.x * this.speed.sprint);
                slime.hitbox.position.x -= (this.velocity.x * this.speed.sprint) * 0.75;
            }
            else 
            {
                this.camerabox.translate.x -= this.velocity.x;
                this.hitbox.position.x -= this.velocity.x;
                this.camerabox.position.x -= this.velocity.x;
                slime.hitbox.position.x -= this.velocity.x * 0.75;
            }    
            
        }
    }

    moveCameraLeft()
    {
        if(this.camerabox.translate.x >= 0) return;
        if (this.camerabox.position.x * scale.x <= 0 && key.a)
        {
            if (key.shift)
            {
                this.camerabox.translate.x -= (this.velocity.x * this.speed.sprint);
                this.hitbox.position.x -= (this.velocity.x * this.speed.sprint);
                this.camerabox.position.x -= (this.velocity.x * this.speed.sprint);
                slime.hitbox.position.x -= (this.velocity.x * this.speed.sprint) * 0.75;
            }
            else 
            {
                this.camerabox.translate.x -= this.velocity.x;
                this.hitbox.position.x -= this.velocity.x;
                this.camerabox.position.x -= this.velocity.x;
                slime.hitbox.position.x -= this.velocity.x * 0.75;
            }    
            
        }
    }

    moveCameraDown()
    {
        
        if (this.camerabox.translate.y <= -1058) return;
        if (this.camerabox.position.y + this.camerabox.height >= canvas.height / 2 && this.velocity.y > 0)
        {
            this.camerabox.translate.y -= this.velocity.y;
            this.hitbox.position.y -= this.velocity.y;
            this.camerabox.position.y -= this.velocity.y;
            slime.hitbox.position.y -= this.velocity.y * 0.75;
        }
    }

    moveCameraUp()
    {
        
        if (this.camerabox.translate.y >= 0) return;
        if (this.camerabox.position.y <= 0 && this.velocity.y < 0)
        {
            this.camerabox.translate.y -= this.velocity.y;
            this.hitbox.position.y -= this.velocity.y;
            this.camerabox.position.y -= this.velocity.y;
            slime.hitbox.position.y -= this.velocity.y * 0.75;
        }
    }
}