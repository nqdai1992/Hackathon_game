var Tank={
    config:{
        TANK_SPEED:300,
        BULLET_POWER:500,
        GRAVITY:200
    }
};

window.onload = function(){
  console.log(window.innerWidth, window.innerHeight);
  Tank.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '',{
    preload:preload,
    create:create,
    update:update
  });
};

var preload = function(){
  Tank.game.load.image('background','./images/background.png');
  Tank.game.load.image('tankRight','./images/Tank_right.png');
  Tank.game.load.image('tankLeft','./images/Tank_left.png');
  Tank.game.load.image('gunRight','./images/Gun_right.png');
  Tank.game.load.image('gunLeft','./images/Gun_left.png');
  Tank.game.load.image('bullet','./images/mine.png');
  Tank.game.load.spritesheet('boom','./images/fire-spritesheet-420px-by-48pxper-frame.png',52,48,8)
  Tank.game.load.spritesheet('smoke','./images/smoke-ring-spritesheet-75px-by-175px-perframe.png',75,175,8);
  Tank.game.load.spritesheet('explode','./images/explode.png',64,64,16);
};
var create = function(){
  Tank.game.world.setBounds(0, 0, 1366, 638);
  Tank.game.stage.disableVisibilityChange=true;
  Tank.game.physics.startSystem(Phaser.Physics.ARCADE);
  Tank.keyboard = Tank.game.input.keyboard;
//--Background
  var background = Tank.game.add.sprite(0,0,'background');
  background.scale.x=2;
  background.scale.y=1.1;
//--Add group
  Tank.groupBullet=Tank.game.add.group();
  Tank.groupGun=Tank.game.add.group();
  Tank.groupTank=Tank.game.add.group();

//--User name
  var username = prompt("Please enter your name (max 20 chars)", localStorage.getItem('username') || "Khung's Khiep's");
  username = username || "Khung's Khiep's";
  if(username.length > 20) username = username.substring(0, 19);
  localStorage.setItem('username', username);
//--Tank and gun

  xRan = Math.random()*window.innerWidth;
  var yRan = Math.random()*window.innerHeight;
  while(yRan < 550 || yRan > 610){
    yRan = Math.random()*window.innerHeight;
  }

  var newTankPosition = new Phaser.Point(xRan,yRan);
  newTankPosition.name=username;
  Tank.client = new Client(newTankPosition);
  Tank.tank1=new InputController(
  {
    left:Phaser.KeyCode.LEFT,
    right:Phaser.KeyCode.RIGHT,
    up:Phaser.KeyCode.UP,
    down:Phaser.KeyCode.DOWN,
    fire:Phaser.KeyCode.SPACEBAR
  },
  new TankController(Tank.client.socket.id,
                      newTankPosition.x,
                      newTankPosition.y,
                      Tank.groupTank,
                      Tank.groupGun,
                      Tank.groupBullet,
                      newTankPosition.name)
  );
  Tank.groupGun.setAll('body.allowGravity',false);
  Tank.groupTank.setAll('body.allowGravity',false);
};
var onBullethitTank = function(groupTank,groupBullet){
  if( groupTank.idTank != groupBullet.idBullet){
    if( groupTank.idTank == Tank.tank1.tankController.tank.idTank){
      Tank.explode=Tank.game.add.sprite(groupTank.position.x,groupTank.position.y,'explode')
      Tank.explode.animations.add('expl');
      Tank.explode.animations.play('expl',16,1,true)
      groupTank.kill();
      groupTank.gun.kill();
      Tank.client.tankDie(groupTank.position);
      console.log(groupTank.position)
    }
    groupBullet.kill();
  }
};

var update = function(){
  Tank.tank1.update();
  Tank.game.physics.arcade.overlap(Tank.groupTank,Tank.groupBullet,onBullethitTank);
};

Tank.otherTanks = {};
Tank.onNewplayerJoined = function(msg){
  Tank.otherTanks[msg.id] = new TankController(
    msg.id,
    msg.x,
    msg.y,
    Tank.groupTank,
    Tank.groupGun,
    Tank.groupBullet,
    msg.name
  );
}
Tank.onReceivedTankInfo = function(msg){
  for(key in msg){
    if(msg.hasOwnProperty(key)){
      Tank.otherTanks[msg[key].id] = new TankController(
        msg[key].id,
        msg[key].x,
        msg[key].y,
        Tank.groupTank,
        Tank.groupGun,
        Tank.groupBullet,
        msg[key].name
      )
    };
  }
}
Tank.onPlayerDisconnected = function(msg){
    Tank.otherTanks[msg].destroy();
    delete Tank.otherTanks[msg];
}

Tank.onPlayerTankMoved = function(msg){
    if(Tank.otherTanks[msg.id]){
      Tank.otherTanks[msg.id].tank.position=msg.position;
      Tank.otherTanks[msg.id].movetank(msg.direction);
    }
}
Tank.onPlayerGunMoved = function(msg){
  if(Tank.otherTanks[msg.id]){
    Tank.otherTanks[msg.id].movegun(msg.angle);
  }
}

Tank.onPlayerFired = function(msg){
  if(Tank.otherTanks[msg.id]){
    Tank.otherTanks[msg.id].fire();
  }
}
Tank.onPlayerDied = function(msg){
  if(Tank.otherTanks[msg.id]){
    Tank.explode=Tank.game.add.sprite(msg.x,msg.y,'explode')
    Tank.explode.animations.add('expl');
    Tank.explode.animations.play('expl',16,1,true)
    Tank.otherTanks[msg.id].tank.kill();
    Tank.otherTanks[msg.id].tank.gun.kill();
  }
}
