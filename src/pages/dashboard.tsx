import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { PlayPage } from './play';

import { ProfilePage } from './profile';
import {useSelector} from "react-redux";
import {selectAccountInfo} from "../store/selector";

export const Dashboard = () => {
    const accountInfo = useSelector(selectAccountInfo);

    let mainPage = ProfilePage;
    return (
      <div className="w-full h-full flex-1">
        <Switch>
          <Route path="/profile" component={mainPage} />
          <Route path="/play" component={PlayPage} />
          <Redirect to="/profile" />
        </Switch>
      </div>
    );
}
