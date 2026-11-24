const products = [
    {
        id: 1,
        name: "Nike Mercurial",
        brand: "Nike",
        type: "FG",
        price: 2500000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9A_MX4k0CreHAoqCsj67_dTu69sSLrKWxyhBBpYuxQ&s=10",
        description: "Giày bóng đá Nike phù hợp với người chơi yêu thích tốc độ."
    },
    {
        id: 2,
        name: "Adidas Predator",
        brand: "Adidas",
        type: "AG",
        price: 3200000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7R1W5OfEFzJanbDuAdT9_1zfea6wJN_hvqCKQDSKvlA&s=10",
        description: "Giày Adidas hỗ trợ kiểm soát bóng và chuyền bóng."
    },
    {
        id: 3,
        name: "Puma Future",
        brand: "Puma",
        type: "TF",
        price: 1800000,
        image: "https://product.hstatic.net/200000278317/product/ung-futsal-giay-da-bong-puma-future-ultimate-cage-107364-04-vang-xam-1_f1f48335c2604078b735db602b26de89_master.jpg",
        description: "Giày Puma linh hoạt, phù hợp chơi trên sân cỏ nhân tạo."
    },
    {
        id: 4,
        name: "Nike Phantom",
        brand: "Nike",
        type: "TF",
        price: 1900000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbnPWd66F0Zq3p2NGwW5Lc5PON2knbHcRdm9lhVZuO4Q&s=10",
        description: "Thiết kế thoải mái, phù hợp luyện tập và thi đấu."
    },
    {
        id: 5,
        name: "Adidas X Speed",
        brand: "Adidas",
        type: "FG",
        price: 2800000,
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=700&q=80",
        description: "Mẫu giày nhẹ dành cho người chơi thích bứt tốc."
    },
    {
        id: 6,
        name: "Puma King",
        brand: "Puma",
        type: "AG",
        price: 1500000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiU4597V6zvgoAIVHZsLb_JnBGbKeDXOvHvgdRNIcoQw&s",
        description: "Mẫu giày đơn giản, dễ sử dụng khi chơi bóng."
    }
];

let selectedSize = 40;
let selectedProduct = null;
const STARTING_BALANCE = 5000000;

function loadJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.error(`Không thể đọc dữ liệu ${key}:`, error);
        return fallback;
    }
}

let accounts = loadJSON("footballAccounts", {});
let currentUserEmail = localStorage.getItem("footballCurrentUser") || "";
let isRegisterMode = false;
let currentUser = accounts[currentUserEmail] || null;
let cart = loadJSON("footballCart", []).filter(item =>
    item &&
    products.some(product => product.id === item.id) &&
    [39, 40, 41, 42, 43, 44].includes(item.size) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
);

function saveAccounts() {
    try {
        localStorage.setItem("footballAccounts", JSON.stringify(accounts));
    } catch (error) {
        console.error("Không thể lưu tài khoản:", error);
        alert("Không thể lưu dữ liệu trên trình duyệt.");
    }
}

