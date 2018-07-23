import React from 'react';
import { Container } from '@trendmicro/react-grid-system';

const FlexContainer = (props) => (
    <Container {...props} layout="flexbox" />
);

FlexContainer.propTypes = Container.propTypes;
FlexContainer.defaultProps = Container.defaultProps;

export default FlexContainer;
