class collisionBlocks
{
    constructor({position, width, height})
    {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    draw()
    {
        ctx.save();
        ctx.scale(scale.x, scale.y);
        ctx.translate(player.camerabox.translate.x, player.camerabox.translate.y);
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }

}