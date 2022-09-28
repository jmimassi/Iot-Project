import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet'
import './App.css';
import Header from './components/Header';
import Maps from './components/Maps';
import Navbar from './components/Navbar';
import Terminal from './components/Terminal';

function App() {
  return (
    <div>

      <div>
        <Header />
      </div>

      <div className='flex'>
        <div className='p-5 w-1/5 '>
          <Navbar />
        </div>

        <div className='w-full flex flex-col space-y-5'>
          <div>

            <Maps />
          </div>
          <div>
            <Terminal />
          </div>
        </div>
      </div>



    </div>
  );
}

export default App;
