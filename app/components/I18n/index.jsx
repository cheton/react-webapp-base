import React from 'react';
import i18next from 'i18next';
import { I18n, Trans } from 'react-i18next';
import env from 'app/config/env';
import log from 'app/lib/log';
import nodesToString from './nodes-to-string';

export default ({ children, ...props }) => {
    if (typeof children === 'function') {
        children = children(props);
    }

    if (env.NODE_ENV === 'development') {
        // Set log level to trace ('?log_level=trace') when troubleshooting
        const defaultValue = nodesToString('', children, 0);
        log.trace(`I18n: defaultValue=${JSON.stringify(defaultValue)}`);
    }

    return (
        <I18n>
            {(t, { i18n }) => (
                <Trans i18n={i18next} {...props}>
                    {children}
                </Trans>
            )}
        </I18n>
    );
};
