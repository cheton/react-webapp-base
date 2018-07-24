const path = require('path');

module.exports = {
    'extends': 'trendmicro',
    'parser': 'babel-eslint',
    'env': {
        'browser': true,
        'node': true
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: {
                    resolve: {
                        modules: [
                            path.resolve(__dirname),
                            'node_modules'
                        ],
                        extensions: ['.js', '.jsx']
                    }
                }
            }
        }
    },
    'rules': {
        'react/jsx-wrap-multilines': 0
    }
}
