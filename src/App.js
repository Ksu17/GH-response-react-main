import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SearchPage from './components/pages/SearchPage';
import RepositoryPage from './components/pages/RepositoryPage';
import store, {persistor} from './store';
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import Page404 from "./components/pages/Page404";

const App = () => {
  return (
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Routes>
                  <Route path="/" element={<SearchPage/>} />
                  <Route path="/repository/:owner/:id" element={<RepositoryPage/>} />
                  <Route path="*" element={<Page404/>} />
              </Routes>
            </PersistGate>
        </Provider>
    </BrowserRouter>
  );
};

export default App;
