import React from "react";
import Image from "next/image";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import NavigationBar from '../components/Global/NavigationBar';
import Dashboard from "../pages/Dashboard";

const App = () => {
  return (
    <div>   
        <BrowserRouter>
            <Routes>
              <Route path={'/Dashboard'} element={<Dashboard/>}/>
              
            </Routes>  
        </BrowserRouter>   


        <div className="grid place-items-center h-screen gap-8">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      
        <Image
          className="dark:invert center-image"
          src="/assets/Logo_Klein.png"
          alt="logo"
          width={180}
          height={38}
        />
        <h1 className="center-text font-geist-mono">Welcome to TalentTrack</h1>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2"> Get started by launching the Dashboard</li>
          <li>Experience TalentTrack with all its features</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/Dashboard"
          >
            Launch Dashboard
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href=""
          >
            TBD (maybe settings)
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a>
         Contact
        </a>
        <a>
         About
        </a>
      </footer>
    </div>
       
    </div>
  );
}

export default App;