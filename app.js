//==============================
// MENU HAMBURGUESA
//==============================

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


//==============================
// CARRITO SIDEBAR
//==============================

const cart = document.getElementById("cart");
const cartBtn = document.getElementById("cart-btn");
const closeCart = document.getElementById("close-cart");

cartBtn.addEventListener("click", () => {
    cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
    cart.classList.remove("active");
});


//==============================
// MODAL CONTACTO
//==============================

const modal = document.getElementById("contact-modal");
const contactBtn = document.getElementById("contact-button");
const closeModal = document.querySelector(".close-modal");

contactBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
});

// cerrar clic fuera del modal
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});


//==============================
// BACK TO TOP
//==============================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTop.style.display = "flex";
    } else {
        backToTop.style.display = "none";
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// Los botones flotantes se mantienen visibles de forma permanente y accesible


//==============================
// NAVBAR EFFECT ON SCROLL
//==============================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(255,255,255,0.95)";
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
    } else {
        navbar.style.background = "rgba(255,255,255,0.18)";
        navbar.style.boxShadow = "none";
    }
});


//==============================
// SCROLL REVEAL ANIMATIONS
//==============================

const revealElements = document.querySelectorAll(".fade-up");

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
        }
    });

}, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

revealElements.forEach(el => revealObserver.observe(el));


//==============================
// TRADUCCION INGLES / ESPAÑOL
//==============================

const langToggleBtn = document.getElementById("lang-toggle");

function applyLanguage(lang) {

    document.querySelectorAll("[data-en]").forEach(el => {
        const text = lang === "en" ? el.dataset.en : el.dataset.es;
        if (text !== undefined) el.textContent = text;
    });

    document.querySelectorAll("[data-en-placeholder]").forEach(el => {
        const text = lang === "en" ? el.dataset.enPlaceholder : el.dataset.esPlaceholder;
        if (text !== undefined) el.setAttribute("placeholder", text);
    });

    document.documentElement.lang = lang;
    langToggleBtn.textContent = lang === "en" ? "ES" : "EN";
    localStorage.setItem("siteLang", lang);
}

let currentLang = localStorage.getItem("siteLang") || "es";
applyLanguage(currentLang);

langToggleBtn.addEventListener("click", () => {
    currentLang = currentLang === "es" ? "en" : "es";
    applyLanguage(currentLang);
});


//==============================
// COTIZADOR AL MAYOREO
//==============================

const WHOLESALE_PRICING = {
    "4oz": [
        { min: 20, max: 49, price: 4.00 },
        { min: 50, max: 99, price: 3.85 },
        { min: 100, max: Infinity, price: 3.75 }
    ],
    "8oz": [
        { min: 20, max: 49, price: 6.00 },
        { min: 50, max: 99, price: 5.85 },
        { min: 100, max: Infinity, price: 5.75 }
    ]
};

let quoteItems = [];

const quoteItemsContainer = document.getElementById("quote-items");
const quoteTotalElement = document.getElementById("quote-total");
const quoteAddButtons = document.querySelectorAll(".quote-add-btn");
const quoteWhatsappBtn = document.getElementById("quote-whatsapp-btn");

function getUnitPrice(size, qty) {
    const tiers = WHOLESALE_PRICING[size];
    const tier = tiers.find(t => qty >= t.min && qty <= t.max);
    return tier ? tier.price : null;
}

