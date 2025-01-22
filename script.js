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
            framesCounter: 0,
            allFrames: 4,
            isRepetitive: true
        },

        IdleL: {
            imageSrc: "sprite/IdleL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 0,
            allFrames: 4,
            isRepetitive: true
        },

        JumpL: {
            imageSrc: "sprite/JumpL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 0,
            allFrames: 4,
            isRepetitive: true
        },

        JumpR: {
            imageSrc: "sprite/JumpR.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 0,
            allFrames: 4,
            isRepetitive: true
        },

        RunL: {
            imageSrc: "sprite/RunL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 0,
            allFrames: 6,
            isRepetitive: true
        },

        RunR: {
            imageSrc: "sprite/RunR.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 0,
            allFrames: 6,
            isRepetitive: true
        },

        WalkL: {
            imageSrc: "sprite/WalkL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 0,
            allFrames: 6,
            isRepetitive: true
        },

        WalkR: {
            imageSrc: "sprite/WalkR.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 0,
            allFrames: 6,
            isRepetitive: true
        },

        AttackL: {
            imageSrc: "sprite/AttackL.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 0,
            allFrames: 6,
            isRepetitive: false
        },

        AttackR: {
            imageSrc: "sprite/AttackR.png",
            currentFrame: 0,
            frameBuffer: 15,
            framesCounter: 0,
            allFrames: 6,
            isRepetitive: false
        }
    },
    collisionBlocks2d: collisionBlocks2d
});

const slime = new Enemy({
    hitbox: {
        position: {
            x: 200,
            y: 100
        },
        width: 20,
        height: 20,
    },
    collisionBlocks2d: collisionBlocks2d
})

function animate()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background.image, 0, 0, 1400, 800)
    map.update();
    //for (collision of collisionBlocks2d)
    //{
    //    collision.draw();
    //}   bloki kolizji
    slime.update();
    player.update();

    

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
