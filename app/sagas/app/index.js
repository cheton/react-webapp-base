/* eslint import/no-dynamic-require: 0 */
import _get from 'lodash/get';
import moment from 'moment';
import { all, call, fork, put, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { TRACE, DEBUG, INFO, WARN, ERROR } from 'universal-logger';
import settings from 'app/config/settings';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';
import i18next from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import * as action from 'app/containers/App/actions';
import log from 'app/lib/log';

export function* init() {
    yield put(action.appInit());
    try {
        const { timeout } = yield race({
            appInit: call(appInitAll),
            timeout: call(delay, 15000) // timeout threshold 15 sec
        });

        /**
         * TODO: Redirect to signout or error page
         * 1. 15 seconds timeout
         * 2. invalid token
         */
        if (timeout) {
            throw new Error('Timeout Error');
        }
        yield put(action.appInitSuccess());
    } catch (error) {
        const errorMessage = _get(error, 'message', error);
        yield put(action.appInitFailure(errorMessage));
    } finally {
        // Prevent browser from loading a drag-and-dropped file
        // http://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
        window.addEventListener('dragover', (event) => {
            event.preventDefault();
        }, false);
        window.addEventListener('drop', (event) => {
            event.preventDefault();
        }, false);
    }
}

export function* process() {
    yield all([
    ]);
}

function* appInitAll() {
    try {
        // sequential
        yield call(configureLogLevel);
        yield call(configureI18N);

        // parallel
        yield all([
            fork(configureMomentLocale), // dep: i18next
        ]);
    } catch (error) {
        throw new Error(error);
    }
}

const configureLogLevel = () => {
    const level = {
        trace: TRACE,
        debug: DEBUG,
        info: INFO,
        warn: WARN,
        error: ERROR
    }[settings.query.log_level || settings.log.level];
    log.setLevel(level);

    let msg = [
        'version=' + settings.version,
        'webroot=' + settings.webroot
    ];
    log.info(msg.join(','));
};

const configureI18N = () => new Promise((resolve, reject) => {
    i18next
        .use(XHR)
        .use(LanguageDetector)
        .use(reactI18nextModule)
        .init(settings.i18next, (err, t) => {
            if (err) {
                reject(err);
                return;
            }

            if (i18next.language) {
                const html = document.querySelector('html');
                html.setAttribute('lang', i18next.language);
            }

            resolve();
        });
});

const configureMomentLocale = () => new Promise(resolve => {
    const lng = i18next.language;

    if (!lng || lng === 'en') {
        log.debug(`moment: lng=${lng}`);
        resolve();
        return;
    }

    const bundle = require('bundle-loader!moment/locale/' + lng);
    bundle(() => {
        log.debug(`moment: lng=${lng}`);
        moment().locale(lng);

        resolve();
    });
});
