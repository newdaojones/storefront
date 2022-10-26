import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {PlayPage} from './play';

import {HomePage} from './home';
import {ScanPage} from "./scan";
import {BuyPage} from "./buy";
import {ConfirmationPage} from "./confirmation";

export const Dashboard = () => {
    console.info(`loading dashboard`);

    const mainPage = HomePage;
    return (
      <div className="w-full h-full flex-1">
        <Switch>
          <Route path="/storefront/home" component={mainPage} />
          <Route path="/storefront/play" component={PlayPage} />
          <Route path="/storefront/scan" component={ScanPage} />
          <Route path="/storefront/buy" component={BuyPage} />
          <Route path="/storefront/confirmation" component={ConfirmationPage} />
          <Redirect to="/storefront/home" />
        </Switch>
      </div>
    );
}
