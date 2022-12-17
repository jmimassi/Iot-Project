import React, { useState } from "react";
import "./App.css";
import Charts from "./components/Charts";
import Header from "./components/Header";
import Maps from "./components/Maps";
import Navbar from "./components/Navbar";
import Terminal from "./components/Terminal";
// import io from 'socket.io-client'
// const socket = io("http://localhost:3001/");

function App() {
  const [groupcoord, setGroupcoord] = useState([]);
  const [coordone, setCoordone] = useState();
  const [coordtwo, setCoordtwo] = useState();
  const [positions, setPositions] = useState([]);
  const [datas, setDatas] = useState([]);

  return (
    <div className="">
      <div>
        <Header />
      </div>

      <div className="flex justify-start gap-4 page-content">
        <div className="p-5 w-1/7">
          <Navbar
            positions={positions}
            setPositions={setPositions}
            coordone={coordone}
            coordtwo={coordtwo}
            groupcoord={groupcoord}
            setCoordone={setCoordone}
            setCoordtwo={setCoordtwo}
            setGroupcoord={setGroupcoord}
            datas={datas}
            setDatas={setDatas}
          />
        </div>

        <div className="flex flex-col gap-3 items-start w-full">
          <div className="flex gap-4">
            <div>
              <Maps positions={positions} setPositions={setPositions} />
            </div>
            <div className="h-min-screen">
              <Terminal
                coordone={coordone}
                coordtwo={coordtwo}
                groupcoord={groupcoord}
                setCoordone={setCoordone}
                setCoordtwo={setCoordtwo}
                setGroupcoord={setGroupcoord}
              />
            </div>
          </div>
          <div className="charts">
            <Charts datas={datas} setDatas={setDatas} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
