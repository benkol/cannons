function ShootyController(args) {
    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    args.parent.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup',   handleCanvasMouseUp);
    canvas.addEventListener('mouseout',  handleCanvasMouseOut);
    
    var mousePosition = {
        x: null,
        y: null
    }

    function Cannon(color, position) {
        var radius = 15;
        this.x = position.x;
        this.y = position.y;
        
        this.draw = function(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }
        
        this.wasClicked = function(clickPosition) {
            return (Math.pow(clickPosition.x - this.x, 2) + Math.pow(clickPosition.y - this.y, 2) < Math.pow(radius, 2));
        }
    }
    
    function Bullet() {
        
        var radius = 5;
        var speed = 10;
        var x = cannon.x;
        var y = cannon.y;
        
        var angle = getAngle(cannon.x, cannon.y, mousePosition.x, mousePosition.y)
        
        this.draw = function(){
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = args.bulletColor;
            ctx.fill();
        }
        
        this.updatePosition = function() {
            var angleRad = angle * (Math.PI/180); //angle in radians
            x = x + speed * Math.cos(angleRad);
            y = y + speed * Math.sin(angleRad);
        }
        
        this.isOutOfSight = function() {
            return (
                x + radius < 0 ||
                y + radius < 0 ||
                x - radius > canvas.width ||
                y - radius > canvas.height);
        }
        
        function getAngle(cx, cy, ex, ey) {
            var dy = ey - cy;
            var dx = ex - cx;
            var theta = Math.atan2(dy, dx);
            theta *= 180 / Math.PI;
            //if (theta < 0) theta = 360 + theta; // range [0, 360)
            return theta;
        }
    }

    var createBullets = false;
    
    function handleCanvasMouseDown(event) {
        var clickPosition = getEventPosition(event);
        if (cannon) {
            if (cannon.wasClicked(clickPosition)) {
                destroyCannon();
            } else {
                createBullets = true;
            }
        } else {
            createCannon(args.color, clickPosition);
        }
    }
    
    function handleCanvasMouseMove(event) {
        mousePosition = getEventPosition(event);
    }
    
    function handleCanvasMouseUp(event) {
        createBullets = false;
    }
    
    function handleCanvasMouseOut(event) {
        createBullets = false;
    }
    
    function getEventPosition(event) {
        var rect = canvas.getBoundingClientRect();
        return {
            'x': event.clientX - rect.left,
            'y': event.clientY - rect.top
        }
    }
    
    var cannon = null;

    function createCannon(color, position) {
        cannon = new Cannon(color, position);
    }

    function destroyCannon() {
        cannon = null;
    }
    
    var bullets = [];

    function createBullet() {
        var bullet = new Bullet();
        bullets.push(bullet);
    }

    function destroyBullet(i) {
        bullets.splice(i, 1);
    }
    
    function drawBullets() {
	for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];

            if (bullets.length > 500) {
                bullets.shift();
            }

            bullet.draw();
            bullet.updatePosition();
            
            if (bullet.isOutOfSight()) {
                destroyBullet(i);
            }
	}
    }
    
    function drawCannon() {
        if (cannon) {
            cannon.draw();
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBullets();
        drawCannon();
    }
    
    var rateOfFire = 25;
    setInterval(function() {
        if (createBullets) {
            createBullet();
        }
    }, 1000/rateOfFire);
    
    var frameRate = 60;
    setInterval(function() {
        draw();
    }, 1000/frameRate);
    
}