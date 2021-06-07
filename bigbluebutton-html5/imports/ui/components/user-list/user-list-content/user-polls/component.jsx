import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Icon from '/imports/ui/components/icon/component';
import { Session } from 'meteor/session';
import { styles } from '/imports/ui/components/user-list/user-list-content/styles';

const intlMessages = defineMessages({
  pollLabel: {
    id: 'app.poll.pollPaneTitle',
    description: 'label for user-list poll button',
  },
});

class UserPolls extends PureComponent {
  render() {
    const handleClickTogglePoll = () => {
      Session.set(
        'openPanel',
        Session.get('openPanel') === 'poll'
          ? 'userlist'
          : 'poll',
      );
      window.dispatchEvent(new Event('panelChanged'));
    };

    const {
      intl,
      isPresenter,
      pollIsOpen,
      forcePollOpen,
    } = this.props;

    if (!isPresenter) return null;
    if (!pollIsOpen && !forcePollOpen) return null;

    return (
      <div className={styles.messages}>
        <div className={styles.container}>
          <h2 className={styles.smallTitle}>
            {intl.formatMessage(intlMessages.pollLabel)}
          </h2>
        </div>
        <div className={styles.list}>
          <div className={styles.scrollableList}>
            <div
              role="button"
              tabIndex={0}
              className={styles.listItem}
              data-test="pollMenuButton"
              onClick={handleClickTogglePoll}
            >
                      <svg xmlns="http://www.w3.org/2000/svg" width="31.5" height="31.5" viewBox="0 0 31.5 31.5">
                        <path id="Icon_awesome-poll" data-name="Icon awesome-poll" d="M28.125,2.25H3.375A3.376,3.376,0,0,0,0,5.625v24.75A3.376,3.376,0,0,0,3.375,33.75h24.75A3.376,3.376,0,0,0,31.5,30.375V5.625A3.376,3.376,0,0,0,28.125,2.25ZM11.25,25.875A1.125,1.125,0,0,1,10.125,27H7.875A1.125,1.125,0,0,1,6.75,25.875v-9A1.125,1.125,0,0,1,7.875,15.75h2.25a1.125,1.125,0,0,1,1.125,1.125Zm6.75,0A1.125,1.125,0,0,1,16.875,27h-2.25A1.125,1.125,0,0,1,13.5,25.875V10.125A1.125,1.125,0,0,1,14.625,9h2.25A1.125,1.125,0,0,1,18,10.125Zm6.75,0A1.125,1.125,0,0,1,23.625,27h-2.25a1.125,1.125,0,0,1-1.125-1.125v-4.5a1.125,1.125,0,0,1,1.125-1.125h2.25a1.125,1.125,0,0,1,1.125,1.125Z" transform="translate(0 -2.25)" fill="#7080aa"/>
                      </svg>

              <span>{intl.formatMessage(intlMessages.pollLabel)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(UserPolls);

UserPolls.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  isPresenter: PropTypes.bool.isRequired,
  pollIsOpen: PropTypes.bool.isRequired,
  forcePollOpen: PropTypes.bool.isRequired,
};
