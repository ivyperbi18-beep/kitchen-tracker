import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA5yK8KcBK5XRwdqMFG15MHpY0UtYI4IrE",
  authDomain: "my-kitchen-tracker-1b792.firebaseapp.com",
  projectId: "my-kitchen-tracker-1b792",
  storageBucket: "my-kitchen-tracker-1b792.firebasestorage.app",
  messagingSenderId: "114492612877",
  appId: "1:114492612877:web:99bbb85bbab91f2a3dd044"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
