// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onChildAdded,
  onValue,
  onChildChanged,
  onChildRemoved,
  query,
  orderByChild,
  limitToLast,
  set,
  push,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTFFtBJcVvvAmheGXz3YRiE1RMyWYbhU8",
  authDomain: "la-choriweb.firebaseapp.com",
  databaseURL: "https://la-choriweb-default-rtdb.firebaseio.com",
  projectId: "la-choriweb",
  storageBucket: "la-choriweb.appspot.com",
  messagingSenderId: "536020189776",
  appId: "1:536020189776:web:51ced72fd8af0281cec755",
  measurementId: "G-YPD9D4QK8Z",
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// autenticacion google
const provider = new GoogleAuthProvider();
const auth = getAuth();


const d = document;
const db = getDatabase();

const nombre = d.getElementById("nombreUsuario");
const mensaje = d.getElementById("inputMensaje");
const enviarMsj = d
  .getElementById("enviarBtn")
  .addEventListener("click", () => {
    traeData();
  });
const login = d.getElementById("login")
const deslogBtn = d.getElementById('deslog').addEventListener('click',()=> {deslog()})
const interact = d.getElementById("interactuar");

// referencias
const refMensaje = ref(db, "mensajes/");

const chat = document.getElementById("chat");


let loguearUser = () => {
    signInWithPopup(auth, provider).then((res) => {
      let logUser = {
        uid: res.user.uid,
        username: res.user.displayName,
        profile_picture: res.user.photoURL,
        email: res.user.email,
      };
      nombreUsuario.value = logUser.username
      login.style.display = 'none';
      interact.style.display = 'block';
    });
  
    auth.languageCode = "es";
  };
  
const agregarMSG = (msg) => {
  let li = document.createElement("li");
  let txt = document.createTextNode(`${msg.autor} : ${msg.mensaje}`);

  li.appendChild(txt);
  li.setAttribute("id", msg.fecha);
  chat.appendChild(li);
  document
    .getElementById(msg.fecha)
    .scrollIntoView({ block: "end", behavior: "smooth" });
};

let click = document.addEventListener("keyup", (e) => {
  if (e.keyCode == 13) {
    e.preventDefault();
    document.getElementById("enviarBtn").click();
  }
});

const traeData = () => {
  let fecha = Date.now();
  let msg = {
    autor: nombre.value,
    mensaje: mensaje.value,
    fecha: fecha,
  };
  if (nombre.value == "" || mensaje.value == "") {
    console.log("No va a funcionar");
  } else {
    push(refMensaje, msg);
    mensaje.value = "";
  }

  console.log(msg);
};

onChildAdded(refMensaje, (snap) => {
  const data = snap.val();
  agregarMSG(data);
});

login.addEventListener("click", () => {
    loguearUser();
});

// onAuthStateChanged muestra cambio cuando el user loguea
onAuthStateChanged(auth, (user) => {
    if (user) {
        nombreUsuario.value = user.displayName;
        login.style.display = 'none';
        interact.style.display = 'block';
    } else {
        null;
    }
})


// si queremos deslogear
const deslog = () => {
    signOut(auth).then((res) => {
        login.style.display = 'block';
        interact.style.display = 'none';
    });
}