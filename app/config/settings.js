import endsWith from 'lodash/endsWith';
import mapKeys from 'lodash/mapKeys';
import qs from 'qs';
import sha1 from 'sha1';
import log from 'app/lib/log';
import env from 'app/config/env';

const webroot = env.PUBLIC_PATH || '';
const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

const settings = {
    webroot: webroot,
    query: query,
    api: {
        path: (env.NODE_ENV === 'development') ? '/' : '../'
    },
    log: {
        level: (env.NODE_ENV === 'development') ? 'debug' : 'warn' // trace, debug, info, warn, error
    },
    i18next: {
        lowerCaseLng: true,

        // logs out more info (console)
        debug: false,

        // language to lookup key if not found on set language
        fallbackLng: 'en',

        // string or array of namespaces
        ns: [
            'resource' // default
        ],
        // default namespace used if not passed to translation function
        defaultNS: 'resource',

        whitelist: env.LANGUAGES,

        // array of languages to preload
        preload: [],

        // language codes to lookup, given set language is 'en-US':
        // 'all' --> ['en-US', 'en', 'dev']
        // 'currentOnly' --> 'en-US'
        // 'languageOnly' --> 'en'
        load: 'currentOnly',

        // char to separate keys
        keySeparator: '.',

        // char to split namespace from key
        nsSeparator: ':',

        interpolation: {
            prefix: '{{',
            suffix: '}}'
        },

        // react i18next special options (optional)
        react: {
            wait: true,
            hashTransKey: function(defaultValue) {
                // return a key based on defaultValue
                return sha1(defaultValue);
            }
        },

        // options for language detection
        // https://github.com/i18next/i18next-browser-languageDetector
        detection: {
            // order and from where user language should be detected
            order: ['querystring', 'cookie', 'localStorage'],

            // keys or params to lookup language from
            lookupQuerystring: 'lang',
            lookupCookie: 'lang',
            lookupLocalStorage: 'lang',

            // cache user language on
            caches: ['localStorage', 'cookie']
        },
        // options for backend
        // https://github.com/i18next/i18next-xhr-backend
        backend: {
            // path where resources get loaded from
            loadPath: webroot + 'i18n/{{lng}}/{{ns}}.json?_=' + env.BUILD_VERSION,

            // path to post missing resources
            addPath: 'api/i18n/sendMissing/{{lng}}/{{ns}}',

            // your backend server supports multiloading
            // /locales/resources.json?lng=de+en&ns=ns1+ns2
            allowMultiLoading: false,

            // parse data after it has been fetched
            parse: function(data, url) {
                data = JSON.parse(data);

                log.debug(`Loading resource: url="${url}"`, data);

                if (endsWith(url, '/resource.json?_=' + env.BUILD_VERSION)) {
                    const value = mapKeys(data, (value, key) => sha1(key));
                    return value;
                }

                return data;
            },

            // allow cross domain requests
            crossDomain: false
        }
    }
};

export default settings;
