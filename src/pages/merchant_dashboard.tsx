import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {ProfilePage} from "./profile";

/**
 * http://localhost:3000/storefront/merchant
 * @constructor
 */
export const MerchantDashboard = () => {
    let mainPage = ProfilePage;

    console.info(`loading MerchantDashboard`);

    return (
      <div className="w-full h-full flex-1">
        <Switch>
          <Route path="/merchant/profile" component={mainPage} />
          <Redirect to="/merchant/profile" />
        </Switch>
      </div>
    );
}
