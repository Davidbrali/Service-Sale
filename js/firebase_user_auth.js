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
firebase.auth().useDeviceLanguage();

/**
 * Realiza o login padrão com email e senha.
 */
function login() {
  var email = document.getElementById("input_email").value
  var password = document.getElementById("input_password").value

  firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
    alert('Bem-vindo: ' + email)
  }).catch(function (error) {
    console.log(error.code)
    console.log(error.message)

    alert('Não foi possível realizar login!')
  });
}

function loginWithFacebook() {
  var provider = new firebase.auth.FacebookAuthProvider();
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

    var userGoogle = {
      email: user.email,
      nome: "",
      sexo: "",
      cpf: "",
      idade: 0
    }

    firebase.database().ref('usuarios/' + user.displayName).set(userGoogle).then(() => {
      alert('Novo usuário: ' + email)
    }).catch(function (error) {
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

  if (isValidUsername(username)) {
    var user = {
      email: email,
      nome: "",
      sexo: "",
      cpf: "",
      idade: 0
    }

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
      firebase.database().ref('usuarios/' + username).set(user).then(() => {
        alert('Novo usuário: ' + email)
      }).catch(function (error) {
        console.log(error.code)
        console.log(error.message)
      })

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