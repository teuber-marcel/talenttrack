import React from "react";
import Image from "next/image";
import {BrowserRouter, Link} from "react-router-dom";


const App = () => {
  return (
    <div>
        <h1>TalentTrack</h1>
        <Image src="/*/Logo_Klein.png" alt="TalentTrack Logo" width={200} height={200} />
        <BrowserRouter>
            <Link to={'/'}> Home / Dashboard</Link>
            <Link to={'/Dashboard'}> Dashboard</Link>
        </BrowserRouter>
    </div>
  );
}

export default App;