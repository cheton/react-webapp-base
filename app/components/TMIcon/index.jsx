import cx from 'classnames';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TMIcon = styled.i.attrs({
    className: props => cx(props.className, 'tmicon', props.name ? `tmicon-${props.name}` : '')
})`
    font-size: 16px;
    vertical-align: sub;
`;

TMIcon.propTypes = {
    name: PropTypes.string
};

export default TMIcon;
