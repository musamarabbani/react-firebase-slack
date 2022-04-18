import * as firebase from 'firebase';
// import { getAnalytics } from 'firebase/analytics';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyArmu_OUpA9uXAyqQ1VQsQFyMmNh8j-I9Y',
	authDomain: 'react-slack-clone-4b350.firebaseapp.com',
	projectId: 'react-slack-clone-4b350',
	storageBucket: 'react-slack-clone-4b350.appspot.com',
	messagingSenderId: '722181497459',
	appId: '1:722181497459:web:d4790933746036a2790006',
	measurementId: 'G-9QEZ84MBJ8',
	databaseURL: 'react-slack-clone-4b350-default-rtdb.firebaseio.com',
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();
// const analytics = getAnalytics(app);

export { firebase, database, auth };
