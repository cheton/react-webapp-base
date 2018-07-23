import { createReducer } from 'redux-action';
import {
    APP_INIT,
    APP_INIT_SUCCESS,
    APP_INIT_FAILURE
} from './constants';

const initialState = {
    isAppInitializing: true,
    error: null
};

export default createReducer(initialState, {
    [APP_INIT]: () => ({
        isAppInitializing: true
    }),
    [APP_INIT_SUCCESS]: () => ({
        isAppInitializing: false,
        error: null
    }),
    [APP_INIT_FAILURE]: (error) => ({
        isAppInitializing: false,
        error
    })
});
