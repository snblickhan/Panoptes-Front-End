import React, { Component, PropTypes } from 'react';

import LatestTalkComment from './LatestTalkComment';
import getLatestComment from './getLatestComment';

class LatestTalkCommentContainer extends Component {
  constructor(props) {
    super(props);
    this.getLatestComment = this.getLatestComment.bind(this);
    this.state = {
      comment: undefined,
      loading: false
    };
  }

  componentDidMount() {
    this.getLatestComment();
  }

  getLatestComment() {
    this.setState({ loading: true });
    return getLatestComment(this.props.project)
      .then((comment) => {
        this.setState({
          comment,
          loading: false
        });
      })
      .catch((error) => {

      });
  }

  render() {
    const { comment, loading } = this.state;
    return (
      <LatestTalkComment comment={comment} loading={loading} />
    );
  }
}

LatestTalkCommentContainer.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string
  })
};

LatestTalkCommentContainer.defaultProps = {
  project: {
    id: ''
  }
};

export default LatestTalkCommentContainer;
