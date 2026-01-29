import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowerRouter} from "react-router-dom" ;

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowerRouter>
    <App />
   </BrowerRouter>
  </StrictMode>,
)
