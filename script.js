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

// CARTNI CHIZISH
let cart = [];

// Telegram bot configuration
const BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Replace with your bot token
const CHAT_ID = 'YOUR_CHAT_ID';     // Replace with your chat ID

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

// ================= CART FUNCTIONALITY =================
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const customerInfo = document.getElementById('customerInfo');
const orderButtonContainer = document.getElementById('orderButtonContainer');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');

// Add to cart function
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      name,
      price,
      qty: 1,
      image
    });
  }
  
  renderCart();
  updateCartCount();
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
  cartItems.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Savat bo\'sh</p>';
    cartTotal.textContent = '0 so\'m';
    checkoutBtn.disabled = true;
    return;
  }
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
    itemElement.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
        <div>
          <h4 class="font-medium">${item.name}</h4>
          <p class="text-green-600 font-semibold">${item.price.toLocaleString()} so'm</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button class="decrease-item w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full" data-index="${index}">-</button>
        <span class="w-8 text-center">${item.qty}</span>
        <button class="increase-item w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full" data-index="${index}">+</button>
        <button class="remove-item text-red-500 hover:text-red-700" data-index="${index}">
          <i class='bx bx-trash text-xl'></i>
        </button>
      </div>
    `;
    
    cartItems.appendChild(itemElement);
  });
  
  cartTotal.textContent = `${total.toLocaleString()} so'm`;
  checkoutBtn.disabled = false;
  
  // Add event listeners to quantity buttons
  document.querySelectorAll('.decrease-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.closest('button').dataset.index;
      if (cart[index].qty > 1) {
        cart[index].qty--;
        renderCart();
        updateCartCount();
      }
    });
  });
  
  document.querySelectorAll('.increase-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.closest('button').dataset.index;
      cart[index].qty++;
      renderCart();
      updateCartCount();
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.closest('button').dataset.index;
      cart.splice(index, 1);
      renderCart();
      updateCartCount();
    });
  });
}

// Send order to Telegram
async function sendOrderToTelegram() {
  const customerName = document.getElementById('customerName').value.trim();
  const customerPhone = document.getElementById('customerPhone').value.trim();
  const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
  
  // Validate inputs
  if (!customerName || !customerPhone || !deliveryAddress) {
    alert('Iltimos, barcha maydonlarni to\'ldiring!');
    return;
  }
  
  // Format order message
  let message = `🛒 *Yangi buyurtma* 🛒\n\n`;
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.qty * item.price;
    total += itemTotal;
    message += `${index + 1}. *${item.name}* - ${item.qty} x ${item.price.toLocaleString()} so'm = ${itemTotal.toLocaleString()} so'm\n`;
  });
  
  message += `\n💵 *Jami: ${total.toLocaleString()} so'm*`;
  message += `\n\n👤 *Mijoz:* ${customerName}`;
  message += `\n📞 *Telefon:* ${customerPhone}`;
  message += `\n📍 *Manzil:* ${deliveryAddress}`;
  
  try {
    // Show loading state
    const originalText = confirmOrderBtn.innerHTML;
    confirmOrderBtn.disabled = true;
    confirmOrderBtn.innerHTML = '<i class="bx bx-loader-alt animate-spin"></i> Yuborilmoqda...';
    
    // Send to Telegram
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
    
    const data = await response.json();
    
    if (data.ok) {
      // Clear cart and form on success
      cart = [];
      document.getElementById('customerName').value = '';
      document.getElementById('customerPhone').value = '';
      document.getElementById('deliveryAddress').value = '';
      
      // Hide customer info form
      customerInfo.classList.add('hidden');
      orderButtonContainer.classList.remove('hidden');
      
      // Show success message
      alert('Rahmat! Buyurtmangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.');
      
      // Close cart modal
      document.getElementById('cartModal').classList.add('hidden');
      document.body.style.overflow = '';
      
      // Update cart
      renderCart();
      updateCartCount();
    } else {
      throw new Error('Telegram xatolik yubordi');
    }
  } catch (error) {
    console.error('Xatolik:', error);
    alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring yoki telefon orqali bog\'laning.');
  } finally {
    // Reset button state
    confirmOrderBtn.disabled = false;
    confirmOrderBtn.innerHTML = originalText || 'Tasdiqlash';
  }
}

// Event Listeners
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Savat bo\'sh! Iltimos, avval mahsulot qo\'shing.');
      return;
    }
    
    // Show customer info form
    customerInfo.classList.remove('hidden');
    orderButtonContainer.classList.add('hidden');
    
    // Scroll to the form
    customerInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

if (confirmOrderBtn) {
  confirmOrderBtn.addEventListener('click', sendOrderToTelegram);
}

if (cancelOrderBtn) {
  cancelOrderBtn.addEventListener('click', () => {
    // Hide customer info form
    customerInfo.classList.add('hidden');
    orderButtonContainer.classList.remove('hidden');
  });
}

// Close cart modal when clicking outside
const cartModal = document.getElementById('cartModal');
if (cartModal) {
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.add('hidden');
      document.body.style.overflow = '';
      
      // Reset form if open
      customerInfo.classList.add('hidden');
      orderButtonContainer.classList.remove('hidden');
    }
  });
}

// Close cart modal with close button
const closeCartBtn = document.getElementById('closeCart');
if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    cartModal.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Reset form if open
    customerInfo.classList.add('hidden');
    orderButtonContainer.classList.remove('hidden');
  });
}

// Initialize cart buttons on product cards
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const name = card.querySelector('h3').textContent;
      const price = parseInt(card.querySelector('.price').textContent.replace(/\D/g, ''));
      const image = card.querySelector('img').src;
      
      addToCart(name, price, image);
      
      // Show success message
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="bx bx-check"></i> Qo\'shildi';
      button.classList.add('bg-green-500', 'hover:bg-green-600');
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('bg-green-500', 'hover:bg-green-600');
      }, 2000);
    });
  });
  
  // Update cart count on page load
  updateCartCount();
});

// ================= MOBILE MENU =================
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenuButton = mobileMenu.querySelector('button');

  function toggleMenu() {
    mobileMenu.classList.toggle('hidden');
    document.body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
  }

  if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMenu);
  if (closeMenuButton) closeMenuButton.addEventListener('click', toggleMenu);

  // Close menu when clicking outside
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) {
        toggleMenu();
      }
    });
  }
});