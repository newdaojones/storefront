import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {ProfilePage} from "./profile";
import {SettingsPage} from "./settings";
import {FindPage} from "./find";

/**
 * http://localhost:3000/storefront/merchant
 * @constructor
 */
export const MerchantDashboard = () => {
    let mainPage = ProfilePage;
    return (
      <div className="w-full h-full flex-1">
        <Switch>
          <Route path="/merchant/profile" component={mainPage} />
          <Route path="/merchant/settings" component={SettingsPage} />
            <Route path="/merchant/find" component={FindPage} />
          <Redirect to="/merchant/profile" />
        </Switch>
      </div>
    );
}
