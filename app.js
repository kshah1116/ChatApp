// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  getFirestore
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk3Rs-m2JIVcsDdsXNDC37KTMT3CVbltE",
  authDomain: "authe-e7f14.firebaseapp.com",
  projectId: "authe-e7f14",
  storageBucket: "authe-e7f14.appspot.com",
  messagingSenderId: "1038295028604",
  appId: "1:1038295028604:web:95d10626fc3acaf5bb8af9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


var username = document.getElementById("username");
var password = document.getElementById("password");
var signin = document.getElementById("login");
var signup = document.getElementById("create");
var logout = document.getElementById("logout");

signup.addEventListener("click", function () {
  createUserWithEmailAndPassword(auth, username.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("created");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      alert(errorMessage);
    });
});

signin.addEventListener("click", function () {
  signInWithEmailAndPassword(auth, username.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Logged in");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      
      alert("You have entered wrong username/password")
    });
});

logout.addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      console.log("Sign-out Successfull");
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    //User is signed in
    const uid = user.uid;
    var useremail = user.email;
    console.log(user);
    document.getElementsByClassName("authdiv")[0].style.display = "none";
    document.getElementsByClassName("chatdiv")[0].style.display = "";
    document.getElementsByClassName("link")[0].innerHTML = user.email;
    const q = query(collection(db, "messages"), orderBy("time", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // console.log("New city: ", change.doc.data());
          if (change.doc.data().sentby == useremail) {
            var msgdiv = document.createElement("div");
            msgdiv.className = "chat2";
            msgdiv.innerHTML = change.doc.data().value;
            document.getElementsByClassName("uploaded")[0].appendChild(msgdiv);
          }
          else{
            var msgdiv = document.createElement("div");
            var msgdivname = document.createElement("div");
            var msg= document.createElement("div");
            msgdiv.className="chat";
            msg.innerHTML=change.doc.data().value;
            msgdivname.innerHTML=change.doc.data().sentby.slice(0,change.doc.data().sentby.length-10);
            document.getElementsByClassName("uploaded")[0].appendChild(msgdiv);
            msgdiv.appendChild(msg);
            msgdiv.appendChild(msgdivname);

          }
        }
        if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
        }
      });
    });
    document
      .getElementsByClassName('send')[0]
      .addEventListener('click', async function () {
        var time = new Date().getTime();
        const docRef = await addDoc(collection(db, "messages"), {
          value: document.getElementById("txt").value,
          time: time,
          sentby: useremail,
        });
        console.log("Document written with ID: ", docRef.id);
        document.getElementById("txt").value = "";
      });

    
  } else {
    console.log("signed out");
    document.getElementsByClassName("authdiv")[0].style.display = "";
    document.getElementsByClassName("chatdiv")[0].style.display = "none";
  }
});