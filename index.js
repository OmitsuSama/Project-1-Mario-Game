const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024

canvas.height = 576

const gravity = 1.5

class Player {
    constructor(){
        this.position = {
            x:100,
            y:100
        }
        this.velocity = {
            x:0,
            y:0
        }
        this.width= 30
        this.height= 30
        this.speed = 10
    }

    draw(){
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.velocity.y + this.height <= canvas.height)
            this.velocity.y += gravity
    }
}

class Platform {
    constructor({x, y, image}){
        this.position = {
            x,
            y
        }
        this.image = image

        this.width= image.width
        this.height= image.height
    }

    draw(){
        // c.fillStyle = "blue"
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}
class GenericObject {
    constructor({x, y, image}){
        this.position = {
            x,
            y
        }
        this.image = image

        this.width= image.width
        this.height= image.height
    }

    draw(){
        // c.fillStyle = "blue"
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}
function createImage(imageurl) {
    const image = new Image()
    image.src = imageurl
    return image
}

let platformImage = createImage("./img/platform.png")
let backgroundImage = createImage("./img/background.png")
let hillsImage = createImage("./img/hills.png")
let platformSmallTall = createImage("./img/platformSmallTall.png")

let player = new Player()
let platforms = []
let genericObjects = []


const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
}

let scrollOffset = 0
function init(){
    function createImage(imageurl) {
        const image = new Image()
        image.src = imageurl
        return image  
    }

    // platformImage = createImage("./img/platform.png")
    // backgroundImage = createImage("./img/background.png")
    // hillsImage = createImage("./img/hills.png")

    player = new Player()
    platforms = [
        new Platform({x:platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTall.width,y:270, image:platformSmallTall}),
        new Platform({x:-1,y:470, image:platformImage }), 
        new Platform({x:platformImage.width - 3,y:470, image:platformImage}),  
        new Platform({x:platformImage.width * 2 + 100,y:470, image:platformImage}), 
        new Platform({x:platformImage.width * 3 + 300,y:470, image:platformImage}),
        new Platform({x:platformImage.width * 4 + 300-2,y:470, image:platformImage}),
        new Platform({x:platformImage.width * 5 + 650-2,y:470, image:platformImage}),
        ]
    genericObjects = [new GenericObject({x:-1,y:-1, image:backgroundImage}), new GenericObject({x:0,y:0, image:hillsImage})]


    scrollOffset = 0
}
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0, canvas.width, canvas.height)
    genericObjects.forEach(genericObjects => {
        genericObjects.draw()
    })
    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()
    

    if(keys.right.pressed && player.position.x < 400){
        player.velocity.x = player.speed
    }
    else if((keys.left.pressed && player.position.x > 100) ||  (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)){
        player.velocity.x = -player.speed
    }
    else {
        player.velocity.x = 0

        if(keys.right.pressed)
        {
            scrollOffset += player.speed
            platforms.forEach((platform) => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed *0.66
            })
        }
        else if(keys.left.pressed && scrollOffset > 0)
        {
            scrollOffset -= player.speed
            platforms.forEach((platform) => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed *0.66
            })
        }
    }

    //Platform Collision
    platforms.forEach((platform) => {
        if(player.position.y + player.height <= platform.position.y && player.position.y +player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width){
            player.velocity.y = 0
        }
        // else if(player.position.y + player.height >= platform.position.y && player.position.y <= platform.position.y + platform.height && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width){
        //     player.velocity.y += 10
        // } 
    })

    //Win case where player reaches the end of the screen (temporarily set at 2000)
    if (scrollOffset >= platformImage.width * 5 + 650-2){
        console.log("Good Job ! You win !")
    }

    //Loose case where player reaches the end of the screen
    if (player.position.y > canvas.height){
        console.log("You loose !")
        init()
    }
}

init()
animate()

addEventListener('keydown', ({ keyCode }) => {
    // console.log(keyCode)
    switch(keyCode){
        case 81:
            console.log('left')
            keys.left.pressed = true
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            break

        case 90:
            console.log('up')
            player.velocity.y -= 25
            break

        case 83:
            console.log('down')
            break
    }
})

addEventListener('keyup', ({ keyCode }) => {
    // console.log(keyCode)
    switch(keyCode){
        case 81:
            console.log('left')
            keys.left.pressed = false
            break

        case 68:
            console.log('right')
            keys.right.pressed = false
            break

        case 90:
            console.log('up')
            break

        case 83:
            console.log('down')
            break
    }
})