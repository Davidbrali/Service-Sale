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

function login() {
  var email = document.getElementById("input_email").value;
  var password = document.getElementById("input_password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      alert('Bem-vindo: ' + email)
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...

      alert('Não foi possível realizar login!')
    });
}

function register() {

  var email = document.getElementById("input_email").value;
  var password = document.getElementById("input_password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
      alert('Novo usuário: ' + email);

    })
    .catch(function (error) {
      // Handle Errors here.
      console.error(error.code);
      console.error(error.message);

      alert("Não foi possível criar o usuário!");
      // ...
    });
}