quoteAddButtons.forEach(button => {
    button.addEventListener("click", () => {

        const size = button.dataset.size;
        const label = button.dataset.label;
        const input = document.getElementById(`quote-qty-${size}`);
        const qty = parseInt(input.value, 10);

        if (!qty || qty < 20) {
            alert(currentLang === "en"
                ? "Please enter a quantity of at least 20 units."
                : "Por favor ingresa una cantidad mínima de 20 unidades.");
            input?.focus();
            return;
        }

        const unitPrice = getUnitPrice(size, qty);

        const existing = quoteItems.find(item => item.size === size);
        if (existing) {
            existing.qty = qty;
            existing.unitPrice = unitPrice;
        } else {
            quoteItems.push({ size, label, qty, unitPrice });
        }

        // Agregar también al carrito lateral
        const wholesaleId = "wholesale-" + size;
        const wholesaleName = size === "4oz" ? "Quesillo 4 oz (Mayoreo)" : "Quesillo 8 oz (Mayoreo)";
        const existingCartItem = cartItems.find(item => item.id === wholesaleId);
        if (existingCartItem) {
            existingCartItem.quantity = qty;
            existingCartItem.price = unitPrice;
        } else {
            cartItems.push({
                id: wholesaleId,
                name: wholesaleName,
                price: unitPrice,
                quantity: qty,
                isWholesale: true,
                size: size,
                label: label
            });
        }

        input.value = "";
        renderQuote();
        updateCart();

        // Feedback y abrir carrito
        cartBtn.classList.add("added");
        setTimeout(() => cartBtn.classList.remove("added"), 300);
        cart.classList.add("active");
    });
});

function removeQuoteItem(size) {
    quoteItems = quoteItems.filter(item => item.size !== size);
    cartItems = cartItems.filter(item => item.id !== "wholesale-" + size);
    renderQuote();
    updateCart();
}

function renderQuote() {

    quoteItemsContainer.innerHTML = "";
    const bFields = document.getElementById("wholesale-business-fields");

    if (quoteItems.length === 0) {
        const emptyText = currentLang === "en"
            ? "You haven't added anything yet. Choose a quantity above and press \"Add to Cart\"."
            : "Aún no has agregado nada. Elige una cantidad arriba y presiona \"Agregar al carrito\".";

        quoteItemsContainer.innerHTML = `<p class="quote-empty">${emptyText}</p>`;
        quoteTotalElement.textContent = "0.00";
        if (bFields) bFields.style.display = "none";
        return;
    }

    if (bFields) bFields.style.display = "block";

    let total = 0;

    quoteItems.forEach(item => {
        const subtotal = item.qty * item.unitPrice;
        total += subtotal;

        const unitLabel = currentLang === "en" ? "units" : "unidades";

        const line = document.createElement("div");
        line.classList.add("quote-line-item");
        line.innerHTML = `
            <span class="quote-line-info">${item.label} &times; ${item.qty} ${unitLabel} ($${item.unitPrice.toFixed(2)} c/u)</span>
            <span>
                <strong>$${subtotal.toFixed(2)}</strong>
                <button type="button" onclick="removeQuoteItem('${item.size}')">&times;</button>
            </span>
        `;
        quoteItemsContainer.appendChild(line);
    });

    quoteTotalElement.textContent = total.toFixed(2);
}

// Sincronizar inputs de nombre y dirección entre cotizador y carrito
const wholesaleBusinessName = document.getElementById("wholesale-business-name");
const wholesaleDeliveryAddress = document.getElementById("wholesale-delivery-address");
const cartBusinessName = document.getElementById("cart-business-name");
const cartDeliveryAddress = document.getElementById("cart-delivery-address");

if (wholesaleBusinessName && cartBusinessName) {
    wholesaleBusinessName.addEventListener("input", () => {
        cartBusinessName.value = wholesaleBusinessName.value;
    });
    cartBusinessName.addEventListener("input", () => {
        wholesaleBusinessName.value = cartBusinessName.value;
    });
}

if (wholesaleDeliveryAddress && cartDeliveryAddress) {
    wholesaleDeliveryAddress.addEventListener("input", () => {
        cartDeliveryAddress.value = wholesaleDeliveryAddress.value;
    });
    cartDeliveryAddress.addEventListener("input", () => {
        wholesaleDeliveryAddress.value = cartDeliveryAddress.value;
    });
}

