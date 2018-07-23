import chainedFunction from 'chained-function';
import cx from 'classnames';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { cloneElement, PureComponent } from 'react';
import MenuItem from './MenuItem';
import match from './match-component';
import styles from './index.styl';

const isMenuItem = match(MenuItem);

const SideMenuWrap = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

class SideMenu extends PureComponent {
    static propTypes = {
        tag: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.string
        ]),

        activeKey: PropTypes.any,
        onSelect: PropTypes.func,
        title: PropTypes.string
    }

    static defaultProps = {
        tag: 'div'
    };

    isActive = ({ props }, activeKey) => {
        if (props.active) {
            return true;
        }

        if (activeKey !== undefined && activeKey !== null && props.eventKey === activeKey) {
            return true;
        }

        return false;
    };

    render() {
        const {
            tag: Component,
            activeKey,
            onSelect,
            title,
            children,
            className,
            ...props
        } = this.props;

        return (
            <SideMenuWrap>
                {title &&
                    <Component
                        {...props}
                        role="heading"
                        className={cx(styles.sideMenuTitle)}
                    >
                        {title}
                    </Component>
                }
                <Component
                    {...props}
                    role="menu"
                    className={cx(className, styles.sideMenu)}
                >
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child) && isMenuItem(child)) {
                            return cloneElement(child, {
                                active: this.isActive(child, activeKey),
                                onSelect: chainedFunction(
                                    child.props.onSelect,
                                    onSelect
                                )
                            });
                        }

                        return child;
                    })}
                </Component>
            </SideMenuWrap>
        );
    }
}

export default SideMenu;
