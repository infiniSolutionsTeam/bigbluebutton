import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from '/imports/ui/components/user-avatar/component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

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

    <>
      {fromWhere === 'chatBtn' ? 
      // TODO 
        <FontAwesomeIcon icon={faCommentDots} flip="horizontal" size="2x" />
        :
        <UserAvatar
        moderator={isModerator}
        color={color}
      >
        {' '}
        
        {name.toLowerCase().slice(0, 2)}
      </UserAvatar>
      }
    </>
  );
};

ChatAvatar.propTypes = propTypes;
ChatAvatar.defaultProps = defaultProps;

export default ChatAvatar;
