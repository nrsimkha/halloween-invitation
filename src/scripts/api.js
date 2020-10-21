import { Firebase } from './firebase';
console.log(Firebase);
const APIController = (function () {

  const clientSecret = '68a39ae7f5984efbb78be7f5a0b4d593'
  const clientId = 'baf42d8287de4eafbc4c0ad834343788'

  const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    })

    const data = await result.json()
    return data.access_token
  }

  const _getTracks = async (token) => {
    const limit = 10
    const term = document.getElementById('search-tracks').value
    const result = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    const data = await result.json()

    return data.tracks.items
  }

  return {
    getToken () {
      return _getToken()
    },
    getTracks (token) {
      return _getTracks(token)
    }
  }
})()

const UIController = (function () {  

  return {
    createPlaylistSongDetail (title, artist, album, image) {
      const html =
            `
            <li>
            <div class="Track">
            <img src="${image}" alt="Track image">
            <div class="Track-information">
                <h3>${title}</h3>                                       
               
                <p>${artist} | ${album} </p>
            </div>            
            </div>

        </li>
            `
      return html
    },
    createSongDetail (title, artist, album, uri, image) {
      const html =
            `
            <li>
            <div class="Track">          
            <div class="Track-information">
                <h3>${title}</h3>                                       
               
                <p>${artist} | ${album} </p>
            </div>
            <button class="Track-action" data-title="${title}" data-album="${album}" data-artist="${artist}" data-image="${image}" data-uri="${uri}">+</button>
            </div>

        </li>
            `
      return html
    },
    storeToken (value) {
      localStorage.setItem('hidToken', value)
    },

    getStoredToken () {
      return {
        token: localStorage.getItem('hidToken')
      }
    },
    resetTracks (element) {
      element.innerHTML = ''
    },
    resetPlaylistTracks (element) {
      element.innerHTML = ''
    }
  }
})()

const AppController = (function (UIController, APIController) {
    return {
      loadTracks: async () => {

        const token = await APIController.getToken();
    
        UIController.storeToken(token);
    
        Firebase.initializeFirebaseApp();
    
        const playlist = await Firebase.firebaseGetPlaylist().then((result) => {
          for (const [key, value] of Object.entries(result)) {
            const html = UIController.createPlaylistSongDetail(value.title, value.artist, value.album, value.image)
            document.getElementById('current-playlist').insertAdjacentHTML('beforeend', html)
          }
        })
    
      },

      showTracks: async () => {
       
        const token = UIController.getStoredToken().token;
    
        if (!token) {
          token = await APIController._getToken();
        }
    
        UIController.resetTracks(document.getElementById('search-results'));
    
        const tracks = await APIController.getTracks(token);
    
        tracks.forEach(element => {
          const html = UIController.createSongDetail(element.name, element.artists[0].name, element.album.name, element.uri, element.album.images[0].url)
          document.getElementById('search-results').insertAdjacentHTML('beforeend', html)
        })

        const addTrackButtons = document.querySelectorAll('.Track-action');

        addTrackButtons.forEach(addTrackButton => {
          addTrackButton.addEventListener('click', async (e) => {
            UIController.resetPlaylistTracks(document.getElementById('current-playlist'))
            firebasePushTrack(e.target.dataset.title, e.target.dataset.artist, e.target.dataset.album, e.target.dataset.uri, e.target.dataset.image)
            loadTracks()
          })
        })

      },



    }
})(UIController, APIController);


document.addEventListener('DOMContentLoaded', event => {
  AppController.loadTracks();
  document.getElementById('search-button').addEventListener('click', e => {
    e.preventDefault;
    AppController.showTracks();
  })
})