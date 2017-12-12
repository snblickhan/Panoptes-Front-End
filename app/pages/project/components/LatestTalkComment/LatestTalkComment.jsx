import React, { PropTypes } from 'react';
import styled from 'styled-components';
import Loader from 'halogen/PulseLoader';
import StyledLink from './StyledLink';
import Comment from './Comment';
import { CSSTransitionGroup } from 'react-transition-group'

const Container = styled.section`
  background-color: #fff;
  border: 1px solid #E2E5E9;
  color: #4A4A4A;
  padding: 30px;
  font-family: Karla;
  font-size: 14px;
  max-width: 400px;

  & .latest-comment-enter {
    opacity: 0.01;
  }

  & .latest-comment-leave {
    opacity: 1;
  }

  & .latest-comment-enter.latest-comment-enter-active {
    opacity: 1;
    transition: opacity 500000ms ease-in;
  }

  & .latest-comment-leave.latest-comment-leave-active {
    opacity: 0.01;
    transition: opacity 300000ms ease-in;
  }
`;

const Title = styled.h1`
  font-size: 14px;
`;

const Header = styled.header`
  color: #000;
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
`;

const CommentLoader = styled(Loader).attrs({
  color: '#00979D',
  size: '16px',
  margin: '4px'
})`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
`;

const CommentBodyWrapper = styled.div`
  position: relative;
  min-height: 30px;
`;

function LatestTalkComment({ comment }) {
  let CommentLink = null;
  let CommentBody = <CommentLoader key="commentLoader" />;

  if (comment && comment.commentLink) {
    CommentLink = (
      <StyledLink to={comment.commentLink}>
        View on Talk
      </StyledLink>
    );
  }

  if (comment) {
    CommentBody = (
      <Comment comment={comment} key="comment" />
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          Latest Talk Comment
        </Title>
        {CommentLink}
      </Header>
      <CommentBodyWrapper key="comment-body-wrapper">
        <CSSTransitionGroup
          transitionName="latest-comment"
          transitionEnterTimeout={500000}
          transitionLeaveTimeout={300000}
        >
          {CommentBody}
        </CSSTransitionGroup>
      </CommentBodyWrapper>
    </Container>
  );
}

LatestTalkComment.propTypes = {
  comment: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      commentLink: PropTypes.string
    })
  ])
};

LatestTalkComment.defaultProps = {
  comment: false
};

export default LatestTalkComment;
