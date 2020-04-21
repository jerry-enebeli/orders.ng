const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("myParam");
const businessName = urlParams.get("business");
const userId = urlParams.get("id");
const linkId = urlParams.get("link");

let productName
let price

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

const getOrders = async () => {
  var db = firebase.firestore();
  const result = await db.collection("Links").doc(linkId).get();
  productName = result.data().productName
  price =  '₦' + new Intl.NumberFormat("en-US", {}).format(result.data().price);


document.getElementById("product-name").innerText = productName;
document.getElementById("product-price").innerText = price;
};

getOrders();

document.getElementById("business-name").innerText = businessName;
