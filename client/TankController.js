class TankController {
  constructor(id,x,y,groupTank,groupGun,groupBullet,name){
    this.tank=groupTank.create(x,y,'tankRight');
    this.tank.idTank=id;
    this.tank.gun=groupGun.create(x+26,y+3,'gunRight');
    this.tank.gun.anchor.setTo(0,0.1);
    this.tank.scale.setTo(0.35,0.35);
    this.tank.gun.scale.setTo(0.35,0.35);
    this.bullet=groupBullet.create(0,0,'bullet');
    this.bullet.idBullet=id;
    this.bullet.exists=false;
    this.bullet.scale.setTo(0.05,0.05);
    this.text = new Phaser.Text(Tank.game, 0, -25, name, {
        font: 'bold 30pt Arial',
        fill : 'white',
        stroke : 'black',
        strokeThickness : 3
    });
    this.text.anchor.set(0.5,0.5);
    this.tank.addChild(this.text);
    Tank.game.physics.arcade.enable(this.tank);
    Tank.game.physics.arcade.enable(this.tank.gun);
    Tank.game.physics.arcade.enable(this.bullet);
    this.bullet.body.gravity.y=Tank.config.GRAVITY;

    console.log(this.tank.key);
  }

  movetank(direction){
    if(direction.x>0){
      this.tank.body.velocity.x=Tank.config.TANK_SPEED;
      this.tank.loadTexture('tankRight');
      this.text.anchor.set(0.5,0.5);
      this.tank.gun.position.x=this.tank.position.x+26;
      this.tank.gun.position.y=this.tank.position.y+3;
      this.tank.gun.body.velocity.x=Tank.config.TANK_SPEED;
      this.tank.gun.anchor.setTo(0,0.1);
      this.tank.gun.loadTexture('gunRight');
    }else if(direction.x<0){
      this.tank.body.velocity.x=-Tank.config.TANK_SPEED;
      this.tank.loadTexture('tankLeft');
      this.text.anchor.set(-0.5,0.5);
      this.tank.gun.position.x=this.tank.position.x+43;
      this.tank.gun.position.y=this.tank.position.y+3;
      this.tank.gun.body.velocity.x=-Tank.config.TANK_SPEED;
      this.tank.gun.anchor.setTo(1,0);
      this.tank.gun.loadTexture('gunLeft');
    }else{
      this.tank.body.velocity.x=0;
      this.tank.gun.body.velocity.x=0;
    }
  }

  movegun(angle){
    if(this.tank.gun.key=='gunRight'){
      if (angle==1&&this.tank.gun.angle>-90){
        this.tank.gun.angle--;
      }else if(angle==0&&this.tank.gun.angle<0){
        this.tank.gun.angle++;
      }else if (this.tank.gun.angle>0){
        this.tank.gun.angle= -this.tank.gun.angle;
      }
    } else if(this.tank.gun.key=='gunLeft'){
      if (angle==1&&this.tank.gun.angle<90){
        this.tank.gun.angle++;
      }else if(angle==0&&this.tank.gun.angle>0){
        this.tank.gun.angle--;
      }else if(this.tank.gun.angle<0){
        this.tank.gun.angle=-this.tank.gun.angle;
      }
    }
  }

  fire(){
    if(this.tank.gun.key=='gunRight'&&this.tank.alive==true){
      this.bullet.reset(this.tank.gun.position.x-10, this.tank.gun.position.y);
      Tank.game.camera.follow(this.bullet);
      var p= new Phaser.Point(this.tank.gun.position.x,this.tank.gun.position.y);
      p.rotate(p.x,p.y,this.tank.gun.roatation,false,34);
      this.boom=Tank.game.add.sprite(this.tank.gun.position.x, this.tank.gun.position.y,'boom');
      this.boom.scale.setTo(0.7,0.7);
      this.boom.anchor.setTo(-0.7,0.4);
      this.boom.angle=this.tank.gun.angle;
      this.boom.animations.add('fire');
      this.boom.animations.play('fire',32,1,true);
      this.smoke=Tank.game.add.sprite(this.tank.gun.position.x,this.tank.gun.position.y,'smoke');
      this.smoke.scale.setTo(0.7,0.7);
      this.smoke.anchor.setTo(-0.5,0.5);
      this.smoke.angle=this.tank.gun.angle;
      this.smoke.animations.add('smk');
      this.smoke.animations.play('smk',8,1,true);
      Tank.game.physics.arcade.velocityFromRotation(this.tank.gun.rotation, Tank.config.BULLET_POWER, this.bullet.body.velocity);
    } else if(this.tank.gun.key=='gunLeft'&&this.tank.alive==true){
      this.boom=Tank.game.add.sprite(this.tank.gun.position.x, this.tank.gun.position.y,'boom');
      this.boom.scale.setTo(0.7,0.7);
      this.boom.anchor.setTo(-0.7,0.6);
      this.boom.angle=180+this.tank.gun.angle;
      this.boom.animations.add('fire');
      this.boom.animations.play('fire',32,1,true);
      this.smoke=Tank.game.add.sprite(this.tank.gun.position.x,this.tank.gun.position.y,'smoke');
      this.smoke.scale.setTo(0.7,0.7);
      this.smoke.anchor.setTo(-0.5,0.5);
      this.smoke.angle=180+this.tank.gun.angle;
      this.smoke.animations.add('smk');
      this.smoke.animations.play('smk',8,1,true);
      this.bullet.reset(this.tank.gun.position.x-10, this.tank.gun.position.y);
      Tank.game.camera.follow(this.bullet);
      var p= new Phaser.Point(this.tank.gun.position.x,this.tank.gun.position.y);
      p.rotate(p.x,p.y,this.tank.gun.roatation,false,34);
      Tank.game.physics.arcade.velocityFromRotation(this.tank.gun.rotation, -Tank.config.BULLET_POWER, this.bullet.body.velocity);
    }
  }

  destroy(){
    this.tank.destroy();
    this.tank.gun.destroy();
  }
}
