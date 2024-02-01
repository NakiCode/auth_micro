import axios from 'axios';

axios.post('http://127.0.0.1:5000/api/v1/user/signup',{})
  .then(function (response) {
    console.log(response.data); // Les données renvoyées par le serveur
  })
  .catch(function (error) {
    console.log(error.response.data); // L'objet response de la requête échouée
    //console.log(error.message); // Le message d'erreur renvoyé par le serveur
  });