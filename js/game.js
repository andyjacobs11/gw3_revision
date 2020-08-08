//Start
engine = {
   objects: [],
   running: false,
   jump: false,
   speed: 5,
   init: function() {
      this.canvas = document.querySelectorAll('canvas')[0]
      this.canvasSize = this.canvas.getBoundingClientRect()
      this.canvas.width = this.canvasSize.width
      this.canvas.height = this.canvasSize.height
      this.score = document.querySelectorAll('.points')[0]
      this.hiscore = document.querySelectorAll('.hipoints')[0]
      this.playagain = document.querySelectorAll('.playagain')[0]
      console.log(this.score)
      this.canvas.addEventListener('click', function(){ engine.start() })
      this.canvas.addEventListener('keydown', function(){ engine.start() })
      this.ctx = this.canvas.getContext('2d')
      this.ctx.imageSmoothingEnabled = false
      this.clearcreateObjects()
      this.loop()
       this.score.innerHTML = 0
   },
   start: function(){
      if(!this.running){
         console.log('starting!!!')
         this.clearcreateObjects()
         this.running = true
         this.score.innerHTML = 0
         this.loop()
         this.playagain.style.opacity = 0
      }
      engine.jump = true
   },
   clearcreateObjects: function(){
      this.objects = []
      engine.createObject('ground', 0, engine.canvas.height-40)
      engine.createObject('ground', sprites.ground.width, engine.canvas.height-40)
      engine.createObject('ground', sprites.ground.width*2, engine.canvas.height-40)
      engine.createObject('dino', 50, engine.canvas.height-85)
      engine.createObject('bird', engine.canvas.width+1000, engine.canvas.height-70)
      engine.createObject('cactus', engine.canvas.width, engine.canvas.height-95)
   },
   createSprite: function(url) {
      var img = document.createElement('img')
      img.src = url
      return img
   },
   drawSprite: function(info) {
      this.ctx.drawImage(
         info.sprite.src, //HTML Image Element
         (info.frame || 0) * info.sprite.width/info.sprite.frames, //Image X-Offset
         0, //Image Y-Offset
         info.sprite.width/info.sprite.frames, //Frame Width
         info.sprite.height, //Frame Height
         info.x, //X Position
         info.y, //Y Position
         info.sprite.width/info.sprite.frames, //Draw Width
         info.sprite.height //Draw Height
      )
   },
   createObject: function(objName, x, y){
      var obj = new objects[objName]
      obj.x = x; obj.y = y; obj.id = this.objects.length
      this.objects.push(obj)
   },
   loop: function() {
      that = this
      if(this.running)
         setTimeout(function(){ that.loop(); that.jump = false }, 33)
         that.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
         that.objects.forEach(function(object){
            object.step()
         })
         engine.speed = Math.floor(this.score.innerHTML/100)+5
   },
   end: function(){
      this.running = false
      this.hiscore.innerHTML = Math.max(Number(this.score.innerHTML), Number(this.hiscore.innerHTML))
      this.playagain.style.opacity = 1
   },
   collision: function(main, range){
      for(var i = 3; i < engine.objects.length; i++){
         if(i !== main.id){
            var other = engine.objects[i]
            var x1 = main.x+range
            var x2 = main.x-range+main.sprite.width/main.sprite.frames
            var y1 = main.y + range
            var y2 = main.y-range+main.sprite.height
            var ox1 = other.x+range
            var ox2 = other.x-range+other.sprite.width/other.sprite.frames
            var oy1 = other.y + range
            var oy2 = other.y-range+other.sprite.height
            if(x2 > ox1 && x1 < ox2 && y1 < oy2 && y2 > oy1){
               return true
            }
         }
      }
      return false
   },
}

