import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import cx from 'classnames';
import { withModalMounter } from '/imports/ui/components/modal/service';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { defineMessages, injectIntl } from 'react-intl';
import Icon from '../icon/component';
import { styles } from './styles.scss';
import Button from '/imports/ui/components/button/component';
import RecordingIndicator from './recording-indicator/container';
import TalkingIndicatorContainer from '/imports/ui/components/nav-bar/talking-indicator/container';
import ConnectionStatusButton from '/imports/ui/components/connection-status/button/container';
import ConnectionStatusService from '/imports/ui/components/connection-status/service';
import SettingsDropdownContainer from './settings-dropdown/container';

const intlMessages = defineMessages({
  toggleUserListLabel: {
    id: 'app.navBar.userListToggleBtnLabel',
    description: 'Toggle button label',
  },
  toggleUserListAria: {
    id: 'app.navBar.toggleUserList.ariaLabel',
    description: 'description of the lists inside the userlist',
  },
  newMessages: {
    id: 'app.navBar.toggleUserList.newMessages',
    description: 'label for toggleUserList btn when showing red notification',
  },
});

const propTypes = {
  presentationTitle: PropTypes.string,
  hasUnreadMessages: PropTypes.bool,
  shortcuts: PropTypes.string,
};

const defaultProps = {
  presentationTitle: 'Default Room Title',
  hasUnreadMessages: false,
  shortcuts: '',
};

class NavBar extends Component {
  static handleToggleUserList() {
    Session.set(
      'openPanel',
      Session.get('openPanel') !== ''
        ? ''
        : 'userlist',
    );
    Session.set('idChatOpen', '');

    window.dispatchEvent(new Event('panelChanged'));
  }

  componentDidMount() {
    const {
      processOutsideToggleRecording,
      connectRecordingObserver,
    } = this.props;

    if (Meteor.settings.public.allowOutsideCommands.toggleRecording
      || getFromUserSettings('bbb_outside_toggle_recording', false)) {
      connectRecordingObserver();
      window.addEventListener('message', processOutsideToggleRecording);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {
      hasUnreadMessages,
      hasUnreadNotes,
      isExpanded,
      intl,
      shortcuts: TOGGLE_USERLIST_AK,
      mountModal,
      presentationTitle,
      amIModerator,
    } = this.props;

    const hasNotification = hasUnreadMessages || hasUnreadNotes;
    const toggleBtnClasses = {};
    toggleBtnClasses[styles.btn] = true;
    toggleBtnClasses[styles.btnWithNotificationDot] = hasNotification;

    let ariaLabel = intl.formatMessage(intlMessages.toggleUserListAria);
    ariaLabel += hasNotification ? (` ${intl.formatMessage(intlMessages.newMessages)}`) : '';

    return (
      <div
        className={styles.navbar}
      >
        <div className={styles.top}>
          <div className={styles.left}>
            {!isExpanded ? null
              : <Icon iconName="left_arrow" className={styles.arrowLeft} />
            }
            <Button
              onClick={NavBar.handleToggleUserList}
              ghost
              circle
              hideLabel
              data-test={hasNotification ? 'hasUnreadMessages' : null}
              label={intl.formatMessage(intlMessages.toggleUserListLabel)}
              aria-label={ariaLabel}
              icon="user"
              className={cx(toggleBtnClasses)}
              aria-expanded={isExpanded}
              accessKey={TOGGLE_USERLIST_AK}
            />
            {isExpanded ? null
              : <Icon iconName="right_arrow" className={styles.arrowRight} />
            }
          </div>
          <div  className={styles.leftMobile}>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="27" height="26" viewBox="0 0 27 26">
              <defs>
                <pattern id="pattern" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 601 572">
                  <image width="601" height="572" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlkAAAI8EAYAAACSUWLtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAPYQAAD2EAdWsr3QAAAliaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0OCA3OS4xNjQwMzYsIDIwMTkvMDgvMTMtMDE6MDY6NTcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA0LTE2VDAzOjEwOjI3KzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTA0LTIzVDAyOjI3OjUzKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wNC0yM1QwMjoyNzo1MyswNTozMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTJjZDBlMGYtYWI5OS1hNjQyLWJkYWQtOGNkNjE3N2RlYmJmIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWI4YzIzODItZDk1OS0wZDRkLWJkZTQtNjgwODE1YTdlN2ZmIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTU0NjhhOTQtMjY4NC0xNTRjLWE1YTEtMGNkNDU1MDg2ZjBkIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NTQ2OGE5NC0yNjg0LTE1NGMtYTVhMS0wY2Q0NTUwODZmMGQiIHN0RXZ0OndoZW49IjIwMjEtMDQtMTZUMDM6MTA6MjcrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MWE3YjRkNzQtOGY4MS04NDQ5LWFjMzctOGY5Mjk3YThmNDc2IiBzdEV2dDp3aGVuPSIyMDIxLTA0LTE2VDAzOjExOjU2KzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmExODc5MTg3LTYwM2EtMDQ0Zi05M2JhLTViZjNjYTQ4ZmIzNSIgc3RFdnQ6d2hlbj0iMjAyMS0wNC0yM1QwMjoyNzo1MyswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMmNkMGUwZi1hYjk5LWE2NDItYmRhZC04Y2Q2MTc3ZGViYmYiIHN0RXZ0OndoZW49IjIwMjEtMDQtMjNUMDI6Mjc6NTMrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YTE4NzkxODctNjAzYS0wNDRmLTkzYmEtNWJmM2NhNDhmYjM1IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDdmZjM5NGItZTQ0MS01MDQwLWFiNTMtNmE1NGRkMjJjZTFjIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTU0NjhhOTQtMjY4NC0xNTRjLWE1YTEtMGNkNDU1MDg2ZjBkIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+kUMPygAAACF0RVh0Q3JlYXRpb24gVGltZQAyMDIxOjA0OjIzIDAyOjI3OjU2XAn4wAAAG3dJREFUeF7t3cl6G7e2gNGjzPz+D5uhbqxLJrbMpshCs5u1JvrkKYvAxk9Q/h8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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"/>
                </pattern>
              </defs>
              <rect id="Iris_Logo_Without_B_white" data-name="Iris Logo Without B white" width="27" height="26" opacity="0.3" fill="url(#pattern)"/>
            </svg>
          </div>
          <div className={styles.center}>
            <div className={styles.recordDiv}>
              <h1 className={styles.presentationTitle}>{presentationTitle}</h1>

              <RecordingIndicator
                mountModal={mountModal}
                amIModerator={amIModerator}
              />
            </div>
          </div>
          <div className={styles.right}>
            {ConnectionStatusService.isEnabled() ? <ConnectionStatusButton /> : null}
            <SettingsDropdownContainer amIModerator={amIModerator}/>
          </div>
        </div>
        <div className={styles.bottom}>
          <TalkingIndicatorContainer amIModerator={amIModerator} />
        </div>
      </div>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;
export default withShortcutHelper(withModalMounter(injectIntl(NavBar)), 'toggleUserList');
