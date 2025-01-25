class Enemy
{
    static scale = {
        x: 4,
        y: 4
    }
    constructor({hitbox, collisionBlocks2d, slimeAnimations})
    {
        this.hitbox = hitbox;
        this.collisionBlocks2d = collisionBlocks2d;
        this.isColliding = false;
        this.attackCooldown = 1000;
        this.lastAttackTime = 0;

        this.position = {
            x: this.hitbox.position.x - 20,
            y: this.hitbox.position.y - 20
        }
        
        this.velocity = {
            x: 0,
            y: 0
        }

        this.speed = {
            left: -0.2,
            right: 0.2,
            jump: -1.2,
            gravity: 0.05,
            sprint: 1.3
        }

        this.scale = {
            x: Enemy.scale.x,
            y: Enemy.scale.y
        }
        this.fullHealth = 200;
        this.health = 200;
        this.attack = 20;
        this.slimeAnimations = slimeAnimations;
        this.state = "Move"
        this.image = new Image();
        this.animations = {
            Move: {
                imageSrc: this.slimeAnimations.Move.imageSrc,
                allFrames: this.slimeAnimations.Move.allFrames,
                currentFrame: this.slimeAnimations.Move.currentFrame,
                framesCounter: this.slimeAnimations.Move.framesCounter,
                framesBuffer: this.slimeAnimations.Move.framesBuffer,
                isRepetitive: this.slimeAnimations.Move.isRepetitive,
            },
    
            Hurt: {
                imageSrc: this.slimeAnimations.Hurt.imageSrc,
                allFrames: this.slimeAnimations.Hurt.allFrames,
                currentFrame: this.slimeAnimations.Hurt.currentFrame,
                framesCounter: this.slimeAnimations.Hurt.framesCounter,
                framesBuffer: this.slimeAnimations.Hurt.framesBuffer,
                isRepetitive: this.slimeAnimations.Hurt.isRepetitive,
            },
    
            Death: {
                imageSrc: this.slimeAnimations.Death.imageSrc,
                allFrames: this.slimeAnimations.Death.allFrames,
                currentFrame: this.slimeAnimations.Death.currentFrame,
                framesCounter: this.slimeAnimations.Death.framesCounter,
                framesBuffer: this.slimeAnimations.Death.framesBuffer,
                isRepetitive: this.slimeAnimations.Death.isRepetitive,
            }
        }
        }


    update()
    {
        console.log(this.animations)
        this.position.x = this.hitbox.position.x - 23;
        this.position.y = this.hitbox.position.y - 37;
        ctx.save();
        ctx.scale(this.scale.x, this.scale.y);
        //this.draw();
        this.drawImage();
        this.animate();
        ctx.restore();
        this.fall();
        this.move();
        this.checkCollisions2();
        this.checkCollisions();
        this.jump();
        this.physics();
    }
    
    draw()
    {
        ctx.fillStyle = "red";
        ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
    }

    drawImage()
    {
        if(!this.image) return;
        const currentAnimation = this.animations[this.state];
        ctx.drawImage
        (
            this.image,
            (this.image.width / currentAnimation.allFrames) * currentAnimation.currentFrame,
            0,
            this.image.width / currentAnimation.allFrames,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / currentAnimation.allFrames,
            this.image.height
        )
        ctx.fillStyle = "red";
        ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y - 10, this.hitbox.width * (this.health / this.fullHealth), 3);
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.hitbox.position.x, this.hitbox.position.y - 10, this.hitbox.width, 3);
    }

    animate()
    {
        const currentAnimation = this.animations[this.state];
        this.image.src = currentAnimation.imageSrc
        if (currentAnimation.framesCounter % currentAnimation.framesBuffer == 0)    
        {    
            if (currentAnimation.currentFrame < currentAnimation.allFrames - 1) this.animations[this.state].currentFrame++;
            else 
            {
                this.animations[this.state].currentFrame = 0;
                if(!currentAnimation.isRepetitive) 
                {
                    this.state = "Move"
                }
            }
        }
        this.animations[this.state].framesCounter++;
    }

    physics()
    {
        this.hitbox.position.x += this.velocity.x;
        this.hitbox.position.y += this.velocity.y;
    }

    fall()
    {
        this.velocity.y += this.speed.gravity;
    }

    move()
    {
        if (this.health <= 0) 
        {
            this.velocity.x = 0;
            return;
        };
        if (this.hitbox.position.x * this.scale.x < player.hitbox.position.x * scaleCharacter.x)
        {
            this.velocity.x = this.speed.right;
            //this.state = "Move";
        }
        else if(this.hitbox.position.x * this.scale.x > player.hitbox.position.x * scaleCharacter.x)
        {
            this.velocity.x = this.speed.left;
            //this.state = "Move";
        }
    }

    jump()
    {
        if (this.health <= 0) return;
        if(this.velocity.x == 0) this.velocity.y = this.speed.jump;
    }

    checkCollisions() 
    {
        this.isColliding = false;
        for (let i = 0; i < this.collisionBlocks2d.length; i++)
        {
            const scaledY = (this.collisionBlocks2d[i].position.y + player.camerabox.translate.y) * scale.y / this.scale.y;
            const scaledX = (this.collisionBlocks2d[i].position.x + player.camerabox.translate.x) * scale.x / this.scale.x;
            const scaledWidth = this.collisionBlocks2d[i].width * scale.x / this.scale.x;
            const scaledHeight = this.collisionBlocks2d[i].height * scale.y / this.scale.y;

            if (this.hitbox.position.y + this.hitbox.height + this.velocity.y >= scaledY &&
                this.hitbox.position.y + this.velocity.y <= scaledY + scaledHeight &&
                this.hitbox.position.x + this.velocity.x <= scaledX + scaledWidth &&
                this.hitbox.position.x + this.hitbox.width + this.velocity.x >= scaledX)
            {

                if (this.velocity.x > 0)
                {
                    this.velocity.x = 0;
                    this.isColliding = true;
                    break;
                }

                if (this.velocity.x < 0)
                {
                    this.velocity.x = 0;
                    this.isColliding = true;
                    break;
                }

            }

        }
    }

    checkCollisions2()
    {
        this.isColliding = false;
        for (let i = 0; i < this.collisionBlocks2d.length; i++)
            {
                const scaledY = (this.collisionBlocks2d[i].position.y + player.camerabox.translate.y) * scale.y / this.scale.y;
                const scaledX = (this.collisionBlocks2d[i].position.x + player.camerabox.translate.x) * scale.x / this.scale.x;
                const scaledWidth = this.collisionBlocks2d[i].width * scale.x / this.scale.x;
                const scaledHeight = this.collisionBlocks2d[i].height * scale.y / this.scale.y;
    
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
                        break;
                    }
    
                }
    
            }
    }
}
