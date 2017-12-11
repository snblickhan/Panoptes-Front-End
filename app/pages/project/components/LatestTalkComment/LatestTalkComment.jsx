import React, { PropTypes } from 'react';
import styled from 'styled-components';
import StyledLink from './StyledLink';
import Comment from './Comment';

const Container = styled.section`
  background-color: #fff;
  border: 1px solid #E2E5E9;
  color: #4A4A4A;
  padding: 30px;
  font-family: Karla;
  font-size: 14px;
  max-width: 400px;
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

function LatestTalkComment({ comment }) {
  let CommentLink = null;
  let CommentBody = null;

  if (comment && comment.commentLink) {
    CommentLink = (
      <StyledLink to={comment.commentLink}>
        View on Talk
      </StyledLink>
    );
  }

  if (comment) {
    CommentBody = (
      <Comment comment={comment} />
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
      {CommentBody}
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
