/* eslint no-console: 0 */
/* eslint strict: 0 */
const fs = require('fs');
const chalk = require('chalk');
const languages = require('./build.config').languages;

module.exports = {
    src: [
        'app/**/*.{html,js,jsx}',
        // Use ! to filter out files or directories
        '!app/**/*.spec.{js,jsx}',
        '!app/i18n/**',
        '!test/**',
        '!**/node_modules/**'
    ],
    dest: './',
    options: {
        debug: false,
        removeUnusedKeys: true,
        sort: false,
        lngs: languages,
        func: {
            list: [], // Use an empty array to bypass the default list: i18n.t, i18next.t
            extensions: ['.js', '.jsx']
        },
        trans: {
            component: 'I18n',
            i18nKey: 'i18nKey',
            extensions: ['.js', '.jsx'],
            fallbackKey: function(ns, value) {
                return value;
            }
        },
        defaultValue: (lng, ns, key) => {
            if (lng === 'en') {
                return key; // Use key as value for base language
            }
            return ''; // Return empty string for other languages
        },
        ns: [
            'resource' // default
        ],
        defaultNs: 'resource',
        resource: {
            loadPath: 'app/i18n/{{lng}}/{{ns}}.json',
            savePath: 'app/i18n/{{lng}}/{{ns}}.json', // or 'app/i18n/${lng}/${ns}.saveAll.json'
            jsonIndent: 4
        },
        nsSeparator: ':', // namespace separator
        keySeparator: '.', // key separator
        plural: false, // No plural form keys
        interpolation: {
            prefix: '{{',
            suffix: '}}'
        }
    },
    transform: function(file, enc, done) {
        'use strict';

        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);
        let count = 0;

        parser.parseFuncFromString(content, { list: ['i18n._', 'i18n.__'] }, (key, options) => {
            parser.set(key, Object.assign({}, options, {
                nsSeparator: false,
                keySeparator: false
            }));
            ++count;
        });

        if (count > 0) {
            console.log(`[i18next-scanner] transform: count=${chalk.cyan(count)}, file=${chalk.yellow(JSON.stringify(file.relative))}`);
        }

        done();
    }
};
