import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {PlayPage} from './play';

import {HomePage} from './home';
import {ScanPage} from "./scan";
import {BuyPage} from "./buy";
import {ConfirmationPage} from "./confirmation";
import {Tip} from "./tip";

export const Dashboard = () => {
    const mainPage = HomePage;
    return (
      <div className="w-full h-full flex-1">
        <Switch>
          <Route path="/home" component={mainPage} />
          <Route path="/play" component={PlayPage} />
          <Route path="/scan" component={ScanPage} />
          <Route path="/buy" component={BuyPage} />

          <Route path="/confirmation" component={ConfirmationPage} />
          <Redirect to="/home" />
        </Switch>
      </div>
    );
}
