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
        this.isAttackingState = false;
        this.health = 200;
        this.lastAttack = 0;
        
        this.hitbox = {
            position: {
                x: 0,
                y: 0
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
            jump: -3.8,
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
        player.physics();
        player.move();
        player.jump();
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
        this.camerabox.position.x = this.hitbox.position.x + this.hitbox.width / 2 - this.camerabox.width / 2;
        this.camerabox.position.y = this.hitbox.position.y + this.hitbox.height / 2 - this.camerabox.height / 2;
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
        if(key.w && this.velocity.y == 0)
        { 
            this.velocity.y = this.speed.jump;
            this.isJumping = true;
        }
    }

    attack()
    {
        if(this.isAttacking)
        {
            for (let i = 0; i < slimeArray.length; i++)
            {
                if(slimeArray.length == 0) return;
                const slime = slimeArray[i];
                if (this.attackbox.position.y + this.attackbox.height >= slime.hitbox.position.y * slime.scale.y / scaleCharacter.y &&
                    this.attackbox.position.y <= (slime.hitbox.position.y + slime.hitbox.height) * slime.scale.y / scaleCharacter.y &&
                    this.attackbox.position.x <= (slime.hitbox.position.x + slime.hitbox.width) * slime.scale.x / scaleCharacter.x &&
                    this.attackbox.position.x + this.attackbox.width >= slime.hitbox.position.x * slime.scale.x / scaleCharacter.x && 
                    this.isAttacking && Date.now() - this.lastAttack >= 500)
                {
                    if ((this.state == "AttackL" && this.animations.AttackL.currentFrame >= 4) || 
                    (this.state == "AttackR" && this.animations.AttackR.currentFrame >= 4))
                    {   
                        slime.health -= 20;
                        if(slime.health > 0) slime.state = "Hurt";
                        if((slime.hitbox.position.x + slime.hitbox.width / 2) * slime.scale.x >= (this.hitbox.position.x + this.hitbox.width / 2) * scaleCharacter.x) var animationAcceleration = 50;
                        else var animationAcceleration = -50;
                        gsap.to(slime.hitbox.position, {
                            x: slime.hitbox.position.x + animationAcceleration,
                        })
                        this.isAttacking = false;
                        this.lastAttack = Date.now();
                    }
                    
                }
            }
        }
    }

    hurt()
    {
        for (let i = 0; i < slimeArray.length; i++)
        {
            if(slimeArray.length == 0) return;
            const slime = slimeArray[i];
            if (this.attackbox.position.y + this.attackbox.height >= slime.hitbox.position.y * slime.scale.y / scaleCharacter.y &&
                this.attackbox.position.y <= (slime.hitbox.position.y + slime.hitbox.height) * slime.scale.y / scaleCharacter.y &&
                this.attackbox.position.x <= (slime.hitbox.position.x + slime.hitbox.width)* slime.scale.x / scaleCharacter.x &&
                this.attackbox.position.x + this.attackbox.width >= slime.hitbox.position.x * slime.scale.x / scaleCharacter.x)
            {
                if (Date.now() - slime.lastAttackTime > 1000)
                {
                    this.health -= slime.attack; 
                    slime.lastAttackTime = Date.now();
                }
                
            }
        }
    }

    physics()
    {
        this.hitbox.position.x += this.velocity.x;
        this.checkCollisionsHorizontal();
        this.velocity.y += this.speed.gravity;
        this.hitbox.position.y += this.velocity.y;
        this.checkCollisionsVertical();
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
        
        else if (!this.isJumping || this.velocity.y == 0)
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

        else if (this.isJumping && this.velocity.y < 0)
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

    checkCollisionsHorizontal() {
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
                    if (this.velocity.x > 0) 
                    {
                        this.velocity.x = 0;
                        this.hitbox.position.x = scaledX - this.hitbox.width - 0.01;
                        break;
                    }
        
                    if (this.velocity.x < 0) 
                    {
                        this.velocity.x = 0;
                        this.hitbox.position.x = scaledX + scaledWidth + 0.01;
                        break;
                    }
                }
        }
    }

    checkCollisionsVertical()
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
                        if (this.velocity.y > 0) 
                        {
                            this.velocity.y = 0;
                            this.hitbox.position.y = scaledY - this.hitbox.height - 0.01;
                            this.isJumping = false;
                            break;
                        }
            
                        if (this.velocity.y < 0) 
                        {
                            this.velocity.y = 1;
                            this.hitbox.position.y = scaledY + scaledHeight + 0.01;
                            break;
                        }
                    }
            }
    }


    moveCameraRight()
    {
        if (this.camerabox.translate.x <= -5450) return;
        if ((this.camerabox.position.x + this.camerabox.width) * scaleCharacter.x >= canvas.width && key.d && !this.isHorizontallyColliding)
        {
            if (key.shift)
            {
                this.camerabox.translate.x -= (this.velocity.x * this.speed.sprint);
                this.hitbox.position.x -= (this.velocity.x * this.speed.sprint);
                for (let i = 0; i < slimeArray.length; i++)
                {
                    slimeArray[i].hitbox.position.x -= (this.velocity.x * this.speed.sprint) * scale.x / slimeArray[i].scale.x;
                }
            }
            else 
            {
                this.camerabox.translate.x -= this.velocity.x;
                this.hitbox.position.x -= this.velocity.x;
                for (let i = 0; i < slimeArray.length; i++)
                {
                    slimeArray[i].hitbox.position.x -= this.velocity.x * scale.x / slimeArray[i].scale.x;
                }
            }    
            
        }
    }

    moveCameraLeft()
    {
        if(this.camerabox.translate.x >= 0) return;
        if (this.camerabox.position.x * scale.x <= 0 && key.a && !this.isHorizontallyColliding)
        {
            if (key.shift)
            {
                this.camerabox.translate.x -= (this.velocity.x * this.speed.sprint);
                this.hitbox.position.x -= (this.velocity.x * this.speed.sprint);
                for (let i = 0; i < slimeArray.length; i++)
                {
                    slimeArray[i].hitbox.position.x -= (this.velocity.x * this.speed.sprint) * scale.x / slimeArray[i].scale.x;
                }
            }
            else 
            {
                this.camerabox.translate.x -= this.velocity.x;
                this.hitbox.position.x -= this.velocity.x;
                for (let i = 0; i < slimeArray.length; i++)
                {
                    slimeArray[i].hitbox.position.x -= this.velocity.x * scale.x / slimeArray[i].scale.x;
                }
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
            for (let i = 0; i < slimeArray.length; i++)
            {
                slimeArray[i].hitbox.position.y -= this.velocity.y * scale.y / slimeArray[i].scale.y;
            }
        }
    }

    moveCameraUp()
    {
        
        if (this.camerabox.translate.y >= 0) return;
        if (this.camerabox.position.y <= 0 && this.velocity.y < 0)
        {
            this.camerabox.translate.y -= this.velocity.y;
            this.hitbox.position.y -= this.velocity.y;
            for (let i = 0; i < slimeArray.length; i++)
            {
                slimeArray[i].hitbox.position.y -= this.velocity.y * scale.y / slimeArray[i].scale.y;
            }
        }
    }
}