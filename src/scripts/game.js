let ctx; const balls = []; let moves = []
let timer
const imageList = [cat, pumpkin, monster, poison, hat, ghost]
let mouseDownX, mouseDownY
const startBtn = document.getElementById('canvas-button')
let moveCount = 0
let score = 0
let isGameOver = false
let gameSizeX = 10
let gameSizeY = 10
let lastMove = null
let cellSize = 60

function getRandomNum (n) {
  return Math.floor(Math.random() * n)
}

function Ball (x, y) {
  this.x1 = x
  this.y1 = y
  this.x2 = x
  this.y2 = y
  this.gapCount = 0

  this.moveBall = function (x2, y2, color) {
    this.x2 = x2
    this.y2 = y2
    this.color = color
    this.moving = true
    this.gapCount = 25
    moves.push(this)
  }
  this.update = function () {
    this.gapCount--
    if (this.gapCount <= 0) {
      this.moving = false
    }
  }
  this.getY = function () {
    return (this.y1 + (this.y2 - this.y1) * (this.gapCount) / 25) * cellSize + 100
  }
}

function initialize () {
  isGameOver = false
  startBtn.style.display = 'none'
  moveCount = 3
  score = 0
  for (let x = 0; x < gameSizeX; x++) {
    balls[x] = []
    for (let y = 0; y < gameSizeY; y++) {
      balls[x][y] = new Ball(x, y)
    }
  }

  for (let x = 0; x < gameSizeX; x++) {
    for (let y = 0; y < gameSizeY; y++) {
      while (true) {
        const colorNum = getRandomNum(6)
        if (checkColor(x, y, colorNum)) {
          balls[x][y].color = colorNum
          break
        }
      }
    }
  }
  const canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  canvas.onmousedown = myMouseDown
  canvas.ontouchstart = myMouseDown
  canvas.ontouchmove = function (e) {
    lastMove = e
  }
  canvas.onmouseup = myMouseUp
  canvas.ontouchend = myMouseUp
  // timer = setInterval(checkBallStatus, 25);
  paint()
  checkBallStatus()
}

function checkBallStatus () {
  window.requestAnimationFrame(checkBallStatus)
  if (moves.length > 0) {
    for (let i = 0; i < moves.length; i++) {
      moves[i].update()
    }
    moves = moves.filter(ball => ball.gapCount != 0)
    if (moves.length === 0) {
      setRemoveFlag()
      fall()
    }
    paint()
  }

  if (moves.length === 0 && moveCount === 0 && !isGameOver) {
    setTimeout(()=>{
      gameOver();
    }, 500)
  }
}
function gameOver () {
  canvas.onmousedown = null;
  canvas.ontouchstart = null;
  canvas.onmouseup = null;
  canvas.ontouchend = null;
  if (window.innerWidth < 599) {
    canvas.style.background = 'url(./img/game-background-mobile.jpg) no-repeat'
  } else {
    canvas.style.background = 'url(./img/game-background-desktop-2.jpg) no-repeat'
  }
  canvas.style.backgroundSize = 'cover'
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  startBtn.style.display = 'inline'
  ctx.font = 'bold 30px Open Sans'
  if (window.innerWidth < 599) {
    ctx.fillText(`Score : ${score}`, cellSize * (gameSizeX / 2), 250)
  } else {
    ctx.fillText(`Score : ${score}`, 300, 250)
  }

  isGameOver = true
}

function setRemoveFlag () {
  for (let x = 0; x < gameSizeX; x++) {
    let c0 = balls[x][0].color
    let count = 1
    for (let y = 1; y < gameSizeY; y++) {
      const c1 = balls[x][y].color
      if (c0 == c1) {
        count++
        if (count >= 3) {
          balls[x][y - 2].remove = true
          balls[x][y - 1].remove = true
          balls[x][y].remove = true
        }
      } else {
        c0 = c1
        count = 1
      }
    }
  }
  for (let y = 0; y < gameSizeY; y++) {
    let c0 = balls[0][y].color
    let count = 1
    for (let x = 1; x < gameSizeX; x++) {
      const c1 = balls[x][y].color
      if (c0 === c1) {
        count++
        if (count >= 3) {
          balls[x - 2][y].remove = true
          balls[x - 1][y].remove = true
          balls[x][y].remove = true
        }
      } else {
        c0 = c1
        count = 1
      }
    }
  }
}