function saveCart() {
    try {
        localStorage.setItem("footballCart", JSON.stringify(cart));
    } catch (error) {
        console.error("Không thể lưu giỏ hàng:", error);
    }
}
function updateAccountButton() {
    const button = document.getElementById("accountButton");
    if (currentUser) {
        button.textContent = `${currentUser.name} | Ví: ${formatMoney(currentUser.balance)}`;
    } else {
        button.textContent = "Đăng nhập / Đăng ký";
    }
}
function showAuthMessage(message, isError = false) {
    const messageBox = document.getElementById("authMessage");
    messageBox.textContent = message;
    messageBox.className = isError ? "auth-message error" : "auth-message success";
}
function openAuth(register = false) {
    isRegisterMode = register;
    document.getElementById("authBox").style.display = "flex";
    document.getElementById("authTitle").textContent = register ? "TẠO TÀI KHOẢN" : "ĐĂNG NHẬP";
    document.getElementById("authName").style.display = register ? "block" : "none";
    document.querySelector('label[for="authName"]').style.display = register ? "block" : "none";
    document.getElementById("authName").required = register;
    document.getElementById("authSubmit").textContent = register ? "Đăng ký và nhận tiền demo" : "Đăng nhập";
    document.getElementById("authSwitch").innerHTML = register
        ? 'Đã có tài khoản? <button type="button" id="switchAuth" class="text-button">Đăng nhập</button>'
        : 'Chưa có tài khoản? <button type="button" id="switchAuth" class="text-button">Đăng ký ngay</button>';
    document.getElementById("authForm").reset();
    showAuthMessage("");
}
function logout() {
    currentUser = null;
    currentUserEmail = "";
    localStorage.removeItem("footballCurrentUser");
    updateAccountButton();
    alert("Bạn đã đăng xuất.");
}
function handleAuthSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("authName").value.trim();
    const email = document.getElementById("authEmail").value.trim().toLowerCase();
    const password = document.getElementById("authPassword").value;
    if (isRegisterMode) {
        if (!name) return showAuthMessage("Vui lòng nhập họ tên.", true);
        if (accounts[email]) return showAuthMessage("Email này đã được đăng ký.", true);
        accounts[email] = { name, email, password, balance: STARTING_BALANCE };
        currentUser = accounts[email];
        currentUserEmail = email;
        saveAccounts();
        localStorage.setItem("footballCurrentUser", email);
        updateAccountButton();
        showAuthMessage(`Đăng ký thành công! Bạn nhận ${formatMoney(STARTING_BALANCE)} tiền fake.`);
        setTimeout(() => document.getElementById("authBox").style.display = "none", 1200);
    } else {
        const account = accounts[email];
        if (!account || account.password !== password) {
            return showAuthMessage("Email hoặc mật khẩu không đúng.", true);
        }
        currentUser = account;
        currentUserEmail = email;
        localStorage.setItem("footballCurrentUser", email);
        updateAccountButton();
        showAuthMessage(`Xin chào ${account.name}! Số dư: ${formatMoney(account.balance)}.`);
        setTimeout(() => document.getElementById("authBox").style.display = "none", 1000);
    }
}
const productList = document.getElementById("productList");
function formatMoney(price) {
    return price.toLocaleString("vi-VN") + "₫";
}
function showProducts() {
    const brand = document.getElementById("brandFilter").value;
    const type = document.getElementById("typeFilter").value;

    let result = products;

    if (brand !== "all") {
        result = result.filter(product => product.brand === brand);
    }

    if (type !== "all") {
        result = result.filter(product => product.type === type);
    }

    productList.innerHTML = "";

    result.forEach(product => {
        productList.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Thương hiệu: ${product.brand}</p>
                <p>Loại sân: ${product.type}</p>
                <p class="price">${formatMoney(product.price)}</p>
                <button onclick="showDetail(${product.id})">Chi tiết</button>
                <button onclick="addToCart(${product.id}, 40)">Thêm vào giỏ</button>
            </div>
        `;
    });

    if (result.length === 0) {
        productList.innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
    }
}
document.getElementById("brandFilter").addEventListener("change", showProducts);
document.getElementById("typeFilter").addEventListener("change", showProducts);
function showDetail(id) {
    selectedProduct = products.find(product => product.id === id);
    if (!selectedProduct) return;
    selectedSize = 40;

    document.getElementById("detailInfo").innerHTML = `
        <img src="${selectedProduct.image}" alt="${selectedProduct.name}">
        <h2>${selectedProduct.name}</h2>
        <p>${selectedProduct.description}</p>
        <p><b>Thương hiệu:</b> ${selectedProduct.brand}</p>
        <p><b>Loại sân:</b> ${selectedProduct.type}</p>
        <p class="price">${formatMoney(selectedProduct.price)}</p>
        <p><b>Chọn size:</b></p>
        <div>
            ${[39, 40, 41, 42, 43, 44].map(size =>
                `<button class="size-button ${size === 40 ? "selected" : ""}"
                    onclick="chooseSize(${size})">${size}</button>`
            ).join("")}
        </div>
        <button onclick="addToCart(${selectedProduct.id}, selectedSize)">Thêm vào giỏ hàng</button>
    `;

    document.getElementById("detailBox").style.display = "flex";
}
function chooseSize(size) {
    selectedSize = size;
    document.querySelectorAll(".size-button").forEach(button => {
        button.classList.toggle("selected", Number(button.textContent) === size);
    });
}
function addToCart(id, size) {
    if (!products.some(product => product.id === id)) return;
    if (![39, 40, 41, 42, 43, 44].includes(size)) return;

    const item = cart.find(product => product.id === id && product.size === size);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ id: id, size: size, quantity: 1 });
    }

    updateCart();
    saveCart();
    document.getElementById("detailBox").style.display = "none";
    alert("Đã thêm sản phẩm vào giỏ hàng!");
}
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    let total = 0;
    let count = 0;

    cartItems.innerHTML = "";

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        total += product.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <b>${product.name}</b>
                    <p>Size: ${item.size}</p>
                    <p>${formatMoney(product.price)} x ${item.quantity}</p>
                </div>
                <div>
                    <button onclick="changeQuantity(${item.id}, ${item.size}, -1)">-</button>
                    <button onclick="changeQuantity(${item.id}, ${item.size}, 1)">+</button>
                    <button onclick="removeItem(${item.id}, ${item.size})">Xóa</button>
                </div>
            </div>
        `;
    });

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Giỏ hàng đang trống.</p>";
    }

    document.getElementById("cartCount").textContent = count;
    document.getElementById("totalPrice").textContent = formatMoney(total);
}
function changeQuantity(id, size, amount) {
    const item = cart.find(product => product.id === id && product.size === size);
    if (!item) return;
    item.quantity += amount;

    if (item.quantity <= 0) {
        removeItem(id, size);
    } else {
        updateCart();
        saveCart();
    }
}
function removeItem(id, size) {
    cart = cart.filter(item => !(item.id === id && item.size === size));
    updateCart();
    saveCart();
}
document.getElementById("showCart").addEventListener("click", function() {
    document.getElementById("cartBox").style.display = "flex";
});

