import App from './App.js';

// React and ReactDOM are available globally from CDN
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  React.createElement(React.StrictMode, null, 
    React.createElement(App)
  )
);
