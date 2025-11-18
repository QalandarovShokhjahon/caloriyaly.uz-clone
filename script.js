// Slider
let sliderEl = document.querySelector("#slider")
let count = 0
let intervalId

let moveSlider = () => {
  count++
  if (count > 2) {
    count = 0
  }
  sliderEl.style.cssText = `
    transform: translateX(-${count * 100}%);
  `
}

let startSlider = () => {
  intervalId = setInterval(moveSlider, 7000)
}

let stopSlider = () => {
  clearInterval(intervalId)
}

sliderEl.addEventListener('mouseenter', stopSlider)
sliderEl.addEventListener('mouseleave', startSlider)

startSlider()