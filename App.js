import './App.css'
import MainDash from './components/MainDash/MainDash';
import RightSide from './components/RigtSide/RightSide';
import Sidebar from './components/Sidebar';
import React, { useEffect, useState } from 'react';
import DataState from './context/data/DataState';


function App() {
  // const [HeartRate, setHeartRate] = useState(null);
  // const [PulseRate, setPulseRate] = useState(null);
  // useEffect(() => {
  //   const socket = new WebSocket('ws://localhost:4001');

  //   socket.addEventListener('message', (event) => {
  //     const data = JSON.parse(event.data);
  //     setHeartRate(data.heartRate);
  //     setPulseRate(data.PulseRate);
  //   });

  //   return () => {
  //     socket.close();
  //   };
  // }, []);
  return (
    <div className="App">
    <DataState>
    {/* <h1>Real-Time Updates</h1> 
      <p>HeartRate: {HeartRate !== null ? HeartRate.toFixed(2) : 'Loading...'}</p>
      <p>PulseRate: {PulseRate !== null ? PulseRate.toFixed(2) : 'Loading...'}</p> */}
      <div className="AppGlass">
        {/* <Sidebar/> */}
        <MainDash/>
        <h1>Medication dalde vipin bhai rightside componenet ko edit krke</h1>
        {/* <RightSide/> */}
      </div>
    </DataState>
      
    </div>
  );
}

export default App;
