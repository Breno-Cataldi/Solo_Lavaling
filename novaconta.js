//---- Carregando as definições do nosso projeto no Firebase ----//
import app from "/firebase_config.js";

//---- Importando as funções associadas à autenticação (Versão 10.9.0 do Firebase) ----//
import {
  getAuth,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

//---- Importando as função para manipulação do Realtime Database (Versão 10.9.0 do Firebase) ----//
import {
  getDatabase,
  ref,
  get,
  set,
  query,
  child
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

//----------------------------------------------------------------------//

function obterElemento(nomeWidget) {
  let elemento = document.getElementById(nomeWidget);
  if (elemento === null || elemento === undefined)
    throw new Error("Widget " + nomeWidget + " não encontrada");
  return elemento;
}

//----------------------------------------------------------------------//

// Recuperando as referências para os elementos presentes na página novaconta.html
let btNovaConta = obterElemento("btNovaConta");
let btCancelar = obterElemento("btCancelar");
let tfConta = obterElemento("tfConta");
let tfSenha = obterElemento("tfSenha");
let tfReplay = obterElemento("tfReplay");

// Obtendo o objeto que controla o serviço de autenticação do Projeto no Firebase
const auth = getAuth(app);

// Instanciando um objeto RecaptchaVerifier. Vinculo esse ao div 'recaptcha-container' da página
// e ao serviço de autenticação do Firebase (obrigatório na versão 9 em diante)
window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  {}
);
window.recaptchaVerifier.render().then(function (widgetId) {
  window.recaptchaWidgetId = widgetId;
});

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
  if (replay !== senha) {
    alert("A senha e a sua confirmação possuem valores diferentes");
    return;
  }

  // Recuperando o objeto gerenciador de autenticação do Firebase
  createUserWithEmailAndPassword(auth, conta, senha)
    .then(async (credencial) => {
      // Credencial gerada
      let user = credencial.user;

      // Envio para o usuário um email de verificação
      await sendEmailVerification(user);

      // Verificar se o usuário já está na entrada de usuários do Realtime Database
      const connDB = getDatabase(app);
      
      // Monto uma referência para o objeto que desejo recuperar
      let dbRefUsuario = ref(connDB, "usuarios/" + user.uid);
    
      // Faço o registro do novo usuário na entrada 'usuarios' do banco
      let objUsuario = {
        uid: user.uid,
        email: user.email,
        funcao: "INABILITADO",
      };
      // Inserindo um registro na entrada de 'usuarios' com o uid da autenticação
      set(dbRefUsuario, objUsuario).then(() => {});

      alert("Conta criada. Verifique sua caixa de email para confirmação da conta");
      
      // Retorno para o início
      window.history.go(-1);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      alert("Erro na criação da conta: " + errorMessage);
    });
}

//----------------------------------------------------------------------//

function btCancelarCallback() {
  window.history.go(-1);
}

//----------------------------------------------------------------------//

btNovaConta.onclick = btNovaContaCallback;
btCancelar.onclick = btCancelarCallback;

//----------------------------------------------------------------------//