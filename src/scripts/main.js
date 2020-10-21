import initialize from './game';
import '../style.scss';
import rellax from 'rellax';
import '../assets/images/game/witch-hat.png';
import '../assets/images/game/pumpkin.png';
import '../assets/images/game/monster.png';
import '../assets/images/game/ghost.png';
import '../assets/images/game/bottle.png';
import '../assets/images/game/black-cat.png';
import '../assets/images/game-background-desktop-2.jpg';



console.log(rellax);
const pumpkinEyes = document.querySelectorAll('#group-pumpkin-eyes path')
const pumpkinEyesMobile = document.querySelectorAll('#mobile-svg #group-pumpkin-eyes path')
const youInvitedButton = document.querySelector('.svg-header__button');
const invitationButton = document.querySelector('.invitation__button');
const pumpkinColors = ['url(#paint6_linear)', 'url(#paint7_linear)', '#E09D37', '#E09D37', 'url(#paint8_radial)', 'url(#paint9_linear)', 'url(#paint10_linear)', '#E09D37', '#E09D37', 'url(#paint11_radial)', 'url(#paint12_radial)', '#E09D37', 'url(#paint13_linear)', 'url(#paint14_linear)']

const pumpkinColorsMobile = ['url(#paint5_linear_m)', 'url(#paint6_linear_m)', '#E09D37', '#E09D37', 'url(#paint7_radial_m)', 'url(#paint8_linear_m)', 'url(#paint9_linear_m)', '#E09D37', '#E09D37', 'url(#paint10_radial_m)', 'url(#paint11_radial_m)', '#E09D37', 'url(#paint12_linear_m)', 'url(#paint13_linear_m)']

const graveRightShadow = document.querySelector('#shadow4')
const graveTallLeftShadow = document.querySelector('#shadow1')
const graveShortLeftShadow = document.querySelector('#shadow2')
const graveCrossShadow = document.querySelector('#shadow3')
const treeShadow = document.querySelector('#tree-shadow')
const witchHouseShadow = document.querySelector('#witch-house2')

const houseWindows = document.querySelectorAll('#House-windows path')

// pumpkin eyes lightning animation

pumpkinEyes.forEach(element => {
  element.setAttribute('fill', '#202020')
})
youInvitedButton.addEventListener('touchstart', function () {
  pumpkinEyesMobile.forEach((element, key) => {
    element.setAttribute('fill', `${pumpkinColorsMobile[key]}`)
  })
})

youInvitedButton.addEventListener('mouseover', function () {
  pumpkinEyes.forEach((element, key) => {
    element.setAttribute('fill', `${pumpkinColors[key]}`)
  })
})
youInvitedButton.addEventListener('mouseout', function () {
  pumpkinEyes.forEach((element) => {
    element.setAttribute('fill', '#202020')
  })
})

youInvitedButton.addEventListener('click', () => {
  location.href = "#";
  location.href = "#acceptance";
})
invitationButton.addEventListener('click', () => {
  location.href = "#";
  location.href = "#acceptance";
})
// house window light-switch animation

const lightSwitchIntervals = [150, 150, 2000, 150]
let lightIsOn = 0
let currentInterval = 0

function switchLights () {
  setTimeout(function () {
    changeWindowColor()
    lightIsOn = (lightIsOn === 0) ? 1 : 0
    currentInterval++
    if (currentInterval === lightSwitchIntervals.length) currentInterval = 0
    switchLights()
  }, lightSwitchIntervals[currentInterval])
}

function changeWindowColor () {
  for (let count = 0; count < houseWindows.length; count++) {
    if (lightIsOn === 0) houseWindows[count].setAttribute('fill', 'yellow')
    else houseWindows[count].setAttribute('fill', 'url(#paint1_linear)')
  }
}

switchLights()

// shadows stretching animation

window.addEventListener('scroll', function () {
  const scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight)
  const scaleValue = `scale(1, ${1 - (scrollPercentage * 2)})`
  graveRightShadow.style.transform = scaleValue
  graveTallLeftShadow.style.transform = scaleValue
  graveCrossShadow.style.transform = scaleValue
  graveCrossShadow.style.transform = scaleValue
  treeShadow.style.transform = scaleValue
  witchHouseShadow.style.transform = scaleValue
})

// slider
let chooseButton, firstItem, secondItem, currentElement, sliderChecks, lastMoveDrag