document.getElementById("closeCart").addEventListener("click", function() {
    document.getElementById("cartBox").style.display = "none";
});
document.getElementById("closeDetail").addEventListener("click", function() {
    document.getElementById("detailBox").style.display = "none";
});
document.getElementById("checkout").addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }
    if (!currentUser) {
        alert("Bạn cần đăng nhập để đặt hàng.");
        openAuth(false);
        return;
    }
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);
    if (currentUser.balance < total) {
        alert(`Ví demo không đủ tiền. Số dư: ${formatMoney(currentUser.balance)}. Đơn hàng: ${formatMoney(total)}.`);
        return;
    }
    currentUser.balance -= total;
    accounts[currentUserEmail] = currentUser;
    saveAccounts();
    cart = [];
    updateCart();
    saveCart();
    updateAccountButton();
    document.getElementById("cartBox").style.display = "none";
    alert(`Đặt hàng demo thành công! Đã trừ ${formatMoney(total)}. Số dư còn lại: ${formatMoney(currentUser.balance)}.`);
});
document.getElementById("accountButton").addEventListener("click", function() {
    if (currentUser) {
        const choice = confirm(`Tài khoản: ${currentUser.email}\nSố dư ví demo: ${formatMoney(currentUser.balance)}\n\nNhấn OK để đăng xuất, Cancel để đóng.`);
        if (choice) logout();
    } else {
        openAuth(false);
    }
});

document.getElementById("closeAuth").addEventListener("click", function() {
    document.getElementById("authBox").style.display = "none";
});
document.getElementById("authForm").addEventListener("submit", handleAuthSubmit);
document.getElementById("authSwitch").addEventListener("click", function(event) {
    if (event.target.id === "switchAuth") openAuth(!isRegisterMode);
});
showProducts();
updateCart();
updateAccountButton();
