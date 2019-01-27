import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";

// Custom Reducer
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReduser";

const firebaseConfig = {
  apiKey: "AIzaSyDnWwbfikfR_zt6SusWUVW5hPSeAGqe0Cw",
  authDomain: "reactclientpanel-d4dc0.firebaseapp.com",
  databaseURL: "https://reactclientpanel-d4dc0.firebaseio.com",
  projectId: "reactclientpanel-d4dc0",
  storageBucket: "reactclientpanel-d4dc0.appspot.com",
  messagingSenderId: "649464147559"
};

// react-redux-firebase-config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

// Init firebase instance
firebase.initializeApp(firebaseConfig);

// init firestore
const firestore = firebase.firestore();
// const settings = { timestampsInSnapshots: true };
// firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  notify: notifyReducer,
  settings: settingsReducer
});

// our settings will be stored in local storage and pssed to initial store

// check for settings in local storage
if (localStorage.getItem("settings") === null) {
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  // set initial state to localstorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

// Create store with reducers and initial state
const initialState = {
  settings: JSON.parse(localStorage.getItem("settings"))
};

// createStore
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