document.querySelector('.slider').ontouchmove = function (e) {
  lastMoveDrag = e
}
const multiItemSlider = (function () {
  return function (selector) {
    const
      mainElement = document.querySelector(selector)
    const sliderWrapper = mainElement.querySelector('.slider')
    const sliderItems = mainElement.querySelectorAll('.js-slider__item')
    const sliderControls = mainElement.querySelectorAll('.check-container')

    const wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width)
    const itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width)
    let positionLeftItem = 3
    let transform = -300
    const step = itemWidth / wrapperWidth * 100

    const items = []

    const getCurrentDomElements = () => {
      currentElement = sliderItems[positionLeftItem]
      firstItem = currentElement.querySelector('.slider__item__card--left')
      secondItem = currentElement.querySelector('.slider__item__card--right')
      chooseButton = currentElement.querySelector('.choose')
      sliderChecks = currentElement.querySelectorAll('.check')
      chooseButton.onmousedown = dragAndDrop
      chooseButton.ontouchstart = dragAndDrop
      chooseButton.ondragstart = function () {
        return false
      }

      sliderChecks.forEach(el => {
        el.removeEventListener('touchstart', mobileToggle)
        el.addEventListener('touchstart', (e) => {
          chooseDroppable(e.target, 'mobile')
        })
      })

      currentElement.querySelectorAll('.slider__item__card').forEach(el => {
        el.addEventListener('touchstart', mobileToggle)
      })
    }

    getCurrentDomElements()

    sliderItems.forEach(function (item, index) {
      items.push({ item: item, position: index, transform: 0 })
    })

    const position = {
      getMin: 0,
      getMax: items.length - 1
    }

    const transformItem = function (direction) {
      if (direction === 'right') {
        if ((positionLeftItem + wrapperWidth / itemWidth - 1) >= position.getMax) {
          return
        }
        positionLeftItem++
        transform -= step
      }
      if (direction === 'left') {
        if (positionLeftItem <= position.getMin) {
          return
        }
        positionLeftItem--
        transform += step
      }
      sliderWrapper.style.transform = 'translateX(' + transform + '%)'
      getCurrentDomElements()
    }

    return {
      right: function () {
        transformItem('right')
      },
      left: function () {
        transformItem('left')
      }
    }
  }
}())

const slider = multiItemSlider('.js-slider')

// Drag-and-drop button on slider

function dragAndDrop (event) {
  let currentDroppable = null;
  const target = event.target.closest('.js-slider__item');
  const targetCoords = target.getBoundingClientRect();

  moveAt(event.clientX || event.touches[0].clientX, event.clientY || event.touches[0].clientY)

  function moveAt (pageX, pageY) {
    chooseButton.style.bottom = 'auto'
    chooseButton.style.left = pageX - targetCoords.left - chooseButton.offsetWidth / 2 + 'px'
    chooseButton.style.top = pageY - targetCoords.top - chooseButton.offsetHeight / 2 + 'px'
  }

  function onMouseMove (event) {
    moveAt(event.clientX || event.touches[0].clientX, event.clientY || event.touches[0].clientY)
    chooseButton.hidden = true
    const elemBelow = document.elementFromPoint(event.clientX || event.touches[0].clientX, event.clientY || event.touches[0].clientY)
    chooseButton.hidden = false

    if (elemBelow == document.body) {
      onMouseUp(event)
    };

    const droppableBelow = elemBelow.closest('.droppable')

    if (currentDroppable != droppableBelow) {
      if (currentDroppable) {
        leaveDroppable(currentDroppable)
      }
      currentDroppable = droppableBelow
      if (currentDroppable) {
        enterDroppable(currentDroppable)
      }
    }
  }

  function onMouseUp (event) {
    chooseButton.hidden = true
    const elemBelow = document.elementFromPoint(event.clientX || lastMoveDrag.touches[0].clientX, event.clientY || lastMoveDrag.touches[0].clientY)
    chooseButton.hidden = false

    chooseDroppable(elemBelow)

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('touchmove', onMouseMove)
  }

  document.addEventListener('mousemove', onMouseMove)
  chooseButton.addEventListener('mouseup', onMouseUp)
}

function defineDroppable (elem) {
  if (elem.id === 'left-check') {
    return [firstItem, secondItem, currentElement.querySelector('#left-check')]
  } else if (elem.id === 'right-check') {
    return [secondItem, firstItem, currentElement.querySelector('#right-check')]
  } else {

  }
}
function defineDroppableMobile (elem) {
  if (elem.classList.contains('slider__item__card--left')) {
    return [firstItem, secondItem, currentElement.querySelector('#left-check')]
  } else if (elem.classList.contains('slider__item__card--right')) {
    return [secondItem, firstItem, currentElement.querySelector('#right-check')]
  }
}

