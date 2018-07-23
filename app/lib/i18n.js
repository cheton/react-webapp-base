/* eslint no-underscore-dangle: 0 */
import i18next from 'i18next';
import sha1 from 'sha1';

const t = (...args) => {
    const key = args[0];
    const options = args[1];

    let text = i18next.t(key, options);
    if (typeof text === 'string' && text.length === 0) {
        text = i18next.t(key, { ...options, lng: 'en' });
    }

    return text;
};

const _ = (...args) => {
    if ((args.length === 0) || (typeof args[0] === 'undefined')) {
        return i18next.t.apply(i18next, args);
    }

    const [value = '', options = {}] = args;
    const key = ((value, options) => {
        const { context } = { ...options };
        const containsContext = (context !== undefined) && (context !== null);
        if (containsContext) {
            value = value + i18next.options.contextSeparator + options.context;
        }
        return sha1(value);
    })(value, options);

    options.defaultValue = value;
    options.interpolation = {
        ...options.interpolation,
        escapeValue: false
    };


    let text = i18next.t(key, options);
    if (typeof text !== 'string' || text.length === 0) {
        text = i18next.t(key, { ...options, lng: 'en' });
    }

    return text;
};

const __ = (...args) => {
    if ((args.length === 0) || (typeof args[0] === 'undefined')) {
        return i18next.t.apply(i18next, args);
    }

    const value = args[0];
    const options = {
        ...args[1],
        ...{
            interpolation: {
                prefix: '#$?',
                suffix: '?$#'
            }
        }
    };

    return _(value, options);
};

export default {
    t,
    _,
    __
};