if (quoteWhatsappBtn) {
    quoteWhatsappBtn.addEventListener("click", () => {

        if (quoteItems.length === 0) {
            alert(currentLang === "en"
                ? "Add at least one item to your quote first."
                : "Primero agrega al menos un artículo a tu cotización.");
            return;
        }

        const nameInput = document.getElementById("wholesale-business-name") || document.getElementById("cart-business-name");
        const addrInput = document.getElementById("wholesale-delivery-address") || document.getElementById("cart-delivery-address");
        const bName = (nameInput?.value || "").trim();
        const bAddr = (addrInput?.value || "").trim();

        if (!bName) {
            alert(currentLang === "en"
                ? "Please enter your business or contact name."
                : "Por favor ingresa el nombre de tu negocio o contacto.");
            nameInput?.focus();
            return;
        }

        if (!bAddr) {
            alert(currentLang === "en"
                ? "Please enter the delivery address for your business."
                : "Por favor ingresa la dirección de entrega de tu negocio.");
            addrInput?.focus();
            return;
        }

        let message = "Hola, me gustaría solicitar la siguiente cotización al mayoreo (con delivery para negocio):%0A%0A";
        let total = 0;

        quoteItems.forEach(item => {
            const subtotal = item.qty * item.unitPrice;
            total += subtotal;
            message += `- ${item.label} x${item.qty} unidades - $${subtotal.toFixed(2)}%0A`;
        });

        message += `%0ATotal estimado: $${total.toFixed(2)}`;
        message += `%0A%0A*Modalidad: Delivery exclusivo para Negocio / Comercio*`;
        message += `%0A*Nombre del Negocio:* ${encodeURIComponent(bName)}`;
        message += `%0A*Dirección de entrega:* ${encodeURIComponent(bAddr)}`;

        const phone = "14803437055";
        const url = `https://wa.me/${phone}?text=${message}`;

        window.open(url, "_blank");
    });
}


//==============================
// FORMULARIO DE CONTACTO EN LA PAGINA (Formspree)
//==============================

const pageContactForm = document.getElementById("page-contact-form");
const pcfSuccess = document.getElementById("pcf-success");

if (pageContactForm) {
    pageContactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(pageContactForm);

        fetch(pageContactForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                pcfSuccess.classList.add("show");
                pageContactForm.reset();
            } else {
                alert("Hubo un problema al enviar tu mensaje. Intenta de nuevo.");
            }
        })
        .catch(() => {
            alert("Hubo un problema al enviar tu mensaje. Intenta de nuevo.");
        });

        setTimeout(() => {
            pcfSuccess.classList.remove("show");
        }, 4000);
    });
}

//////////////////////////////////////////////////////
// CARRITO - LOGICA PRINCIPAL
//////////////////////////////////////////////////////

let cartItems = [];

const cartItemsContainer = document.getElementById("cart-items");
const totalElement = document.getElementById("total");
const cartCountElement = document.getElementById("cart-count");


//==============================
// AÑADIR PRODUCTOS AL CARRITO
//==============================

const addButtons = document.querySelectorAll(".add-cart");

addButtons.forEach(button => {
    button.addEventListener("click", () => {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);

        addToCart(id, name, price);

    });
});

function addToCart(id, name, price) {

    const existingItem = cartItems.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id,
            name,
            price,
            quantity: 1
        });
    }

    updateCart();

    // pequeño feedback visual: abre el carrito brevemente resaltado
    cartBtn.classList.add("added");
    setTimeout(() => cartBtn.classList.remove("added"), 300);
}


//==============================
// ACTUALIZAR CONTADOR DEL CARRITO (icono navbar)
//==============================

function updateCartCount() {

    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    cartCountElement.textContent = totalQty;

    // animación de "bump" cada vez que cambia la cantidad
    cartCountElement.classList.remove("bump");
    // forzar reflow para poder reiniciar la animación
    void cartCountElement.offsetWidth;
    cartCountElement.classList.add("bump");
}


