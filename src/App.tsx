import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store, persistor } from './redux/store';
import Dashboard from './components/Dashboard';
import DetailedView from './components/DetailedView';
import './index.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/details/:city" element={<DetailedView />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;