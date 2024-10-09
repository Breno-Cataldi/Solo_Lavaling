import app from "/firebase_config.js";
import { getAuth, RecaptchaVerifier, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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
let btNovaConta = obterElemento("btNovaConta");
let btCancelar = obterElemento("btCancelar");
let tfConta = obterElemento("tfConta");
let tfSenha = obterElemento("tfSenha");
let tfReplay = obterElemento("tfReplay");

//
// Definindo a Callback para cada um dos botões (Callback é a função que é executada
// quanto um evento de interface ocorre)
//
btNovaConta.onclick = btNovaContaCallback; 
btCancelar.onclick = btCancelarCallback; 


/*const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('abcdefghijklmnopqrstuvwxy-1234567890abcd'),
  isTokenAutoRefreshEnabled: true
});*/

const auth = getAuth(app);

/*
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {size: 'invisible',
            callback: () => {
                console.log('recaptcha resolved..')
            }});
window.recaptchaVerifier.render().then(function(widgetId) {
  window.recaptchaWidgetId = widgetId;
});
*/

//----------------------------------------------------------------------//

function btNovaContaCallback() {
  // Recuperando o que está preenchido no input tfConta
  let conta = tfConta.value;
  if (conta == null || conta == "") {
    alert("conta não preenchida");
    return;
  }
  // Recuperando o que está preenchido no input tfSenha
  let senha = tfSenha.value;
  if (senha == null || senha == "") {
    alert("senha não preenchida");
    return;
  }
  // Recuperando o que está preenchido no input tfReplay
  let replay = tfReplay.value;
  if (replay == null || replay == "") {
    alert("Confirmação de senha não preenchida");
    return;
  }
  // Verificando se tfSenha é igual ao tfReplay
  if (replay !== senha ) {
    alert("A senha e a sua confirmação possuem valores diferentes");
    return;
  }
    
  //let recaptchaResponse = window.grecaptcha.getResponse(window.recaptchaWidgetId);
  
  // Recuperando o objeto gerenciador de autenticação do Firebase
  createUserWithEmailAndPassword(app, conta, senha).then(async (credencial) => {
    // Credencial gerada
    console.log(credencial);
    let user = credencial.user;
    // Envio para o usuário um email de verificação
    await user.sendEmailVerification()     
    // Recupero a referência para o módulo realtime database do firebase
    const dbRef = getDatabase(app).ref();
    // Escrevo uma entrada dentro de 'usuarios' para o novo usuário
    dbRef.child("usuarios")
         .child(user.uid)
         .set({ uid: user.uid, email: user.email, funcao: "INABILITADO" })
         .then((msg) => console.log(msg));
    alert("Conta criada. Verifique sua caixa de email para confirmação da conta");
    // Retorno para o início
    window.history.go(-1);
  }).catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    //window.recaptchaVerifier.render().then(function(widgetId) {
    //                        window.grecaptcha.reset(widgetId);
    //                   });
    alert("Erro na criação da conta: " + errorMessage);
  });
}

//----------------------------------------------------------------------//

function btCancelarCallback() {
   window.history.go(-1);
}

//----------------------------------------------------------------------//
