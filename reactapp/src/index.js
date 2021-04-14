import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import reducer from './reducer';
import { BrowserRouter} from 'react-router-dom';
import "./App.css";

//import {IntlProvider} from 'react-intl';
//import Russian from './lang/ru.json';
//import English from './lang/en.json';
const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store = {store}> 
        <BrowserRouter>
            <App />
        </BrowserRouter>    
    </Provider>
    , document.getElementById('root')
);

/*
const locale = navigator.language;
let lang;
if (locale==="ru") {
   lang = Russian;
} else {
    lang = English;
}
<IntlProvider locale ={locale} messages={lang}>
<App />
</IntlProvider>*/



// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );*/
