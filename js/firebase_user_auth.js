/**
 * Funções para autenticação do usuário no firebase.
 */
var config = {
  apiKey: "AIzaSyAt40bOwxWAS5SiZNnIqtJASkXdDZoLrjs",
  authDomain: "service-sale-projeto.firebaseapp.com",
  databaseURL: "https://service-sale-projeto.firebaseio.com",
  projectId: "service-sale-projeto",
  storageBucket: "service-sale-projeto.appspot.com",
  messagingSenderId: "295788813072"
};

firebase.initializeApp(config);

/**
 * Realiza o login padrão com email e senha.
 */
function login() {
  var email = document.getElementById("input_email").value
  var password = document.getElementById("input_password").value

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

  firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
    alert('Bem-vindo: ' + email)
    window.location.href = "./../pages/index.html";
  }).catch(function (error) {
    console.log(error.code)
    console.log(error.message)

    alert('Não foi possível realizar login!')
  });
}

/**
 * Desloga o usuário.
 */
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = './../pages/index.html';
  });
};

/**
 * Realiza/Cadastra um usuário com a conta do Facebook.
 */
function loginWithFacebook() {
  var provider = new firebase.auth.FacebookAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...

    alert('Bem-vindo: ' + user.displayName)
    window.location.href = "./../pages/index.html";
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

/**
 * Realiza/Cadastra um usuário com a conta do Google.
 */
function loginWithGoogle() {

  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function (result) {
    var token = result.credential.accessToken;
    var user = result.user;

    alert('Bem-vindo: ' + user.displayName)
    window.location.href = "./../pages/index.html";

    var userGoogle = {
      email: user.email,
      nome: "",
      sexo: "",
      cpf: "",
      idade: 0
    }

    firebase.database().ref('usuarios/' + user.displayName).set(userGoogle).then(() => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...

      alert('Novo usuário: ' + email)
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...

      console.log(error.code)
      console.log(error.message)
    })

  }).catch(function (error) {
    console.log(error.code)
    console.log(error.message)
    console.log(error.email)
    console.log(error.credential)
  });
}

/**
 * Registra um novo usuário de forma padrão com email e senha.
 */
function register() {

  var email = document.getElementById("input_email").value
  var password = document.getElementById("input_password").value
  var username = document.getElementById("input_username").value

  if (isValidUsername(username)) { // Verifica se o username é válido.

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () { // Cria um usuário.
      var userId = firebase.auth().currentUser.uid // Obtém o usuário.

      var user = { // Inicia um objeto de usuário.
        email: email,
        nome: "",
        nomedeusuario: username,
        sexo: "",
        cpf: "",
        idade: 0
      }

      writeUserData(userId, user) // Escreve no banco de dados.

    }).catch(function (error) {
      console.log(error.code)
      console.log(error.message)
      alert("Não foi possível criar o usuário!")
    });
  } else {
    alert("O nome de usuário não pode conter . # $ [ ]")
  }

}

/**
 * Grava os dados no RealtimeDatabase
 */
function writeUserData(userId, user) {
  firebase.database().ref('usuarios/' + userId).set(user).then(() => {
    alert('Bem-vindo ' + user.nomedeusuario)
    window.location.href = "./../pages/login.html"; // Redireciona para a página inicial.
  }).catch(function (error) {
    console.log(error.code)
    console.log(error.message)
  })
}

/**
 * Obtém o usuário atual.
 */
function getUserInformations() {
  var userId = firebase.auth().currentUser.uid // Obtém o usuário.

  return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
    var username = (snapshot.val() && snapshot.val().nome) || 'Anonymous';
    var name = (snapshot.val() && snapshot.val().nomedeusuario) || 'Anonymous';

    console.log('Funcionou')
  });

}

/**
 * Verifica se o nome inserido é válido para um username
 * 
 * @param {*} str 
 */
function isValidUsername(str) {
  // Se a string estiver vazia.
  if (str.length === 0) {
    return false
  }

  // Se contém caracteres inválidos
  for (i = 0; i < str.length; i++) {
    if (str.charAt(i) === '.' || str.charAt(i) === '#' || str.charAt(i) === '$' || str.charAt(i) === '[' || str.charAt(i) === ']') {
      return false;
    }
  }

  return true;
}

/**
 * Verifica se o CPF é válido.
 * 
 * @param {} str 
 */
function checkCPf(str) {
  var soma;
  var resto;
  soma = 0;
  if (str == "00000000000") return false;

  for (i = 1; i <= 9; i++) soma = soma + parseInt(str.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;

  if ((resto == 10) || (resto == 11)) resto = 0;
  if (resto != parseInt(str.substring(9, 10))) return false;

  soma = 0;
  for (i = 1; i <= 10; i++) soma = soma + parseInt(str.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;

  if ((resto == 10) || (resto == 11)) resto = 0;
  if (resto != parseInt(str.substring(10, 11))) return false;
  return true;
}