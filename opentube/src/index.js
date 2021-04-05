import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {IntlProvider} from 'react-intl';
import Russian from './lang/ru.json';
import English from './lang/en.json';

const locale = navigator.language;

let lang;
if (locale==="ru") {
   lang = Russian;
} else {
    lang = English;
}
ReactDOM.render(
   <IntlProvider locale ={locale} messages={Russian}>
       <App />
   </IntlProvider>,
   document.getElementById('root')
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