var sprites = {
   dino_stand: {
      src: engine.createSprite('https://s3-us-west-2.amazonaws.com/s.cdpn.io/545665/dinogame-dino-stand.png'),
      frames: 1, width: 64, height: 69
   },
   dino_run: {
      src: engine.createSprite('https://s3-us-west-2.amazonaws.com/s.cdpn.io/545665/dinogame-dino-run.png'),
      frames: 2, width: 128, height: 69
   },
   dino_die: {
      src: engine.createSprite('https://s3-us-west-2.amazonaws.com/s.cdpn.io/545665/dinogame-dino-die.png'),
      frames: 1, width: 128, height: 69
   },
   bird: {
      src: engine.createSprite('https://s3-us-west-2.amazonaws.com/s.cdpn.io/545665/dinogame-bird.png'),
      frames: 2, width: 147, height: 54
   },
   cactus1: {
      src: engine.createSprite('https://s3-us-west-2.amazonaws.com/s.cdpn.io/545665/dinogame-cactus1.png'),
      frames: 1, width: 26, height: 56
   },
   cactus2: {
      src: engine.createSprite('https://s3-us-west-2.amazonaws.com/s.cdpn.io/545665/dinogame-cactus2.png?v=1'),
      frames: 1, width: 70, height: 70
   },
   cactus3: {
      src: engine.createSprite('https://s3-us-west-2.amazonaws.com/s.cdpn.io/545665/dinogame-cactus3.png?v=2'),
      frames: 1, width: 64, height: 90
   },
   ground: {
      src: engine.createSprite('https://s3-us-west-2.amazonaws.com/s.cdpn.io/545665/dinogame-ground.png'),
      frames: 1, width: 389, height: 12
   },
   sun: {
      src: engine.createSprite('https://s3-us-west-2.amazonaws.com/s.cdpn.io/545665/dino-sun2.png'),
      frames: 1, width: 64, height: 64
   }
}

//All in one package :]
objects = {
   dino: function(){
      return {
         timer: 0,
         frame: 0,
         vspeed: 0,
         sprite: sprites.dino_stand,
         step: function() {
            this.timer -= 1
            if(this.timer < 0){
               this.frame = this.frame == 1 ? 0 : 1
               this.timer = 5
               that.score.innerHTML = Number(that.score.innerHTML) + 1
            }
            //Vertical
            this.vspeed += 1
            if(engine.jump && this.y >= engine.canvas.height -90)
               this.vspeed = -16

            if(this.y < engine.canvas.height -90 || this.vspeed < 0)
               this.y += this.vspeed

            engine.drawSprite({
               sprite: sprites.dino_run,
               x: this.x,
               y: this.y,
               frame: this.frame
            })

            if(engine.collision(this, 10)){
               console.log('wtf')
               engine.end()
            }
         }
      }
   },
   ground: function(){
      return {
         sprite: sprites.ground,
         step: function(){
            this.x -= engine.speed
            if(this.x + this.sprite.width < 0)
               this.x = this.sprite.width*2

            engine.drawSprite({
               sprite: sprites.ground,
               x: this.x,
               y: this.y
            })
         }
      }
   },
   bird: function(){
      return {
         timer: 20,
         sprite: sprites.bird,
         step: function(){
            this.timer -= 1
            if(this.timer < 0){
               this.frame = this.frame == 1 ? 0 : 1
               this.timer = 12
            }

            this.x -= Math.ceil(engine.speed * 1.3)
            if(this.x + this.sprite.width < 0){
               if(!engine.collision(this, -100))
                  this.x = engine.canvas.width + Math.floor(Math.random()*500);
            }

            engine.drawSprite({
               sprite: sprites.bird,
               x: this.x,
               y: this.y,
               frame: this.frame
            })
         }
      }
   },
   cactus: function(){
      return{
         sprite: sprites.cactus3,
         step: function(){
            this.x -= engine.speed
            if(this.x + this.sprite.width < 0){
               var savex = this.x
               this.x = engine.canvas.width
               if(!engine.collision(this, -100))
                  this.x = engine.canvas.width
               else
                  this.x=savex

               this.sprite = sprites['cactus'+Math.floor(Math.random()*3+1)]
            }
            this.y = engine.canvas.height-this.sprite.height-10
            engine.drawSprite({
               sprite: this.sprite,
               x: this.x,
               y: this.y,
            })
         }
      }
   }
}

engine.init()