function fall () {
  for (let x = 0; x < gameSizeX; x++) {
    for (let y = (gameSizeY - 1), z = (gameSizeY - 1); y >= 0; y--, z--) {
      while (z >= 0) {
        if (balls[x][z].remove) {
          z--
        } else {
          break
        }
      }
      if (y != z) {
        const colorNum = (z >= 0) ? balls[x][z].color : getRandomNum(6)
        balls[x][y].moveBall(x, z, colorNum)
      }
    }
  }

  // update remove flag
  for (let x = 0; x < gameSizeX; x++) {
    for (let y = 0; y < gameSizeY; y++) {
      if (balls[x][y].remove) {
        balls[x][y].remove = false
        score += 100
      }
    }
  }
}

function checkColor (x, y, c) {
  const flag = true

  if (x > 1) {
    const c0 = balls[x - 2][y].color
    const c1 = balls[x - 1][y].color

    if (c0 === c1 && c1 === c) {
      return false
    }
  }

  if (y > 1) {
    const c0 = balls[x][y - 2].color
    const c1 = balls[x][y - 1].color
    if (c0 === c1 && c1 === c) {
      return false
    }
  }
  return flag
}

function paint () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let x = 0; x < gameSizeX; x++) {
    for (let y = 0; y < gameSizeY; y++) {
      ctx.drawImage(imageList[balls[x][y].color], x * cellSize, balls[x][y].getY(), cellSize, cellSize)
    }
  }
  ctx.font = 'bold 20px Open Sans'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  if (window.innerWidth < 599) {
    ctx.fillText(`Moves Left : ${moveCount}`, 100, 50)
    ctx.fillText(`Score: ${score}`, 240, 50)
  } else {
    ctx.fillText(`Moves Left : ${moveCount}`, 150, 50)
    ctx.fillText(`Score: ${score}`, 450, 50)
  }
}

function myMouseDown (e) {
  e.preventDefault()
  lastMove = e
  mouseDownX = e.offsetX || lastMove.touches[0].pageX - (lastMove.target.getBoundingClientRect().left + window.scrollX)
  mouseDownY = e.offsetY || lastMove.touches[0].pageY - (lastMove.target.getBoundingClientRect().top + window.scrollY)
}

function myMouseUp (e) {
  e.preventDefault()
  const ballX1 = Math.floor(mouseDownX / cellSize)
  const ballY1 = Math.floor((mouseDownY - 100) / cellSize)
  let ballX2 = ballX1
  let ballY2 = ballY1
  const mouseUpX = e.offsetX || lastMove.touches[0].pageX - (lastMove.target.getBoundingClientRect().left + window.scrollX)
  const mouseUpY = e.offsetY || lastMove.touches[0].pageY - (lastMove.target.getBoundingClientRect().top + window.scrollY)

  if (Math.abs(mouseUpX - mouseDownX) == 0 && Math.abs(mouseUpY - mouseDownY) === 0) {
    return
  } else if (Math.abs(mouseUpX - mouseDownX) > Math.abs(mouseUpY - mouseDownY)) {
    ballX2 += (mouseUpX - mouseDownX > 0) ? 1 : -1
  } else {
    ballY2 += (mouseUpY - mouseDownY > 0) ? 1 : -1
  }

  if (balls[ballX1][ballY1].moving || balls[ballX2][ballY2].moving || timer === null) {
    return
  }

  const icon = balls[ballX1][ballY1].color
  balls[ballX1][ballY1].moveBall(ballX2, ballY2, balls[ballX2][ballY2].color)
  balls[ballX2][ballY2].moveBall(ballX1, ballY1, icon)

  moveCount--

  paint()
}

document.addEventListener('DOMContentLoaded', event => {
  if (window.innerWidth < 599) {
    canvas.style.background = 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(./img/game-background-mobile.jpg) no-repeat cover'
    gameSizeX = 6
    gameSizeY = 10
    canvas.width = window.innerWidth * 0.8
    cellSize = canvas.width / gameSizeX
    canvas.height = cellSize * gameSizeY + 100
  }else{
    canvas.style.background = 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(./img/game-background-desktop-2.jpg) no-repeat'
  }
})
module.exports = initialize;