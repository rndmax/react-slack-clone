import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyCECRZzfKZjX5YDHXOkwxYFCSJz4Yy3LMU',
	authDomain: 'chatidle.firebaseapp.com',
	databaseURL: 'https://chatidle.firebaseio.com',
	projectId: 'chatidle',
	storageBucket: 'chatidle.appspot.com',
	messagingSenderId: '828578194050',
	appId: '1:828578194050:web:2ab8c1330ab0947b0f0a9b',
	measurementId: 'G-SGGFMCB1BV',
};
firebase.initializeApp(firebaseConfig);

export default firebase;
