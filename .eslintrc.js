const path = require('path');

module.exports = {
    'extends': 'trendmicro',
    'parser': 'babel-eslint',
    'env': {
        'browser': true,
        'node': true
    },
    'settings': {
        'import/resolver': {
            'webpack': {
                'config': path.resolve(__dirname, 'webpack.config.rules.js')
            }
        }
    },
    'rules': {
        'react/jsx-wrap-multilines': 0
    }
}
