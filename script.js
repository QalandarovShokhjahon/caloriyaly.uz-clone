// ================= SLIDER =================
let sliderEl = document.querySelector("#slider")
let count = 0
let intervalId

let moveSlider = () => {
  count++
  if (count > 2) count = 0
  sliderEl.style.cssText = `transform: translateX(-${count * 100}%);`
}

let startSlider = () => intervalId = setInterval(moveSlider, 6000)
let stopSlider = () => clearInterval(intervalId)

sliderEl.addEventListener("mouseenter", stopSlider)
sliderEl.addEventListener("mouseleave", startSlider)
startSlider()

// ================= TABS =================
let tabButtons = document.querySelectorAll("#locationTabs button")
let tabContents = document.querySelectorAll("#tabContainer > div")

let hideTabContent = () => {
  tabContents.forEach(c => c.classList.add("hidden", "opacity-0", "translate-y-4"))
  tabButtons.forEach(b => {
    b.classList.remove("bg-lime-500", "text-white")
    b.classList.add("text-lime-500")
  })
}
hideTabContent()

let showTabContent = (i) => {
  tabContents[i].classList.remove("hidden")
  setTimeout(() => tabContents[i].classList.remove("opacity-0", "translate-y-4"), 100)
  tabButtons[i].classList.add("bg-lime-500", "text-white")
}
showTabContent(0)

tabButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    hideTabContent()
    showTabContent(index)
  })
})

// ================= CART =================
const cartBtn = document.querySelector(".bx-cart")
const cartModal = document.getElementById("cartModal")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const closeCart = document.getElementById("closeCart")
const checkoutBtn = document.getElementById("checkoutBtn")

let cart = []

// Savatchani ochish / yopish
cartBtn.addEventListener("click", () => cartModal.classList.remove("hidden"))
cartModal.addEventListener("click", e => { if (e.target === cartModal) cartModal.classList.add("hidden") })
closeCart.addEventListener("click", () => cartModal.classList.add("hidden"))

// SAVATGA QO‘SHISH
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = {
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      img: btn.dataset.img,
      id: Date.now(),
      qty: 1,
    }
    cart.push(product)
    renderCart()
  })
})

// CARTNI CHIZISH
function renderCart() {
  cartItems.innerHTML = ""
  let total = 0

  cart.forEach(item => {
    total += item.price * item.qty
    cartItems.innerHTML += `
      <div class="flex items-center justify-between border p-3 rounded-lg">
        <img src="${item.img}" class="h-16 w-16 rounded-lg object-cover" />
        <div class="flex-1 ml-3">
          <h3 class="font-bold text-green-700">${item.name}</h3>
          <p class="text-green-600">${item.price.toLocaleString()} so'm</p>
          <div class="flex items-center gap-2 mt-2">
            <button class="dec px-2 bg-lime-500 text-white rounded" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="inc px-2 bg-lime-500 text-white rounded" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="delete text-red-600 text-xl font-bold" data-id="${item.id}">&times;</button>
      </div>
    `
  })

  cartTotal.textContent = total.toLocaleString()
  handleCartButtons()
}

// + / - / delete tugmalari
function handleCartButtons() {
  document.querySelectorAll(".inc").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id
      cart = cart.map(item => item.id == id ? { ...item, qty: item.qty + 1 } : item)
      renderCart()
    })
  })

  document.querySelectorAll(".dec").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id
      cart = cart.map(item => item.id == id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item)
      renderCart()
    })
  })

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id
      cart = cart.filter(item => item.id != id)
      renderCart()
    })
  })
}

// ================= TELEGRAM BUYURTMA =================
async function sendOrderToTelegram() {
  if (cart.length === 0) { alert("Savatcha bo‘sh!"); return }

  let message = "🛒 Yangi buyurtma:\n\n"
  cart.forEach(item => {
    message += `🍽 *${item.name}*\nNarxi: ${item.price.toLocaleString()} so'm\nSoni: ${item.qty} ta\nJami: ${(item.price * item.qty).toLocaleString()} so'm\n\n`
  })
  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  message += `💰 *Umumiy summa:* ${total.toLocaleString()} so'm\n`

  const TOKEN = "8259823735:AAHePw8A5rIO4a7OXLiEfRQ2vY6iLHHSnaw"
  const CHAT_ID = "5414733748"
  const URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`

  try {
    await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" })
    })
    alert("Buyurtma yuborildi! ✔")
    cart = []
    renderCart()
    cartModal.classList.add("hidden")
  } catch (error) {
    alert("Xatolik yuz berdi! Internetni tekshiring.")
  }
}

checkoutBtn.addEventListener("click", sendOrderToTelegram)
