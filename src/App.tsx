import './App.css'
import RouteMap from './routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <RouteMap />
      <ToastContainer />
    </>
  )
}

export default App
