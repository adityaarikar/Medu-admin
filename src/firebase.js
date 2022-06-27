import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyBMgpSdhJFSLSLyre1UFDTDWnijwCWfhIA',
    authDomain: 'm-edu-6ab12.firebaseapp.com',
    projectId: 'm-edu-6ab12',
    storageBucket: 'm-edu-6ab12.appspot.com',
    messagingSenderId: '559190432012',
    appId: '1:559190432012:web:6e932223c14e85b8e91129'
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
