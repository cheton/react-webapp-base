import '@trendmicro/react-modal/dist/react-modal.css';
import React from 'react';
import Modal from '@trendmicro/react-modal';

const ModalTitle = Modal.Title;
const Title = (props) => {
    const { style, children, ...otherProps } = props;
    const newStyle = {
        ...style,
        fontFamily: 'Interstate-Light'
    };

    return (
        <ModalTitle
            style={newStyle}
            {...otherProps}
        >
            {children}
        </ModalTitle>
    );
};
Title.propTypes = ModalTitle.propTypes;
Title.defaultProps = ModalTitle.defaultProps;

Modal.Title = Title;

export default Modal;
