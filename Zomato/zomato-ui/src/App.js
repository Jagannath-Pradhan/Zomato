import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './components/home/Home';
// import Filter from './components/filter/Filter';
import Details from './components/details/Details';
import Header from './components/Header';
import Footer from './components/Footer';

import Filter1 from './components/filter/Filter1';
function Router() {
    return (
        <BrowserRouter>
            <Header />
            <Route exact path="/" component={Home} />
            {/* <Route path="/filter" component={Filter} /> */}
            <Route path="/details" component={Details} />

            <Route path="/filter" component={Filter1} />
        </BrowserRouter>
    )
}
export default Router;
