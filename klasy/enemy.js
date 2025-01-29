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
        this.canJump = true;
        this.slimeAnimations = slimeAnimations;
        this.lastDirection;
        this.canAttack = true;
        this.isColliding = false;
        this.hurtAnimation = false;
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
        this.position.x = this.hitbox.position.x - 23;
        this.position.y = this.hitbox.position.y - 37;
        ctx.save();
        ctx.scale(this.scale.x, this.scale.y);
        //this.draw();
        this.drawImage();
        this.animate();
        ctx.restore();
        this.move();
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
        if(this.health >= 0) ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y - 10, this.hitbox.width * (this.health / this.fullHealth), 3);
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
        this.checkCollisions();
        this.velocity.y += this.speed.gravity;
        this.hitbox.position.y += this.velocity.y;
        this.checkCollisions2();
    }

    attackAnimation()
    {
        const self = this;
        const lastPlayerPosition = player.hitbox.position.x + player.hitbox.width / 2;
        gsap.to(this.hitbox.position, {
            x: lastPlayerPosition * scaleCharacter.x / this.scale.x,
            duration: 1,
            ease: "power1.out",
            onUpdate: function() {
            {
                for (let i = 0; i < self.collisionBlocks2d.length; i++) 
                {
                const scaledY = (self.collisionBlocks2d[i].position.y + player.camerabox.translate.y) * scale.y / self.scale.y;
                const scaledX = (self.collisionBlocks2d[i].position.x + player.camerabox.translate.x) * scale.x / self.scale.x;
                const scaledWidth = self.collisionBlocks2d[i].width * scale.x / self.scale.x;
                const scaledHeight = self.collisionBlocks2d[i].height * scale.y / self.scale.y;
            
                    if (self.hitbox.position.y + self.hitbox.height + self.velocity.y >= scaledY &&
                        self.hitbox.position.y + self.velocity.y <= scaledY + scaledHeight &&
                        self.hitbox.position.x <= scaledX + scaledWidth &&
                        self.hitbox.position.x + self.hitbox.width >= scaledX)
                        {
                            if ((self.hitbox.position.x - (scaledX + scaledWidth) < 1) || (scaledX - self.hitbox.position.x + self.hitbox.width) < 1)
                            {
                                self.canAttack = true;
                                this.pause();
                            }
                        }
                    }
                }
            },
            onComplete: () =>
            {
                self.canAttack = true;
            }
        })
    }

    move()
    {
        if (player.isJumping) 
        {
            this.velocity.x = 0.00000001
            return;
        }
        if (this.health <= 0) 
        {
            this.velocity.x = 0;
            return;
        };
        const attackCondition = Math.abs(((this.hitbox.position.x - this.hitbox.width / 2) * this.scale.x) - ((player.hitbox.position.x - player.hitbox.width / 2) * scaleCharacter.x))
        const attackCondition2 = (Math.floor((this.hitbox.position.y + this.hitbox.height) * this.scale.y) == Math.floor((player.hitbox.position.y + player.hitbox.height) * scaleCharacter.y))
        if (attackCondition <= 300 && attackCondition >= 100 && this.canAttack &&  attackCondition2 && !this.hurtAnimation)
        {
            this.canAttack = false;
            const self = this;
            gsap.to(this.hitbox.position, {
                x: this.hitbox.position.x - 5,
                onUpdate: function() {
                    {
                        for (let i = 0; i < self.collisionBlocks2d.length; i++) 
                        {
                        const scaledY = (self.collisionBlocks2d[i].position.y + player.camerabox.translate.y) * scale.y / self.scale.y;
                        const scaledX = (self.collisionBlocks2d[i].position.x + player.camerabox.translate.x) * scale.x / self.scale.x;
                        const scaledWidth = self.collisionBlocks2d[i].width * scale.x / self.scale.x;
                        const scaledHeight = self.collisionBlocks2d[i].height * scale.y / self.scale.y;
                    
                            if (self.hitbox.position.y + self.hitbox.height + self.velocity.y >= scaledY &&
                                self.hitbox.position.y + self.velocity.y <= scaledY + scaledHeight &&
                                self.hitbox.position.x <= scaledX + scaledWidth &&
                                self.hitbox.position.x + self.hitbox.width >= scaledX)
                                {
                                    if ((self.hitbox.position.x - (scaledX + scaledWidth) < 1) || (scaledX - self.hitbox.position.x + self.hitbox.width) < 1)
                                    {
                                        self.canAttack = true;
                                        this.pause();
                                        self.attackAnimation();
                                    }
                                }
                            }
                        }
                    },
                onComplete: () => {
                    self.attackAnimation();
                }
            })    
              
        }
        if (Math.ceil(this.hitbox.position.x + this.hitbox.width / 2) * this.scale.x == Math.ceil(player.hitbox.position.x + player.hitbox.width / 2) * scaleCharacter.x)
        {
            this.velocity.x = 0;
        }
        if (Math.ceil(this.hitbox.position.x + this.hitbox.width / 2) * this.scale.x < Math.ceil(player.hitbox.position.x + player.hitbox.width / 2) * scaleCharacter.x)
        {
            this.lastDirection = "right";
            this.velocity.x = this.speed.right;
        }
        else if(Math.ceil(this.hitbox.position.x + this.hitbox.width / 2) * this.scale.x > Math.ceil(player.hitbox.position.x + player.hitbox.width / 2) * scaleCharacter.x)
        {
            this.lastDirection = "left";
            this.velocity.x = this.speed.left;
        }
    }

    jump()
    {
        if (this.health <= 0) return;
        if(this.velocity.x == 0) this.velocity.y = this.speed.jump;
    }

    checkCollisions() 
    {
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
                        this.jump();
                        this.hitbox.position.x = scaledX - this.hitbox.width - 0.01;
                        break;
                    }
        
                    if (this.velocity.x < 0) 
                    {
                        this.velocity.x = 0;
                        this.jump();
                        this.hitbox.position.x = scaledX + scaledWidth + 0.01;
                        break;
                    }
                }
        }
    }

    checkCollisions2()
    {
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
                    if (this.velocity.y > 0) 
                    {
                        this.velocity.y = 0;
                        this.hitbox.position.y = scaledY - this.hitbox.height - 0.01;
                        break;
                    }
                    else this.isColliding = false;
        
                    if (this.velocity.y < 0) 
                    {
                        this.velocity.y = 1;
                        this.hitbox.position.y = scaledY + scaledHeight + 0.01;
                        break;
                    }
                }
        }
    }
}
