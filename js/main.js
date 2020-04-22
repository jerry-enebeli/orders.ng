const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("myParam");
const businessName = urlParams.get("business");
const userId = urlParams.get("id");
const linkId = urlParams.get("link");
const xop = urlParams.get("xop");

let productName;
let priceNum
let price;

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
const getOrders = async () => {
  const result = await db.collection("Links").doc(linkId).get();
  productName = result.data().productName;
  price = "₦" + new Intl.NumberFormat("en-US", {}).format(result.data().price);
  priceNum = result.data().price;

  document.getElementById("product-name").innerText = productName;
  document.getElementById("product-price").innerText = price;
};


sendPushNotification = async (customer_name, xop) => {
    sendPushNotification = async () => {
        const message = {
          to: xop,
          sound: 'default',
          title: 'Original Title',
          body: 'And here is the body!',
          data: { data: 'goes here' },
          _displayInForeground: true,
        };
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
      };
  };

const placeOrder = async (e) => {
  const customer_name = document.getElementById("customer_name").value;
  const customer_email = document.getElementById("customer_email").value;
  const customer_phone = document.getElementById("customer_phone").value;
  const delivery_address = document.getElementById("delivery_address").value;
  const qty = document.getElementById("qty").value;
  
  const data = {
    customer_email,
    customer_name,
    customer_phone,
    delivery_address,
    userId,
    xop,
    qty: qty || 1,
    total_amount: parseInt(priceNum) * parseInt(qty),
    status: "pending",
    date: new Date().getTime(),
  };
  await db.collection("Orders").add(data);
  sendPushNotification(customer_name, xop)
};
getOrders();

document.getElementById("business-name").innerText = businessName;
