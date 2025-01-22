class Sprite
{
    constructor({width, height, position, imageSrc})
    {
        this.width = width;
        this.height = height;
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
    }
    
    draw()
    {
        if (!this.image) return;
        ctx.drawImage(this.image, this.position.x, this.position.y);
        ctx.restore();
    }

    update()
    {
        ctx.save();
        ctx.scale(scale.x, scale.y);
        ctx.translate(player.camerabox.translate.x, player.camerabox.translate.y);
        map.draw();
        ctx.restore();
    }
}