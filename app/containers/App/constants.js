import constants from 'namespace-constants';
import uuid from 'uuid';

module.exports = {
    ...constants(uuid.v4(), [
        'APP_INIT',
        'APP_INIT_SUCCESS',
        'APP_INIT_FAILURE'
    ])
};
