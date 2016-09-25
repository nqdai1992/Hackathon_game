class Client{
    constructor(newTankPosition){
        this.socket=io();

        this.socket.emit('newTankPosition',newTankPosition);

        this.socket.on('newPlayerJoined',function(msg){
            Tank.onNewplayerJoined(msg);
        });

        this.socket.on('listOtherTanks',function(msg){
            Tank.onReceivedTankInfo(msg);
        });

        this.socket.on('idUserdisconnect',function(msg){
            Tank.onPlayerDisconnected(msg);
        });

        this.socket.on('playerTankMoved',function(msg){
            Tank.onPlayerTankMoved(msg);
        });

        this.socket.on('playerGunMoved',function(msg){
            Tank.onPlayerGunMoved(msg);
        });

        this.socket.on('playerFired', function(msg){
            Tank.onPlayerFired(msg);
        });

        this.socket.on('playerTankDied',function(msg){
            Tank.onPlayerDied(msg);
        });
    }

    move(msg){
        this.socket.emit('tankMoved',msg);
    }

    movegun(angle){
        this.socket.emit('gunMoved',angle);
    }
    fire(){
        var msg = {};
        this.socket.emit('gunFired', msg);
    }
    tankDie(msg){
        this.socket.emit('tankDied',msg);
    }
}
