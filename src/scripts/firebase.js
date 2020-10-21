import firebase from 'firebase/app';
import 'firebase/database';

const Firebase = {

  config: {
    apiKey: 'AIzaSyBY9p87NA8qgLhHKZ7R7TWwY-BJ0iv5Glg',
    authDomain: 'halloween-invitation.firebaseapp.com',
    databaseURL: 'https://halloween-invitation.firebaseio.com',
    projectId: 'halloween-invitation',
    storageBucket: 'halloween-invitation.appspot.com',
    messagingSenderId: '798158331103',
    appId: '1:798158331103:web:f7998ece473f2e69185d6a'
  },

  initializeFirebaseApp(){
    if (!firebase.apps.length) {
      firebase.initializeApp(this.config)
    }
  },

  firebasePushGuestData (firstname, surname, message) {    
  
    firebase.database().ref('users').push().set(
      {
        firstname: firstname,
        surname: surname,
        message: message
      }
    )
  },
  
  firebaseGetPlaylist () {
    const promise = new Promise((resolve, reject) => {
      const result = firebase.database().ref('playlist').once('value').then(function (snapshot) {
          resolve(snapshot.val())
        })
    })
    return promise;
  },
  
  firebasePushTrack (name, artist, album, uri, image) {
    firebase.database().ref('playlist').push().set(
      {
        title: name,
        artist: artist,
        album: album,
        image: image,
        uri: uri
      }
    )
  },

  // create a functions to push menu
  firebasePushMenu (food) {    
    firebase.database().ref('menu').once('value', (snap) => {
      const menuRef = snap.val()
      const quantity = menuRef[food] || 0
      firebase.database().ref('menu').update({ [food]: quantity + 1 })
    })
  }
}
export { Firebase };
//module.exports = Firebase;



