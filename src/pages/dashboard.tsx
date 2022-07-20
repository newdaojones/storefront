import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {PlayPage} from './play';

import {ProfilePage} from './profile';
import {ScanPage} from "./scan";
import {BuyPage} from "./buy";
import {ConfirmationPage} from "./confirmation";

export const Dashboard = () => {
    let mainPage = ProfilePage;
    return (
      <div className="w-full h-full flex-1">
        <Routes>
          <Route path="/profile" element={mainPage} />
          <Route path="/play" element={PlayPage} />
          <Route path="/scan" element={ScanPage} />
          <Route path="/buy" element={BuyPage} />
          <Route path="/confirmation" element={ConfirmationPage} />
          <Navigate replace to="/profile" />
        </Routes>
      </div>
    );
}