function chooseDroppable (elem, type) {
  if (defineDroppable(elem) || (defineDroppableMobile(elem) && type === 'mobile')) {
    if (defineDroppable(elem)) {
      [chosenElement, otherElement, checkElement] = defineDroppable(elem)
    } else if (defineDroppableMobile(elem) && type === 'mobile') {
      [chosenElement, otherElement, checkElement] = defineDroppableMobile(elem)
    }
    const food = chosenElement.querySelector('.slider__item__card__picture').id

    firebasePushMenu(food)
    if (checkElement.id === 'right-check') chosenElement.parentElement.style.justifyContent = 'flex-end'
    otherElement.style.display = 'none'
    chosenElement.style.width = '100%'
    if (!checkElement.classList.contains('check-active')) checkElement.classList.add('check-active')

    chosenElement.querySelector('.slider__item__card__title').classList.add('item-title_active')
    chosenElement.querySelector('.slider__item__card__picture').classList.add('item-picture_active')
    chosenElement.parentElement.querySelector('.slider__item__nav').style.display = 'none'
    chosenElement.parentElement.querySelector('.check--selected').style.opacity = 1
    setTimeout(() => {
      slider.left()
    }, 2000)
  } else {
    chooseButton.onmouseup = null
    chooseButton.style.top = 'auto'
    chooseButton.style.left = 'auto'
    chooseButton.style.bottom = '10%'
  }
}

function enterDroppable (elem, type) {
  if (type === 'mobile') {
    [chosenElement, otherElement, checkElement] = defineDroppableMobile(elem)
  } else {
    [chosenElement, otherElement, checkElement] = defineDroppable(elem)
  }
  checkElement.classList.add('check-active')
  chosenElement.style.width = '60%'
  otherElement.style.width = '40%'
}

function leaveDroppable (elem, type) {
  if (type === 'mobile') {
    [chosenElement, otherElement, checkElement] = defineDroppableMobile(elem)
  } else {
    [chosenElement, otherElement, checkElement] = defineDroppable(elem)
  }
  chosenElement.style.width = '50%'
  otherElement.style.width = '50%'
  sliderChecks.forEach(el => {
    el.classList.remove('check-active')
  })
}

function mobileToggle (e) {
  leaveDroppable(e.target, 'mobile')
  enterDroppable(e.target, 'mobile')
}

// stars
const stars = () => {
  const count = 500
  const scene = document.querySelector('.main')
  const topOffset = document.querySelector('.svg-header').offsetHeight  
  let i = 0
  while (i < count) {
    const star = document.createElement('i')
    const x = Math.floor(Math.random() * window.innerWidth)
    const y = Math.floor(Math.random() * (scene.offsetHeight))   
    const duration = Math.random() * 10
    const size = Math.random() * 2

    star.style.left = x + 'px'
    star.style.top = y + 'px'
    star.style.width = 1 + size + 'px'
    star.style.height = 1 + size + 'px'
    star.style.animationDuration = 5 + duration + 's'
    star.style.animationDelay = 5 + duration + 's'
    scene.appendChild(star)
    i++
  }
}

stars()

// hidden invitation text
const hiddenInfo = document.querySelectorAll('.invitation__info__item')

const light1 = document.querySelectorAll('#light')[0]
const light2 = document.querySelectorAll('#light')[1]

function update (e) {
  e.preventDefault()
  const x = e.offsetX || e.touches[0].pageX - (e.target.getBoundingClientRect().left + window.scrollX)
  const y = e.offsetY || e.touches[0].pageY - (e.target.getBoundingClientRect().top + window.scrollY)

  if (e.target === light1 || e.target === light2) {
    e.target.style.setProperty('--cursorX', x + 'px')
    e.target.style.setProperty('--cursorY', y + 'px')
  }
}

// mobile

hiddenInfo.forEach(el => {
  el.addEventListener('touchstart', e => {
    el.addEventListener('touchmove', update)
  })

  el.addEventListener('touchend', e => {
    el.removeEventListener('touchmove', update)
  })
})

// desktop

hiddenInfo.forEach(el => {
  el.addEventListener('mouseover', e => {
    el.addEventListener('mousemove', update)
  })

  el.addEventListener('mouseout', e => {
    el.removeEventListener('mousemove', update)
  })
})

// push on form submit
const form = document.querySelector('form')
const firstname = form.querySelector('#firstname')
const surname = form.querySelector('#surname')
const message = form.querySelector('#message')
const span = document.querySelector(".close");
const modal = document.querySelector(".modal");
console.log(span);
if (form) {
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if(firstname.value === '' && surname.value === ''){
      firstname.classList.add('input--error');
      surname.classList.add('input--error');
      console.log('Незаполнено')
    }else if(firstname.value === ''){
      firstname.classList.add('input--error');
    }else if(surname.value === ''){
      surname.classList.add('input--error');
    }else{
      firebasePushGuestData(firstname.value, surname.value, message.value);
      firstname.value = '';
      surname.value = '';
      message.value = '';
      modal.style.display = "block";
      firstname.classList.remove('input--error');
      surname.classList.remove('input--error');
    }

  })
  span.addEventListener('click', function (evt) {
    console.log('click');
    modal.style.display = "none";
  })
  window.onclick = function(event) {
    console.log(event.target);
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
}

/*span.onclick = function() {
  console.log('click');
  modal.style.display = "none";
}*/
// will need to call a method to load playlist on page load


document.getElementById('canvas-button').addEventListener('click', (event) => {
  initialize();
})