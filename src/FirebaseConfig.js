import firebase from 'firebase'
const firebaseConfig = {
  apiKey: "AIzaSyDaEkvZ2js8KodF_t_H1jXN0fsxMqqu0Ys",
  authDomain: "insta-babble.firebaseapp.com",
  projectId: "insta-babble",
  storageBucket: "insta-babble.appspot.com",
  messagingSenderId: "748212509357",
  appId: "1:748212509357:web:f89a3c55fc60c97b5d4424"
};

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db, auth, storage}