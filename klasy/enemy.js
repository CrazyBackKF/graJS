class Enemy
{
    constructor({hitbox, collisionBlocks2d})
    {
        this.hitbox = hitbox;
        this.collisionBlocks2d = collisionBlocks2d;
        this.isColliding = false;
        this.attackCooldown = 1000;
        this.lastAttackTime = 0;

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

        this.scale = {
            x: 2,
            y: 2
        }
        this.health = 200;
        this.attack = 20;
    }

    update()
    {
        
        ctx.save();
        ctx.scale(2,2);
        if(this.health > 0) this.draw();
        ctx.restore();
        this.fall();
        this.checkCollisions2();
        this.checkCollisions();
        this.physics();
    }
    
    draw()
    {
        ctx.fillStyle = "red";
        ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
    }

    physics()
    {
        this.hitbox.position.x += this.velocity.x;
        this.hitbox.position.y += this.velocity.y;
    }

    fall()
    {
        if (this.hitbox.position.y + this.hitbox.height + this.velocity.y < canvas.height / this.scale.y)
        {
            this.velocity.y += this.speed.gravity;
        }
        else 
        {
            this.velocity.y = 0;
        }
    }

    checkCollisions() 
    {
        
        for (let i = 0; i < this.collisionBlocks2d.length; i++)
        {
            const scaledY = (this.collisionBlocks2d[i].position.y + player.camerabox.translate.y) * 0.75;
            const scaledX = (this.collisionBlocks2d[i].position.x + player.camerabox.translate.x) * 0.75;
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
                    break;
                }

                if (this.velocity.x < 0)
                {
                    this.velocity.x = 0;
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
                const scaledY = (this.collisionBlocks2d[i].position.y + player.camerabox.translate.y) * 0.75;
                const scaledX = (this.collisionBlocks2d[i].position.x + player.camerabox.translate.x) * 0.75;
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
                        break;
                    }
    
                }
    
            }
    }
}