const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


const key = {
    w: false,
    a: false,
    d: false,
    shift: false
}

const map = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    width: 1400,
    height: 800,
    imageSrc: "tlo/tlo.png"
})

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    width: 1400,
    height: 800,
    imageSrc: "tlo/Background.png"
})

var map2d = [];

for (let i = 0; i < collisionBlocksArray.length; i += 201)
{
    map2d.push(collisionBlocksArray.slice(i, i + 201))
}


var collisionBlocks2d = [];

map2d.forEach((row, y) => {
    row.forEach((column, x) => {
        if (column == 1291)
        {
            collisionBlocks2d.push(new collisionBlocks({
                position: {
                    x: x * 32,
                    y: y * 32
                },
                
                width: 32,
                height: 32,
            }))
        }
    })
}
)


const player = new Player({
    animations: {
        IdleR: {
            imageSrc: "sprite/IdleR.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 4,
            isRepetitive: true,
            repeated: 0
        },

        IdleL: {
            imageSrc: "sprite/IdleL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 4,
            isRepetitive: true,
            repeated: 0
        },

        JumpL: {
            imageSrc: "sprite/JumpL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 4,
            isRepetitive: true,
            repeated: 0
        },

        JumpR: {
            imageSrc: "sprite/JumpR.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 4,
            isRepetitive: true,
            repeated: 0
        },

        RunL: {
            imageSrc: "sprite/RunL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 6,
            isRepetitive: true,
            repeated: 0
        },

        RunR: {
            imageSrc: "sprite/RunR.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 6,
            isRepetitive: true,
            repeated: 0
        },

        WalkL: {
            imageSrc: "sprite/WalkL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 6,
            isRepetitive: true,
            repeated: 0
        },

        WalkR: {
            imageSrc: "sprite/WalkR.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 6,
            isRepetitive: true,
            repeated: 0
        },

        AttackL: {
            imageSrc: "sprite/AttackL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 6,
            isRepetitive: false,
            repeated: 0
        },

        AttackR: {
            imageSrc: "sprite/AttackR.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 1,
            allFrames: 6,
            isRepetitive: false,
            repeated: 0
        },
        HurtL: {
            imageSrc: "sprite/HurtL.png",
            currentFrame: 0,
            frameBuffer: 20,
            framesCounter: 1,
            allFrames: 2,
            isRepetitive: false,
            reapeated: 0
        },

        HurtR: {
            imageSrc: "sprite/HurtR.png",
            currentFrame: 0,
            frameBuffer: 20,
            framesCounter: 1,
            allFrames: 2,
            isRepetitive: false,
            reapeated: 0
        }
    },
    collisionBlocks2d: collisionBlocks2d
});
const slimeArray = [];
//const slimeArray = [new Enemy({
//    hitbox: {
//        position: {
//            x: 100,
//            y: 50
//        },
//        width: 16,
//        height: 11,
//    },
//    collisionBlocks2d: collisionBlocks2d,
//    slimeAnimations: slimeAnimations[1]
//})];

function animate()
{
    if (player.isDead)
    {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.font = '200px "Jersey 15"';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';  
            ctx.textBaseline = 'middle';  

            ctx.fillText('Zginąłeś!', canvas.width / 2, canvas.height / 2);
    }
    if (!player.isDead)  
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background.image, 0, 0, 1400, 800)
        map.update();

        //for (collision of collisionBlocks2d)
        //{
        //    collision.draw();
        //}

        if(Math.random() < 0.001 && slimeArray.length < 10)
        {
            const animationsRandom = Math.floor(Math.random() * 4) + 1;
            slimeArray.push(new Enemy({
                hitbox : {
                    position: {
                        x: (canvas.width + 20) / Enemy.scale.x * scaleCharacter.x,
                        y: 0
                    },
                    width: 16,
                    height: 11
                },
                collisionBlocks2d,
                slimeAnimations: slimeAnimations[animationsRandom]
            }))
        }
        
        player.update();
        for (let i = 0; i < slimeArray.length; i++)
        {
            slimeArray[i].update();
            if(slimeArray[i].health <= 0)
            {
                slimeArray[i].state = "Death"
                if (slimeArray[i].animations.Death.currentFrame == slimeArray[i].animations.Death.allFrames - 1) slimeArray.splice(i, 1);
            }
        }
        ctx.fillStyle = "rgba(0, 0, 0)"
        ctx.fillRect(10, 10, 600, 70)
        ctx.fillStyle = "rgba(255, 0, 0)"
        ctx.fillRect(15, 15, 590 * (player.health / 200), 60)
        console.log(player.health)
    }  
        
    requestAnimationFrame(animate);
}

animate();


window.addEventListener("keydown", (event) =>{
    if(event.key.toLowerCase() == "a" && !player.isCollidingLeft) 
    {
        key.a = true;
    }
    if(event.key.toLowerCase() == "d" && !player.isCollidingRight) 
    {
        key.d = true;
    }
    if(event.key.toLowerCase() == "w" || event.key == " ") 
    {
        key.w = true;
        player.isJumping = true;
    }
    if(event.key == "Shift") key.shift = true;
})

window.addEventListener("keyup", (event) =>{
    if(event.key == "a" || event.key == "A") key.a = false;
    if(event.key == "d" || event.key == "D") key.d = false;
    if(event.key == "w" || event.key == "W" || event.key == " ") key.w = false;
    if(event.key == "Shift") key.shift = false;
})

window.addEventListener("click", () => {
    player.isAttackingState = true;
    player.isAttacking = true;
})
