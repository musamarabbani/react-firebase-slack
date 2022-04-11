import { initializeApp } from 'firebase/app';
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
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