//==============================
// ACTUALIZAR CARRITO
//==============================

function updateCart() {

    cartItemsContainer.innerHTML = "";

    const pickupNotice = document.getElementById("cart-pickup-notice");
    const wholesaleDelivery = document.getElementById("cart-wholesale-delivery");

    let total = 0;

    if (cartItems.length === 0) {

        const emptyMsg = currentLang === "en" ? "Your cart is empty." : "Tu carrito está vacío.";
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>${emptyMsg}</p>
            </div>
        `;

        totalElement.textContent = "0.00";
        if (pickupNotice) pickupNotice.style.display = "block";
        if (wholesaleDelivery) wholesaleDelivery.style.display = "none";
        updateCartCount();
        return;
    }

    const hasWholesale = cartItems.some(item => item.isWholesale);

    cartItems.forEach(item => {

        total += item.price * item.quantity;

        const itemElement = document.createElement("div");

        itemElement.classList.add("cart-item");

        if (item.isWholesale) {
            itemElement.innerHTML = `
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} c/u &times; ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>

                <div class="qty-controls">

                    <button type="button" onclick="decreaseQty('${item.id}')">-</button>

                    <span>${item.quantity}</span>

                    <button type="button" onclick="increaseQty('${item.id}')">+</button>

                    <button type="button" onclick="removeItem('${item.id}')">&times;</button>

                </div>
            `;
        } else {
            itemElement.innerHTML = `
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>

                <div class="qty-controls">

                    <button type="button" onclick="decreaseQty('${item.id}')">-</button>

                    <span>${item.quantity}</span>

                    <button type="button" onclick="increaseQty('${item.id}')">+</button>

                    <button type="button" onclick="removeItem('${item.id}')">&times;</button>

                </div>
            `;
        }

        cartItemsContainer.appendChild(itemElement);
    });

    totalElement.textContent = total.toFixed(2);

    if (hasWholesale) {
        if (pickupNotice) pickupNotice.style.display = "none";
        if (wholesaleDelivery) wholesaleDelivery.style.display = "block";
    } else {
        if (pickupNotice) pickupNotice.style.display = "block";
        if (wholesaleDelivery) wholesaleDelivery.style.display = "none";
    }

    updateCartCount();
}


//==============================
// INCREMENTAR CANTIDAD
//==============================

function increaseQty(id) {

    const item = cartItems.find(i => i.id === id);

    if (item) {
        if (item.isWholesale) {
            item.quantity += 5;
            item.price = getUnitPrice(item.size, item.quantity);
            const qItem = quoteItems.find(qi => qi.size === item.size);
            if (qItem) {
                qItem.qty = item.quantity;
                qItem.unitPrice = item.price;
            }
            renderQuote();
        } else {
            item.quantity++;
        }
        updateCart();
    }
}


//==============================
// DECREMENTAR CANTIDAD
//==============================

function decreaseQty(id) {

    const item = cartItems.find(i => i.id === id);

    if (item) {
        if (item.isWholesale) {
            if (item.quantity <= 20) {
                const confirmMsg = currentLang === "en"
                    ? "The minimum wholesale quantity is 20 units. Remove this item from cart?"
                    : "La cantidad mínima al mayoreo es de 20 unidades. ¿Deseas eliminar este producto del carrito?";
                if (confirm(confirmMsg)) {
                    removeItem(id);
                }
                return;
            }
            item.quantity -= 5;
            if (item.quantity < 20) item.quantity = 20;
            item.price = getUnitPrice(item.size, item.quantity);
            const qItem = quoteItems.find(qi => qi.size === item.size);
            if (qItem) {
                qItem.qty = item.quantity;
                qItem.unitPrice = item.price;
            }
            renderQuote();
        } else {
            item.quantity--;
            if (item.quantity <= 0) {
                cartItems = cartItems.filter(i => i.id !== id);
            }
        }
        updateCart();
    }
}


//==============================
// ELIMINAR ITEM
//==============================

function removeItem(id) {

    cartItems = cartItems.filter(item => item.id !== id);

    if (id.startsWith("wholesale-")) {
        const size = id.replace("wholesale-", "");
        quoteItems = quoteItems.filter(item => item.size !== size);
        renderQuote();
    }

    updateCart();
}

//////////////////////////////////////////////////////
// PERSISTENCIA (LOCALSTORAGE)
//////////////////////////////////////////////////////

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
}

function loadCart() {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
        try {
            cartItems = JSON.parse(savedCart);
            quoteItems = [];
            cartItems.forEach(item => {
                if (item.isWholesale) {
                    quoteItems.push({
                        size: item.size,
                        label: item.size === "4oz" ? "4 oz" : "8 oz",
                        qty: item.quantity,
                        unitPrice: item.price
                    });
                }
            });
            updateCart();
            renderQuote();
        } catch (e) {
            cartItems = [];
            updateCartCount();
        }
    } else {
        updateCartCount();
    }
}


// Sobrescribir updateCart para guardar automáticamente
const originalUpdateCart = updateCart;

updateCart = function () {
    originalUpdateCart();
    saveCart();
};


// cargar al inicio
loadCart();


//==============================
// VACIAR CARRITO
//==============================

const clearCartBtn = document.getElementById("clear-cart");

clearCartBtn.addEventListener("click", () => {
    cartItems = [];
    quoteItems = [];
    renderQuote();
    updateCart();
});


//==============================
// WHATSAPP ORDER
//==============================

const whatsappBtn = document.getElementById("whatsapp-order");

whatsappBtn.addEventListener("click", () => {

    if (cartItems.length === 0) {
        alert(currentLang === "en" ? "Your cart is empty." : "Tu carrito está vacío.");
        return;
    }

    const hasWholesale = cartItems.some(i => i.isWholesale);

    let message = "Hola, me gustaría ordenar lo siguiente:%0A%0A";

    let total = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}%0A`;
        total += itemTotal;
    });

    message += `%0ATotal: $${total.toFixed(2)}`;

    if (hasWholesale) {
        const nameInput = document.getElementById("cart-business-name") || document.getElementById("wholesale-business-name");
        const addrInput = document.getElementById("cart-delivery-address") || document.getElementById("wholesale-delivery-address");
        const bName = (nameInput?.value || "").trim();
        const bAddr = (addrInput?.value || "").trim();

        if (!bName) {
            alert(currentLang === "en"
                ? "Please enter your business or contact name for wholesale delivery."
                : "Por favor ingresa el nombre de tu negocio o contacto para el delivery al mayoreo.");
            nameInput?.focus();
            return;
        }

        if (!bAddr) {
            alert(currentLang === "en"
                ? "Please enter the delivery address for your business."
                : "Por favor ingresa la dirección de entrega de tu negocio.");
            addrInput?.focus();
            return;
        }

        message += `%0A%0A*Modalidad: Delivery exclusivo para Negocio / Comercio*`;
        message += `%0A*Nombre del Negocio:* ${encodeURIComponent(bName)}`;
        message += `%0A*Dirección de entrega:* ${encodeURIComponent(bAddr)}`;
    } else {
        message += `%0A%0A*Modalidad: Solo Pick-up (Retiro en cocina)*%0A_Por favor compárteme la dirección para coordinar el retiro de mi pedido._`;
    }

    const phone = "14803437055"; // tu número real de WhatsApp

    const url = `https://wa.me/${phone}?text=${message}`;

    window.open(url, "_blank");
});


//==============================
// PEQUEÑA MEJORA UX
//==============================

// cerrar carrito al hacer click fuera (opcional)

window.addEventListener("click", (e) => {
    const cart = document.getElementById("cart");

    if (e.target === cart) {
        cart.classList.remove("active");
    }
});
