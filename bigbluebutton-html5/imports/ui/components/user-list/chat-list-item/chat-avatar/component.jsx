import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from '/imports/ui/components/user-avatar/component';

const propTypes = {
  isModerator: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const defaultProps = {
};

const ChatAvatar = (props) => {
  const {
    color, name, isModerator, fromWhere,
  } = props;
  return (

    <UserAvatar
      moderator={isModerator}
      color={color}
    >
      {' '}
      {fromWhere === 'chatBtn' ? "h":''}
      {name.toLowerCase().slice(0, 2)}
    </UserAvatar>
  );
};

ChatAvatar.propTypes = propTypes;
ChatAvatar.defaultProps = defaultProps;

export default ChatAvatar;
