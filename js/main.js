const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("myParam");
const businessName = urlParams.get("business");
const userId = urlParams.get("id");
const linkId = urlParams.get("link");
const xop = urlParams.get("xop").split("[")[1].split("]")

console.log(xop)
let product_name;
let priceNum;
let price;
let products;

firebase.initializeApp({
  apiKey: "AIzaSyD-mNaskMlrezICXddeo6KED1gemyLLzc8",
  authDomain: "orders-ng.firebaseapp.com",
  databaseURL: "https://orders-ng.firebaseio.com",
  projectId: "orders-ng",
  storageBucket: "orders-ng.appspot.com",
  messagingSenderId: "1080782001747",
  appId: "1:1080782001747:web:ae3c53704a68fde2f758a6",
  measurementId: "G-EDCQCN0F56",
});
var db = firebase.firestore();

const numberFormat = (price) => {
  return "₦" + new Intl.NumberFormat("en-US", {}).format(price);
};

let x = (renderProductDetails = ({ productName, price }, id) => {
  return `   
  <div class="f4-5-l f4-8 black-50 ">
      <p >Product Name: <span id="product-name">${productName}</span></p>
  
      <p >Price: <span id="product-price">${price}</span></p>
  </div>
  
  <p style="margin-top: 22px" class="f4-5-l f4-8 black-50 ">Quantity</p>
  <input
  value=1
  class="input-reset bw0-5 f4-5 cursor ba b--light-gray br1 black-80 ph3 mv3 db w-100 outline-0 entry-h"
  id=${id + "qty"}
  placeholder="Quantity"
  type="number"
  />
  `;
});

const getLinkDetails = async () => {
  const result = await db.collection("Links").doc(linkId).get();
  product_name = result.data().productName;
  price = numberFormat(result.data().price);
  priceNum = result.data().price;
  products = result.data().products;
  products.forEach((product, i) => {
    let div = document.createElement("div");
    div.innerHTML = renderProductDetails(product, i);
    div.style.marginBottom = "30px";
    document.getElementById("product-details").append(div);
  });
};

const placeOrder = async (e) => {
  const customer_name = document.getElementById("customer_name").value;
  const customer_email = document.getElementById("customer_email").value;
  const customer_phone = document.getElementById("customer_phone").value;
  const delivery_address = document.getElementById("delivery_address").value;

  const productsWithQuantity = products.map((product, i) => {
    product.qty = parseInt(document.getElementById(i + "qty").value) || 1;
    product.price = product.qty * product.price
    return product;
  });

  const data = {
    customer_email,
    customer_name,
    customer_phone,
    delivery_address,
    businessName,
    products: productsWithQuantity,
    userId,
    xop,
    qty: productsWithQuantity.reduce((total, product) => {
      return total + product.qty;
    }, 0),
    total_amount: productsWithQuantity.reduce((total, product) => {
      return total + product.qty * product.price;
    }, 0),
    status: "pending",
    date: new Date().getTime(),
  };

  console.log(data)

  await db.collection("Orders").add(data);
  document.location = "orders-placed.html";
};
getLinkDetails();

document.getElementById("business-name").innerText = businessName;
