import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import { Session } from 'meteor/session';
import _ from 'lodash';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import { styles } from './styles';
import ChatAvatar from './chat-avatar/component';
import ChatIcon from './chat-icon/component';
import ChatUnreadCounter from './chat-unread-messages/component';

const DEBOUNCE_TIME = 1000;
const CHAT_CONFIG = Meteor.settings.public.chat;
const PUBLIC_CHAT_KEY = CHAT_CONFIG.public_id;

let globalAppplyStateToProps = ()=>{};

const throttledFunc = _.debounce(() => {
  globalAppplyStateToProps();
}, DEBOUNCE_TIME, { trailing: true, leading: true });

const intlMessages = defineMessages({
  titlePublic: {
    id: 'app.chat.titlePublic',
    description: 'title for public chat',
  },
  unreadPlural: {
    id: 'app.userList.chatListItem.unreadPlural',
    description: 'singular aria label for new message',
  },
  unreadSingular: {
    id: 'app.userList.chatListItem.unreadSingular',
    description: 'plural aria label for new messages',
  },
});

const propTypes = {
  chat: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    unreadCounter: PropTypes.number.isRequired,
  }).isRequired,
  activeChatId: PropTypes.string.isRequired,
  compact: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  tabIndex: PropTypes.number.isRequired,
  isPublicChat: PropTypes.func.isRequired,
  chatPanelOpen: PropTypes.bool.isRequired,
  shortcuts: PropTypes.string,
};

const defaultProps = {
  shortcuts: '',
};

const handleClickToggleChat = (id) => {
  Session.set(
    'openPanel',
    Session.get('openPanel') === 'chat' && Session.get('idChatOpen') === id
      ? 'userlist' : 'chat',
  );
  if (Session.equals('openPanel', 'chat')) {
    Session.set('idChatOpen', id);
  } else {
    Session.set('idChatOpen', '');
  }
  window.dispatchEvent(new Event('panelChanged'));
};

const ChatListItem = (props) => {
  const {
    chat,
    activeChatId,
    compact,
    intl,
    tabIndex,
    isPublicChat,
    shortcuts: TOGGLE_CHAT_PUB_AK,
    chatPanelOpen,
  } = props;

  const isCurrentChat = chat.chatId === activeChatId && chatPanelOpen;
  const linkClasses = {};

  linkClasses[styles.active] = isCurrentChat;

  const [stateUreadCount, setStateUreadCount] = useState(0);

  if (chat.unreadCounter !== stateUreadCount && (stateUreadCount < chat.unreadCounter)) {
    globalAppplyStateToProps = () => {
      setStateUreadCount(chat.unreadCounter);
    };
    throttledFunc();
  } else if (chat.unreadCounter !== stateUreadCount && (stateUreadCount > chat.unreadCounter)) {
    setStateUreadCount(chat.unreadCounter);
  }

  useEffect(() => {
    if (chat.userId !== PUBLIC_CHAT_KEY && chat.userId === activeChatId) {
      Session.set('idChatOpen', chat.chatId);
    }
  }, [activeChatId]);

  return (
    <div
      data-test="chatButton"
      role="button"
      className={cx(styles.chatListItem, linkClasses)}
      aria-expanded={isCurrentChat}
      tabIndex={tabIndex}
      accessKey={isPublicChat(chat) ? TOGGLE_CHAT_PUB_AK : null}
      onClick={() => handleClickToggleChat(chat.chatId)}
      id="chat-toggle-button"
      aria-label={isPublicChat(chat) ? intl.formatMessage(intlMessages.titlePublic) : chat.name}
    >

      <div className={styles.chatListItemLink}>
        <div className={styles.chatIcon}>
          {chat.icon
            ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                <path id="Icon_feather-message-square" data-name="Icon feather-message-square" d="M31.5,22.5a3,3,0,0,1-3,3h-18l-6,6V7.5a3,3,0,0,1,3-3h21a3,3,0,0,1,3,3Z" transform="translate(-3 -3)" fill="none" stroke="#7080aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
              </svg>

            )
            : (
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                <path id="Icon_material-person" data-name="Icon material-person" d="M18.5,18.5a6.25,6.25,0,1,0-6.25-6.25A6.248,6.248,0,0,0,18.5,18.5Zm0,3.125c-4.172,0-12.5,2.094-12.5,6.25V31H31V27.875C31,23.719,22.672,21.625,18.5,21.625Z" transform="translate(-6 -6)" fill="#7080aa"/>
              </svg>

            )}
        </div>
        <div className={styles.chatName}>
          {!compact
            ? (
              <span className={styles.chatNameMain}>
                {isPublicChat(chat)
                  ? intl.formatMessage(intlMessages.titlePublic) : chat.name}
              </span>
            ) : null}
        </div>
        {(stateUreadCount > 0)
          ? (
            <ChatUnreadCounter
              counter={stateUreadCount}
            />
          )
          : null}
      </div>
    </div>
  );
};

ChatListItem.propTypes = propTypes;
ChatListItem.defaultProps = defaultProps;

export default withShortcutHelper(injectIntl(ChatListItem), 'togglePublicChat');
