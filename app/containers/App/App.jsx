import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import branch from 'recompose/branch';
import renderNothing from 'recompose/renderNothing';
import { bindActionCreators } from 'redux';
import env from 'app/config/env';
import * as actionCreators from './actions';

const App = ({
    match,
    location,
    history
}) => (
    <div>TODO</div>
);

App.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default compose(
    withRouter,
    connect(
        (state, ownProps) => ({ // mapStateToProps
            isAppInitializing: state.container.app.isAppInitializing,
            error: state.container.app.error
        }),
        (dispatch) => ({ // mapDispatchToProps
            action: bindActionCreators(actionCreators, dispatch)
        })
    ),
    withProps(state => ({
        // TODO
    })),
    withHandlers({
        // TODO
    }),
    // Display a loading spinner while initializing the application...
    // loading spinner is hardcoded on the html
    branch(
        ({ isAppInitializing }) => isAppInitializing,
        renderNothing
    ),
    // Render nothing when an unexpected error has occurred
    branch(
        // Production Mode  -> block execution
        // Development Mode -> continue execution
        ({ error }) => error && (env.NODE_ENV !== 'development'),
        () => { /* Sign Out */ }
    ),
    lifecycle({
        componentDidMount() {
            // Remove initial spinner from the DOM
            document.body.removeChild(document.getElementById('app-init-loader'));
        }
    })
)(App);
