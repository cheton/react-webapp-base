import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as GridSystemProvider } from 'app/components/GridSystem';
import App from './containers/App';
import store from './store';
import './styles/app.styl';
import './polyfill';

ReactDOM.render(
    <HashRouter>
        <ReduxProvider store={store}>
            <GridSystemProvider
                breakpoints={[576, 768, 992, 1200, 1600]}
                containerWidths={[540, 720, 960, 1140]}
                columns={12}
                gutterWidth={0}
                layout="floats"
            >
                <App />
            </GridSystemProvider>
        </ReduxProvider>
    </HashRouter>,
    document.querySelector('#viewport')
);
