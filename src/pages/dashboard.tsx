import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {PlayPage} from './play';

import {ProfilePage} from './profile';
import {ScanPage} from "./scan";
import {BuyPage} from "./buy";
import {ConfirmationPage} from "./confirmation";

export const Dashboard = () => {
    let mainPage = ProfilePage;
    return (
      <div className="w-full h-full flex-1">
        <Switch>
          <Route path="/profile" component={mainPage} />
          <Route path="/play" component={PlayPage} />
          <Route path="/scan" component={ScanPage} />
          <Route path="/buy" component={BuyPage} />
          <Route path="/confirmation" component={ConfirmationPage} />
          <Redirect to="/profile" />
        </Switch>
      </div>
    );
}
