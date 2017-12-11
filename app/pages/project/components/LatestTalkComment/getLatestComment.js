import _ from 'lodash';
import moment from 'moment';
import talkClient from 'panoptes-client/lib/talk-client';

function getProjectBoards(projectId) {
  return talkClient.type('boards')
    .get({
      section: `project-${projectId}`
    })
    .catch(error => error);
}

function getLatestCommentDate(board) {
  const path = 'latest_discussion.latest_comment.created_at';
  const date = _.get(board, path, false);

  return (date) ? moment(date) : false;
}

function selectBoardWithLatestComment(boards) {
  return boards.reduce((currentLatest, board) => {
    if (!currentLatest) {
      return board;
    }

    const boardDate = getLatestCommentDate(board);
    const currentLatestDate = getLatestCommentDate(currentLatest);
    return (boardDate.isAfter(currentLatestDate)) ? board : currentLatest;
  });
}

const createBoardLink = ({ project_slug, board_id }) =>
  `/projects/${project_slug}/talk/${board_id}`;

const createCommentLink = ({ project_slug, board_id, discussion_id, id }) =>
  `/projects/${project_slug}/talk/${board_id}/${discussion_id}?comment=${id}`;

const createUserLink = ({ project_slug, user_login }) =>
  `/projects/${project_slug}/users/${user_login}`;

function getLatestCommentData(board) {
  const comment = board.latest_discussion.latest_comment;

  const {
    board_title,
    discussion_title,
    body,
    user_display_name,
    updated_at
  } = comment;

  return {
    boardLink: createBoardLink(comment),
    boardTitle: board_title,
    body,
    commentLink: createCommentLink(comment),
    date: updated_at,
    title: discussion_title,
    user: user_display_name,
    userLink: createUserLink(comment)
  };
}

function getLatestComment({ id }) {
  return getProjectBoards(id)
    .then(selectBoardWithLatestComment)
    .then(getLatestCommentData)
    .catch((error) => {
      console.error('Error fetching project boards', error);
      return error;
    });
}

export default getLatestComment;
