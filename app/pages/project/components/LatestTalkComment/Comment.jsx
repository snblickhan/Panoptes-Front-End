import moment from 'moment';
import React, { PropTypes } from 'react';
import styled from 'styled-components';
import StyledLink from './StyledLink';

const CommentTitle = styled.h2`
  font-size: 26px;
  font-weight: 400;
  line-height: 31px;
  margin: 0 0 10px 0;
`;

const CommentMeta = styled.dl`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  line-height: 17px;
  margin: 0 0 10px 0;

  & dt {
    padding: 0;
    font-weight: bold;
    margin: 0 10px 0 0;
  }

  & dd {
    padding: 0;
    margin: 0 30px 0 0;
  }
`;

const CommentBody = styled.p`
  line-height: 22px;
  margin: 0;
`;

const CommentDate = styled.span`
  color: #11868B;
  text-decoration: none;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-right: 10px;
`;

function Comment({ comment }) {
  const date = moment(comment.date).format('D MMM.');

  return (
    <div>
      <CommentTitle>
        {comment.title}
      </CommentTitle>

      <CommentMeta>
        <dt>
          Posted in
        </dt>
        <dd>
          <StyledLink to={comment.boardLink}>
            {comment.boardTitle}
          </StyledLink>
        </dd>
        <dt>
          Posted by
        </dt>
        <dd>
          <StyledLink to={comment.userLink}>
            {comment.user}
          </StyledLink>
        </dd>
      </CommentMeta>

      <CommentBody>
        <CommentDate>
          {date}
        </CommentDate>
        {comment.body}
      </CommentBody>
    </div>
  );
}

Comment.propTypes = {
  comment: PropTypes.shape({
    boardLink: PropTypes.string,
    boardTitle: PropTypes.string,
    body: PropTypes.string,
    date: PropTypes.string,
    title: PropTypes.string,
    user: PropTypes.string
  })
};

Comment.defaultProps = {
  comment: {
    boardLink: '',
    boardTitle: '',
    body: '',
    date: '',
    title: '',
    user: ''
  }
};

export default Comment;
