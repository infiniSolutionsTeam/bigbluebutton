import React from 'react';
import PropTypes from 'prop-types';
import Icon from '/imports/ui/components/icon/component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { styles } from './styles';


const propTypes = {
  icon: PropTypes.string.isRequired,
};

const defaultProps = {
};

const ChatIcon = props => (
  <div className={styles.chatThumbnail}>
    {/* TODO icon here */}
    <FontAwesomeIcon icon={faCommentDots} flip="horizontal" />
    {/* <Icon iconName={props.icon} /><i class="fas fa-comment-dots"></i> */}
  </div>
);

ChatIcon.propTypes = propTypes;
ChatIcon.defaultProps = defaultProps;

export default ChatIcon;
