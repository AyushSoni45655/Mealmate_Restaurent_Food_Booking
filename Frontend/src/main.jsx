
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import { store } from './redux(state managemant)/store.js'
import './index.css'
import {Toaster} from 'react-hot-toast'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
  
   
    <Provider  store={store}>
             <App />
       <Toaster reverseOrder={false} position='top-right'/>
    </Provider>
 
)
