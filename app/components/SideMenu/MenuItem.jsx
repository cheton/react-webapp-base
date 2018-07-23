import chainedFunction from 'chained-function';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styles from './index.styl';

class MenuItem extends PureComponent {
    static propTypes = {
        tag: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.string
        ]),

        active: PropTypes.bool,

        disabled: PropTypes.bool,

        onSelect: PropTypes.func,

        divider: PropTypes.bool,

        eventKey: PropTypes.any,

        header: PropTypes.bool,

        onClick: PropTypes.func
    };

    static defaultProps = {
        tag: 'div',
        active: false,
        disabled: false,
        divider: false,
        header: false
    };

    handleClick = (event) => {
        const { disabled, onSelect, eventKey } = this.props;

        if (disabled) {
            event.preventDefault();
            return;
        }

        if (onSelect) {
            onSelect(eventKey, event);
        }
    };

    render() {
        const {
            tag: Component,
            active,
            disabled,
            divider,
            eventKey, // eslint-disable-line
            header,
            onClick,

            className,
            children,
            ...props
        } = this.props;

        if (divider) {
            return (
                <Component
                    {...props}
                    role="separator"
                    className={cx(className, styles.divider)}
                />
            );
        }

        if (header) {
            return (
                <Component
                    {...props}
                    role="heading"
                    className={cx(className, styles.header)}
                >
                    {children}
                </Component>
            );
        }

        return (
            <Component
                {...props}
                className={cx(className, {
                    [styles.menuItem]: true,
                    [styles.active]: active,
                    [styles.disabled]: disabled
                })}
                disabled={disabled}
                role="menuitem"
                tabIndex="-1"
                onClick={chainedFunction(
                    onClick,
                    this.handleClick
                )}
            >
                {children}
            </Component>
        );
    }
}

export default MenuItem;
