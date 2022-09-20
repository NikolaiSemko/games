const canvas = document.querySelector('canvas')
//create a 2d game
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')
//the game will take the whole page
canvas.width = innerWidth
canvas.height = innerHeight

//create boundary class
class Boundary {
  static width = 40
  static height = 40
  constructor({ position, image }) {
    this.position = position
    this.width = 40
    this.height = 40
    this.image = image
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

//create player class
class Player {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.radians = 0.75
    this.openRate = 0.12
    this.rotation = 0
  }

  draw() {
    c.save()
    c.translate(this.position.x, this.position.y)
    c.rotate(this.rotation)
    c.translate(-this.position.x, -this.position.y)
    c.beginPath()
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    )
    // Canvas lineTo: begin a path of our player
    c.lineTo(this.position.x, this.position.y)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
   //mouth
    if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate

    this.radians += this.openRate
  }
}

//create ghost class
class Ghost {
  static speed = 1
  constructor({ position, velocity, color = 'red' }) {
    this.position = position
    this.velocity = velocity
    this.radius = 12
    this.color = color
     // store the previous collision in order to see if there are more directions for the ghosts
    this.prevCollisions = []
    this.speed = 1
    this.scared = false
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.scared ? 'blue' : this.color
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

//create regular pellets
class Pellet {
  constructor({ position }) {
    this.position = position
    this.radius = 3
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'white'
    c.fill()
    c.closePath()
  }
}
// create a special pellet to allow pacman eat ghost
class PowerUp {
  constructor({ position }) {
    this.position = position
    this.radius = 7
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
  }
}

const pellets = []
const boundaries = []
const powerUps = []
const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    }
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 5 + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    color: 'green'
  })
]

const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2
  },
  velocity: {
    x: 0,
    y: 0
  }
})

//set the default value for the keys
const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

let lastKey = ''
let score = 0


const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]


function createImage(src) {
  const image = new Image()
  image.src = src
  return image
}
//loop the function inorder to fill the map with the proper image
map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./Images/pipeHorizontal.png')
          })
        )
        break
      case '|':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./Images/pipeVertical.png')
          })
        )
        break
      case '1':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./Images/pipeCorner1.png')
          })
        )
        break
      case '2':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./Images/pipeCorner2.png')
          })
        )
        break
      case '3':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./Images/pipeCorner3.png')
          })
        )
        break
      case '4':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./Images/pipeCorner4.png')
          })
        )
        break
      case 'b':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./Images/block.png')
          })
        )
        break
      case '[':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./Images/capLeft.png')
          })
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./Images/capRight.png')
          })
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./Images/capBottom.png')
          })
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./Images/capTop.png')
          })
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./Images/pipeCross.png')
          })
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./Images/pipeConnectorTop.png')
          })
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./Images/pipeConnectorBottom.png')
          })
        )
        break
      case '.':
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break

      case 'p':
        powerUps.push(
          new PowerUp({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break
    }
  })
})

//find out if a circle: could be player or ghosts is collide with the boundary
function circleCollidesWithRectangle({ circle, rectangle }) {
  const padding = Boundary.width / 2 - circle.radius - 1
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width + padding
  )
}

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  //define how to go up, left, down, and right
  //only allow user to move untill they collide the boundary
  if (keys.w.pressed && lastKey === 'w') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: -5
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = -5
      }
    }
  } else if (keys.a.pressed && lastKey === 'a') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: -5,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = -5
      }
    }
  } else if (keys.s.pressed && lastKey === 's') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: 5
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = 5
      }
    }
  } else if (keys.d.pressed && lastKey === 'd') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: 5,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = 5
      }
    }
  }

  // detect collision between ghosts and player
  for (let i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i]
    // ghost touches player
    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1)
      } else {
        cancelAnimationFrame(animationId);
        function popup(){
          this.setTimeout(
              function open(event){
                  document.querySelector(".popup").style.display = "block";
              },
              200
          )
      }
      popup();
      
      document.getElementById("close").addEventListener
      ("click", function(){
              document.querySelector(".popup").style.display = "none";
      });
      }
    }
  }

  // win condition goes here
  if (pellets.length === 0) {
    alert('You Win!')
    cancelAnimationFrame(animationId)
  }

  // loop over the powerup pellet
  for (let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i]
    powerUp.draw()

    // player could collide the ghosts and eat it with the powerup pellet
    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      powerUps.splice(i, 1)

      // make ghosts scared: allow the user to eat the ghost
      ghosts.forEach((ghost) => {
        ghost.scared = true

        setTimeout(() => {
          ghost.scared = false
        }, 5000)
      })
    }
  }

  //Gain 10 points if player touch each small pellets
  for (let i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i]
    pellet.draw()
     //when the user is collide with pellets
    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      pellets.splice(i, 1)
      score += 10
      scoreEl.innerHTML = score
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw()

    if (
      circleCollidesWithRectangle({
        circle: player,
        rectangle: boundary
      })
    ) {
      player.velocity.x = 0
      player.velocity.y = 0
    }
  })
  player.update()

  ghosts.forEach((ghost) => {
    ghost.update()

    const collisions = []
    //Find if ghosts collide boundary
    boundaries.forEach((boundary) => {
      if (
        !collisions.includes('right') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('right')
      }

      if (
        !collisions.includes('left') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('left')
      }

      if (
        !collisions.includes('up') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed
            }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('up')
      }

      if (
        !collisions.includes('down') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed
            }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('down')
      }
    })

    if (collisions.length > ghost.prevCollisions.length)
      ghost.prevCollisions = collisions
    //convert them to strings which allows to compare
    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
    //Show the map changes since the number of collisions are different
      if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
      else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
      else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
      else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')


      const pathways = ghost.prevCollisions.filter((collision) => {
        return !collisions.includes(collision)
      })
      // floor the number that only integer will be used to move the ghosts
      const direction = pathways[Math.floor(Math.random() * pathways.length)]
      //change the ghosts' directions reandomly to up, down, righr, and left
      switch (direction) {
        case 'down':
          ghost.velocity.y = ghost.speed
          ghost.velocity.x = 0
          break

        case 'up':
          ghost.velocity.y = -ghost.speed
          ghost.velocity.x = 0
          break

        case 'right':
          ghost.velocity.y = 0
          ghost.velocity.x = ghost.speed
          break

        case 'left':
          ghost.velocity.y = 0
          ghost.velocity.x = -ghost.speed
          break
      }

      ghost.prevCollisions = []
    }
  })
  // rotate the player when the user change the direction
  //no need to rotate if the player is moving to the right
  if (player.velocity.x > 0) player.rotation = 0
  else if (player.velocity.x < 0) player.rotation = Math.PI
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
} // animate() end here

animate()

//see if the player press the key
addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})
// see if the player left the key
addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'w':
      keys.w.pressed = false

      break
    case 'a':
      keys.a.pressed = false

      break
    case 's':
      keys.s.pressed = false

      break
    case 'd':
      keys.d.pressed = false

      break
  }
})