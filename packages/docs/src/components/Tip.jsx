import React from 'react';
import { styled } from 'storybook/theming';

const theme = {
  info: {
    backgroundColor: '#f0f8ff',
    borderColor: '#4994fc',
    color: '#002760',
    titleColor: '#0955c9',
  },
  warning: {
    backgroundColor: '#fffcdf',
    borderColor: '#f7c735',
    color: '#784618',
    titleColor: '#b47921',
  },
};

const Container = styled.div`
  background-color: ${(props) => theme[props.color].backgroundColor};
  border-left: 5px solid ${(props) => theme[props.color].borderColor};
  color: ${(props) => theme[props.color].color};
  margin-bottom: 24px;
  padding: 10px 15px;
`;

const Title = styled.div`
  color: ${(props) => theme[props.color].titleColor};
  font-size: 18px;
  margin-bottom: 5px;
`;

const Content = styled.div`
  p:first-child {
    margin-top: 0;
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

export class Tip extends React.Component {
  render() {
    const { title, color = 'info', children } = this.props;

    return (
      <Container color={color}>
        {title && <Title color={color}>{title}</Title>}
        <Content>{children}</Content>
      </Container>
    );
  }
}
