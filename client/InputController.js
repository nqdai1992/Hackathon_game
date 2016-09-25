class InputController{
  constructor(keymap,tankController){
    this.keymap=keymap;
    this.tankController=tankController;
  }
  update(){
    var direction= new Phaser.Point(0,0);
    if (Tank.keyboard.isDown(this.keymap.left)){
      direction.x=-1;
    } else if(Tank.keyboard.isDown(this.keymap.right)){
      direction.x=1;
    }
    this.tankController.movetank(direction);

    var tankPosition = this.tankController.tank.position;
    Tank.client.move({
      direction:direction,
      position:tankPosition
    })

    var angle;
    if (Tank.keyboard.isDown(this.keymap.up)){
      angle=1;
    } else if(Tank.keyboard.isDown(this.keymap.down)){
      angle=0;
    }
    this.tankController.movegun(angle);
    Tank.client.movegun({angle:angle});

    if(Tank.keyboard.isDown(this.keymap.fire)){
      this.tankController.fire();
      Tank.client.fire();
    }
  }
}
