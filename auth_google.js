import app from "/firebase_config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";

import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  browserSessionPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";


import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
        child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
  from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";


const provider = new GoogleAuthProvider();
const auth = getAuth(app);

auth.languageCode = "pt-BR";
auth.setPersistence(browserSessionPersistence);

//----------------------------------------------------------------------//

function obterElemento(nomeWidget) {
  let elemento = document.getElementById(nomeWidget);
  if (elemento === null || elemento === undefined)
    throw new Error("Widget " + nomeWidget + " não encontrada");
  return elemento;
}

//----------------------------------------------------------------------//

//
// Recuperando os objetos DOM presentes na página e que 
// vamos manipular neste código
//

let btLogin = obterElemento("btLogin");

//
// Definindo a Callback para cada um dos botões (Callback é a função que é executada
// quanto um evento de interface ocorre)
//
btLogin.onclick = btLoginCallback; 

//----------------------------------------------------------------------//

//
// O código abaixo está relacionado com o deploy do Service Worker. Isso permite que nossa 
// aplicação se torne um App para Dispositivos Mobile
//
/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
  .then(function(reg) {
    // registration worked
    console.log('Registro do Service Worker bem sucedido. O escopo de uso é ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registro do Service Worker com ' + error);
  });
}
*/

//----------------------------------------------------------------------//

function btLoginCallback() {
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
    // Verificar se o usuário já está na entrada de usuários do firebase
    const dbRef = getDatabase(app).ref();

    dbRef.child("usuarios")
        .child(user.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists() && snapshot.val().funcao != "INABILITADO") {
            // O usuário já está na entrada de usuários no firebase e pode usar o sistema
            window.location.href = "logged.html";
          } else {
            alert("Sua conta ainda não foi liberada por um administrador.");
            // O usuário já pediu para criar uma conta no sistema, mas ainda
            // não tem uma entrada em 'usuarios'
            dbRef
              .child("usuarios")
              .child(user.uid)
              .set({ uid: user.uid, email: user.email, funcao: "INABILITADO" })
              .then((msg) => console.log(msg));
          }
        }).catch((error) => {
          var errorCode = error.code;
        var errorMessage = error.message;
        alert("Conta ainda não criada.");
        console.log("#------->" + errorMessage + " " + errorCode);
      });    
  } else {
    const userCred = await signInWithPopup(auth, provider); // signInWithRedirect(auth, provider);
  }
});

}

//----------------------------------------------------------------------//