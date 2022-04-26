import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { PlayPage } from './play';

import { ProfilePage } from './profile';
import {useSelector} from "react-redux";
import {selectAccountInfo} from "../store/selector";
import {ScanPage} from "./scan";
import {BuyPage} from "./buy";

export const Dashboard = () => {
    const accountInfo = useSelector(selectAccountInfo);

    let mainPage = ProfilePage;
    return (
      <div className="w-full h-full flex-1">
        <Switch>
          <Route path="/profile" component={mainPage} />
          <Route path="/play" component={PlayPage} />
          <Route path="/scan" component={ScanPage} />
            <Route path="/buy" component={BuyPage} />
          <Redirect to="/profile" />
        </Switch>
      </div>
    );
}
