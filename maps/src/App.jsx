import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet'
import './App.css';
import Charts from './components/Charts';
import Header from './components/Header';
import Maps from './components/Maps';
import Navbar from './components/Navbar';
import Terminal from './components/Terminal';

function App() {
  return (
    <div className=''>

    <div>
        <Header />
    </div>




      <div className='flex justify-start gap-4 page-content'>
        <div className='p-5 w-1/7'>
          <Navbar />
        </div>

      
        <div className='flex flex-col gap-3 items-start w-full'> 

    <div className='flex gap-4'>

          <div >
            <Maps />
          </div>
          <div className='h-min-screen'>
            <Terminal />
          </div>
    </div>
          <div className='charts'>
            <Charts/>
          </div>
        </div>
    
      </div>



    </div>
  );
}

export default App;
