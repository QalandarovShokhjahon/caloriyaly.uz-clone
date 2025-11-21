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


// ================= CART FUNCTIONALITY =================
let cart = [];
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const customerInfo = document.getElementById('customerInfo');
const orderButtonContainer = document.getElementById('orderButtonContainer');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');
const cartModal = document.getElementById('cartModal');
const cartButton = document.querySelector('.relative');

// Add to cart function
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: Date.now(),
      name,
      price: Number(price),
      qty: 1,
      img: image
    });
  }
  
  renderCart();
  updateCartCount();
  
  // Show success message
  const successMsg = document.createElement('div');
  successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
  successMsg.textContent = `${name} savatga qo'shildi!`;
  document.body.appendChild(successMsg);
  
  setTimeout(() => {
    successMsg.remove();
  }, 2000);
}

// Update cart count in the header
function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);
  
  if (cartCount) {
    if (totalItems > 0) {
      cartCount.textContent = totalItems;
      cartCount.classList.remove('hidden');
    } else {
      cartCount.classList.add('hidden');
    }
  }
}

// Render cart items
function renderCart() {
  if (!cartItems) return;
  
  cartItems.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Savat bo\'sh</p>';
    if (cartTotal) cartTotal.textContent = '0 so\'m';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2';
    itemElement.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${item.img}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
        <div>
          <h4 class="font-medium">${item.name}</h4>
          <p class="text-green-600 font-semibold">${item.price.toLocaleString()} so'm</p>
          <div class="flex items-center mt-1">
            <button class="dec w-6 h-6 flex items-center justify-center bg-gray-200 rounded-l" data-id="${item.id}">-</button>
            <span class="w-8 text-center bg-white h-6 flex items-center justify-center">${item.qty}</span>
            <button class="inc w-6 h-6 flex items-center justify-center bg-gray-200 rounded-r" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
      <button class="delete text-red-500 hover:text-red-700" data-id="${item.id}">
        <i class='bx bx-trash text-xl'></i>
      </button>
    `;
    
    cartItems.appendChild(itemElement);
  });
  
  if (cartTotal) cartTotal.textContent = `${total.toLocaleString()} so'm`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const card = e.target.closest('.add-to-cart');
      const name = card.getAttribute('data-name');
      const price = card.getAttribute('data-price');
      const img = card.getAttribute('data-img');
      
      addToCart(name, price, img);
    });
  });
  
  // Cart button click handler
  if (cartButton) {
    cartButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (cartModal) {
        cartModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  }
  
  // Close modal when clicking outside
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    });
  }
  
    // Close button
  const closeCartBtn = document.querySelector('.close-cart');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      if (cartModal) {
        cartModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Telegram bot configuration
  const TELEGRAM_BOT_TOKEN = '8123001382:AAE_ODHez3xdoMyE0Oi8Axs7ItZASD8hhFQ'; // O'z bot tokenizni qo'ying
  const TELEGRAM_CHAT_ID = '5522089798'; // O'z chat ID ingizni qo'ying

  // Buyurtmani yuborish funksiyasi
  async function sendOrderToTelegram() {
    if (cart.length === 0) {
      alert('Savat bo\'sh! Iltimos, avval mahsulot qo\'shing.');
      return;
    }

    // Mijoz ma'lumotlari
    const customerName = prompt('Ismingizni kiriting:');
    if (!customerName) return;
    
    const customerPhone = prompt('Telefon raqamingizni kiriting:');
    if (!customerPhone) return;
    
    const deliveryAddress = prompt('Yetkazib berish manzilini kiriting:');
    if (!deliveryAddress) return;

    // Buyurtma matnini tayyorlash
    let orderText = `🛒 *Yangi buyurtma*\n\n`;
    orderText += `👤 *Mijoz:* ${customerName}\n`;
    orderText += `📞 *Telefon:* ${customerPhone}\n`;
    orderText += `📍 *Manzil:* ${deliveryAddress}\n\n`;
    orderText += `📋 *Buyurtma tafsilotlari:*\n\n`;

    let total = 0;
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      orderText += `${index + 1}. ${item.name} - ${item.qty} x ${item.price.toLocaleString()} = ${itemTotal.toLocaleString()} so'm\n`;
    });

    orderText += `\n💵 *Jami summa:* ${total.toLocaleString()} so'm`;

    try {
      // Telegramga yuborish
      const response = await fetch(`https://api.telegram.org/bot${8123001382}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: 5522089798,
          text: orderText,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();
      
      if (data.ok) {
        alert('Buyurtmangiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.');
        // Savatni tozalash
        cart = [];
        renderCart();
        updateCartCount();
        if (cartModal) {
          cartModal.classList.add('hidden');
          document.body.style.overflow = 'auto';
        }
      } else {
        throw new Error('Telegram xatolik yubordi');
      }
    } catch (error) {
      console.error('Xatolik:', error);
      alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring yoki telefon orqali bog\'laning.');
    }
  }
  
  // Buyurtma tugmasi uchun hodisalar
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', sendOrderToTelegram);
  }

  // Handle cart item quantity changes
  document.addEventListener('click', function(e) {
    // Delete item
    if (e.target.classList.contains('delete') || e.target.closest('.delete')) {
      const itemId = parseInt(e.target.closest('button').getAttribute('data-id') || 
                           e.target.closest('.delete').getAttribute('data-id'));
      cart = cart.filter(item => item.id !== itemId);
      renderCart();
      updateCartCount();
    }
    
    // Decrease quantity
    if (e.target.classList.contains('dec') || e.target.closest('.dec')) {
      const itemId = parseInt(e.target.closest('button').getAttribute('data-id') || 
                           e.target.closest('.dec').getAttribute('data-id'));
      const item = cart.find(item => item.id === itemId);
      if (item && item.qty > 1) {
        item.qty--;
        renderCart();
        updateCartCount();
      }
    }
    
    // Increase quantity
    if (e.target.classList.contains('inc') || e.target.closest('.inc')) {
      const itemId = parseInt(e.target.closest('button').getAttribute('data-id') || 
                           e.target.closest('.inc').getAttribute('data-id'));
      const item = cart.find(item => item.id === itemId);
      if (item) {
        item.qty++;
        renderCart();
        updateCartCount();
      }
    }
  });
  
  // Initial render
  renderCart();
  updateCartCount();
});