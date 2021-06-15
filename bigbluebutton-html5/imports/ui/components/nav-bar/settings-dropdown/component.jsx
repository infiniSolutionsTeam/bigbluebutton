import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withModalMounter } from '/imports/ui/components/modal/service';
import EndMeetingConfirmationContainer from '/imports/ui/components/end-meeting-confirmation/container';
import { makeCall } from '/imports/ui/services/api';
import AboutContainer from '/imports/ui/components/about/container';
import SettingsMenuContainer from '/imports/ui/components/settings/container';
import Button from '/imports/ui/components/button/component';
import Dropdown from '/imports/ui/components/dropdown/component';
import DropdownTrigger from '/imports/ui/components/dropdown/trigger/component';
import DropdownContent from '/imports/ui/components/dropdown/content/component';
import DropdownList from '/imports/ui/components/dropdown/list/component';
import DropdownListItem from '/imports/ui/components/dropdown/list/item/component';
import DropdownListSeparator from '/imports/ui/components/dropdown/list/separator/component';
import ShortcutHelpComponent from '/imports/ui/components/shortcut-help/component';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import FullscreenService from '../../fullscreen-button/service';

import { styles } from '../styles';

const intlMessages = defineMessages({
  optionsLabel: {
    id: 'app.navBar.settingsDropdown.optionsLabel',
    description: 'Options button label',
  },
  fullscreenLabel: {
    id: 'app.navBar.settingsDropdown.fullscreenLabel',
    description: 'Make fullscreen option label',
  },
  settingsLabel: {
    id: 'app.navBar.settingsDropdown.settingsLabel',
    description: 'Open settings option label',
  },
  aboutLabel: {
    id: 'app.navBar.settingsDropdown.aboutLabel',
    description: 'About option label',
  },
  aboutDesc: {
    id: 'app.navBar.settingsDropdown.aboutDesc',
    description: 'Describes about option',
  },
  leaveSessionLabel: {
    id: 'app.navBar.settingsDropdown.leaveSessionLabel',
    description: 'Leave session button label',
  },
  fullscreenDesc: {
    id: 'app.navBar.settingsDropdown.fullscreenDesc',
    description: 'Describes fullscreen option',
  },
  settingsDesc: {
    id: 'app.navBar.settingsDropdown.settingsDesc',
    description: 'Describes settings option',
  },
  leaveSessionDesc: {
    id: 'app.navBar.settingsDropdown.leaveSessionDesc',
    description: 'Describes leave session option',
  },
  exitFullscreenDesc: {
    id: 'app.navBar.settingsDropdown.exitFullscreenDesc',
    description: 'Describes exit fullscreen option',
  },
  exitFullscreenLabel: {
    id: 'app.navBar.settingsDropdown.exitFullscreenLabel',
    description: 'Exit fullscreen option label',
  },
  hotkeysLabel: {
    id: 'app.navBar.settingsDropdown.hotkeysLabel',
    description: 'Hotkeys options label',
  },
  hotkeysDesc: {
    id: 'app.navBar.settingsDropdown.hotkeysDesc',
    description: 'Describes hotkeys option',
  },
  helpLabel: {
    id: 'app.navBar.settingsDropdown.helpLabel',
    description: 'Help options label',
  },
  helpDesc: {
    id: 'app.navBar.settingsDropdown.helpDesc',
    description: 'Describes help option',
  },
  endMeetingLabel: {
    id: 'app.navBar.settingsDropdown.endMeetingLabel',
    description: 'End meeting options label',
  },
  endMeetingDesc: {
    id: 'app.navBar.settingsDropdown.endMeetingDesc',
    description: 'Describes settings option closing the current meeting',
  },
});

const propTypes = {
  intl: PropTypes.object.isRequired,
  handleToggleFullscreen: PropTypes.func.isRequired,
  mountModal: PropTypes.func.isRequired,
  noIOSFullscreen: PropTypes.bool,
  amIModerator: PropTypes.bool,
  shortcuts: PropTypes.string,
  isBreakoutRoom: PropTypes.bool,
  isMeteorConnected: PropTypes.bool.isRequired,
  home: PropTypes.string,
};

const defaultProps = {
  noIOSFullscreen: true,
  amIModerator: false,
  home:false,
  shortcuts: '',
  isBreakoutRoom: false,
};

const ALLOW_FULLSCREEN = Meteor.settings.public.app.allowFullscreen;

class SettingsDropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isSettingOpen: false,
      isFullscreen: false,
    };

    // Set the logout code to 680 because it's not a real code and can be matched on the other side
    this.LOGOUT_CODE = '680';

    this.onActionsShow = this.onActionsShow.bind(this);
    this.onActionsHide = this.onActionsHide.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
  }

  componentDidMount() {
    document.documentElement.addEventListener('fullscreenchange', this.onFullscreenChange);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('fullscreenchange', this.onFullscreenChange);
  }

  onActionsShow() {
    this.setState({
      isSettingOpen: true,
    });
  }

  onActionsHide() {
    this.setState({
      isSettingOpen: false,
    });
  }

  onFullscreenChange() {
    const { isFullscreen } = this.state;
    const newIsFullscreen = FullscreenService.isFullScreen(document.documentElement);
    if (isFullscreen !== newIsFullscreen) {
      this.setState({ isFullscreen: newIsFullscreen });
    }
  }

  getFullscreenItem() {
    const {
      intl,
      noIOSFullscreen,
      handleToggleFullscreen,
    } = this.props;
    const { isFullscreen } = this.state;

    if (noIOSFullscreen || !ALLOW_FULLSCREEN) return null;

    let fullscreenLabel = intl.formatMessage(intlMessages.fullscreenLabel);
    let fullscreenDesc = intl.formatMessage(intlMessages.fullscreenDesc);
    let fullscreenIcon = 'fullscreen';

    if (isFullscreen) {
      fullscreenLabel = intl.formatMessage(intlMessages.exitFullscreenLabel);
      fullscreenDesc = intl.formatMessage(intlMessages.exitFullscreenDesc);
      fullscreenIcon = 'exit_fullscreen';
    }

    return (
      <DropdownListItem
        key="list-item-fullscreen"
        // icon={fullscreenIcon}
        customIcon={
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32">
            <path id="Icon_material-fullscreen" data-name="Icon material-fullscreen" d="M12.071,28.071H7.5V39.5H18.929V34.929H12.071ZM7.5,18.929h4.571V12.071h6.857V7.5H7.5Zm27.429,16H28.071V39.5H39.5V28.071H34.929ZM28.071,7.5v4.571h6.857v6.857H39.5V7.5Z" transform="translate(-7.5 -7.5)" fill="#7080aa"/>
          </svg>
        }
        label={fullscreenLabel}
        description={fullscreenDesc}
        onClick={handleToggleFullscreen}
      />
    );
  }

  leaveSession() {
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', this.LOGOUT_CODE);
    // mountModal(<MeetingEndedComponent code={LOGOUT_CODE} />);
  }

  renderMenuItems() {
    const {
      intl, mountModal, amIModerator, isBreakoutRoom, isMeteorConnected,home,
    } = this.props;

    const allowedToEndMeeting = amIModerator && !isBreakoutRoom;

    const {
      showHelpButton: helpButton,
      helpLink,
      allowLogout: allowLogoutSetting,
    } = Meteor.settings.public.app;

    const logoutOption = (
      <DropdownListItem
        key="list-item-logout"
        data-test="logout"
        customIcon={
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32.214 28.188">
            <path id="Icon_open-account-logout" data-name="Icon open-account-logout" d="M12.08,0V4.027H28.188V24.161H12.08v4.027H32.214V0ZM8.054,8.054,0,14.094l8.054,6.04V16.107H24.161V12.08H8.054Z" fill="#7080aa"/>
          </svg>
        }
        label={intl.formatMessage(intlMessages.leaveSessionLabel)}
        description={intl.formatMessage(intlMessages.leaveSessionDesc)}
        onClick={() => this.leaveSession()}
      />
    );

    const shouldRenderLogoutOption = (isMeteorConnected && allowLogoutSetting)
      ? logoutOption
      : null;

    return _.compact([
      this.getFullscreenItem(),
      (<DropdownListItem
        key="list-item-settings"
        customIcon={
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32">
            <path id="Icon_ionic-ios-settings" data-name="Icon ionic-ios-settings" d="M33.858,20.5A4.117,4.117,0,0,1,36.5,16.655,16.315,16.315,0,0,0,34.525,11.9a4.174,4.174,0,0,1-1.675.358,4.108,4.108,0,0,1-3.758-5.782A16.275,16.275,0,0,0,24.342,4.5a4.115,4.115,0,0,1-7.683,0A16.324,16.324,0,0,0,11.9,6.474a4.108,4.108,0,0,1-3.758,5.782A4.038,4.038,0,0,1,6.467,11.9,16.676,16.676,0,0,0,4.5,16.663a4.115,4.115,0,0,1,.008,7.681A16.315,16.315,0,0,0,6.483,29.1a4.11,4.11,0,0,1,5.425,5.424A16.42,16.42,0,0,0,16.667,36.5a4.107,4.107,0,0,1,7.667,0,16.324,16.324,0,0,0,4.758-1.974A4.114,4.114,0,0,1,34.517,29.1a16.411,16.411,0,0,0,1.975-4.757A4.136,4.136,0,0,1,33.858,20.5ZM20.575,27.152a6.665,6.665,0,1,1,6.667-6.665A6.664,6.664,0,0,1,20.575,27.152Z" transform="translate(-4.5 -4.5)" fill="#7080aa"/>
          </svg>
        }
        data-test="settings"
        label={intl.formatMessage(intlMessages.settingsLabel)}
        description={intl.formatMessage(intlMessages.settingsDesc)}
        onClick={() => mountModal(<SettingsMenuContainer />)}
      />),
      (<DropdownListItem
        key="list-item-about"
        customIcon={
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32">
            <g id="Ellipse_43" data-name="Ellipse 43" fill="none" stroke="#7080aa" stroke-width="3">
              <circle cx="16" cy="16" r="16" stroke="none"/>
              <circle cx="16" cy="16" r="14.5" fill="none"/>
            </g>
            <text id="i" transform="translate(14 23)" fill="#7080aa" font-size="20" font-family="Calibri"><tspan x="0" y="0">i</tspan></text>
          </svg>
        }
        label={intl.formatMessage(intlMessages.aboutLabel)}
        description={intl.formatMessage(intlMessages.aboutDesc)}
        onClick={() => mountModal(<AboutContainer />)}
      />),
      !helpButton ? null
        : (
          <DropdownListItem
            key="list-item-help"
            customIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32">
                <g id="Ellipse_44" data-name="Ellipse 44" fill="none" stroke="#7080aa" stroke-width="3">
                  <circle cx="16" cy="16" r="16" stroke="none"/>
                  <circle cx="16" cy="16" r="14.5" fill="none"/>
                </g>
                <path id="Icon_open-question-mark" data-name="Icon open-question-mark" d="M4.042,0A4.229,4.229,0,0,0,.966,1.08,3.571,3.571,0,0,0,0,3.175l1.637.213a1.983,1.983,0,0,1,.507-1.129,2.43,2.43,0,0,1,1.9-.622,2.888,2.888,0,0,1,2,.556A1.368,1.368,0,0,1,6.5,3.273c0,1.358-.556,1.735-1.375,2.455a4.665,4.665,0,0,0-1.9,3.682v.409H4.861V9.41A2.723,2.723,0,0,1,6.186,6.955,4.693,4.693,0,0,0,8.134,3.273,3.144,3.144,0,0,0,7.168.966,4.523,4.523,0,0,0,4.042,0ZM3.224,11.456v1.637H4.861V11.456Z" transform="translate(11.866 9.907)" fill="#7080aa"/>
              </svg>
            }
            label={intl.formatMessage(intlMessages.helpLabel)}
            description={intl.formatMessage(intlMessages.helpDesc)}
            onClick={() => window.open(`${helpLink}`)}
          />
        ),
      (<DropdownListItem
        key="list-item-shortcuts"
        customIcon={
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21.5" viewBox="0 0 32.25 21.5">
            <path id="Icon_awesome-keyboard" data-name="Icon awesome-keyboard" d="M29.562,26H2.687A2.687,2.687,0,0,1,0,23.312V7.187A2.687,2.687,0,0,1,2.687,4.5H29.562A2.687,2.687,0,0,1,32.25,7.187V23.312A2.687,2.687,0,0,1,29.562,26ZM7.167,10.995V8.755a.672.672,0,0,0-.672-.672H4.255a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,7.167,10.995Zm5.375,0V8.755a.672.672,0,0,0-.672-.672H9.63a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,12.542,10.995Zm5.375,0V8.755a.672.672,0,0,0-.672-.672h-2.24a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,17.917,10.995Zm5.375,0V8.755a.672.672,0,0,0-.672-.672H20.38a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,23.292,10.995Zm5.375,0V8.755a.672.672,0,0,0-.672-.672h-2.24a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,28.667,10.995ZM9.854,16.37V14.13a.672.672,0,0,0-.672-.672H6.943a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,9.854,16.37Zm5.375,0V14.13a.672.672,0,0,0-.672-.672h-2.24a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,15.229,16.37Zm5.375,0V14.13a.672.672,0,0,0-.672-.672h-2.24a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,20.6,16.37Zm5.375,0V14.13a.672.672,0,0,0-.672-.672h-2.24a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,25.979,16.37ZM7.167,21.745v-2.24a.672.672,0,0,0-.672-.672H4.255a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,7.167,21.745Zm16.125,0v-2.24a.672.672,0,0,0-.672-.672H9.63a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672H22.62A.672.672,0,0,0,23.292,21.745Zm5.375,0v-2.24a.672.672,0,0,0-.672-.672h-2.24a.672.672,0,0,0-.672.672v2.24a.672.672,0,0,0,.672.672h2.24A.672.672,0,0,0,28.667,21.745Z" transform="translate(0 -4.5)" fill="#7080aa"/>
          </svg>
        }
        label={intl.formatMessage(intlMessages.hotkeysLabel)}
        description={intl.formatMessage(intlMessages.hotkeysDesc)}
        onClick={() => mountModal(<ShortcutHelpComponent />)}
      />),
      (isMeteorConnected ? <DropdownListSeparator key={_.uniqueId('list-separator-')} /> : null),
      allowedToEndMeeting && isMeteorConnected
        ? (<DropdownListItem
          key="list-item-end-meeting"
          customIcon={
            // <svg xmlns="http://www.w3.org/2000/svg" width="48" height="32" viewBox="0 0 48 32">
            //   <rect id="Rectangle_58" data-name="Rectangle 58" width="48" height="32" rx="12" fill="#ff3131"/>
            //   <text id="END" transform="translate(12 20)" fill="#fff" font-size="13" font-family="Calibri"><tspan x="0" y="0">END</tspan></text>
            // </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32.214 28.188">
            <path id="Icon_open-account-logout" data-name="Icon open-account-logout" d="M12.08,0V4.027H28.188V24.161H12.08v4.027H32.214V0ZM8.054,8.054,0,14.094l8.054,6.04V16.107H24.161V12.08H8.054Z" fill="#7080aa"/>
          </svg>
          }
          label={intl.formatMessage(intlMessages.endMeetingLabel)}
          description={intl.formatMessage(intlMessages.endMeetingDesc)}
          onClick={() => mountModal(<EndMeetingConfirmationContainer />)}
        />
        )
        : null,
      shouldRenderLogoutOption,
    ]);
  }

  render() {
    const {
      intl,
      shortcuts: OPEN_OPTIONS_AK,
      home,
    } = this.props;

    const { isSettingOpen } = this.state;

    return (
      <Dropdown
        className={styles.dropdown}
        autoFocus
        keepOpen={isSettingOpen}
        onShow={this.onActionsShow}
        onHide={this.onActionsHide}
      >
        <DropdownTrigger tabIndex={0} accessKey={OPEN_OPTIONS_AK}>
          {home ? (
            <Button
            label="Home"
            color={'primary'}
            size="lg"
            btnnew
            customIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24.883" height="27.426" viewBox="0 0 24.883 27.426">
                <g id="Icon_feather-home" data-name="Icon feather-home" transform="translate(-3.5 -2)">
                  <path id="Path_28" data-name="Path 28" d="M4.5,11.9,15.941,3l11.441,8.9V25.883a2.543,2.543,0,0,1-2.543,2.543H7.043A2.543,2.543,0,0,1,4.5,25.883Z" fill="none" stroke="#f2f2f2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  <path id="Path_29" data-name="Path 29" d="M13.5,30.713V18h7.628V30.713" transform="translate(-1.372 -2.287)" fill="none" stroke="#f2f2f2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </g>
              </svg>
            }
            hideLabel
            btnMobileOnly
            
          />
          ):(
              <Button
              label={intl.formatMessage(intlMessages.optionsLabel)}
              customIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="21.571" height="20.764" viewBox="0 0 21.571 20.764">
                  <line id="Line_33" data-name="Line 33" x2="18.571" transform="translate(1.5 1.5)" fill="none" stroke="#7586b1" stroke-linecap="round" stroke-width="3"/>
                  <line id="Line_50" data-name="Line 50" x2="18.571" transform="translate(1.5 19.264)" fill="none" stroke="#7586b1" stroke-linecap="round" stroke-width="3"/>
                  <line id="Line_51" data-name="Line 51" x2="17.99" transform="translate(1.5 10.149)" fill="none" stroke="#7586b1" stroke-linecap="round" stroke-width="3"/>
                </svg>
              }
              ghost
              circle
              hideLabel
              className={styles.btn}

              // FIXME: Without onClick react proptypes keep warning
              // even after the DropdownTrigger inject an onClick handler
              onClick={() => null}
            />
          )}
        </DropdownTrigger>
        <DropdownContent placement="bottom right">
          <DropdownList>
            {this.renderMenuItems()}
          </DropdownList>
        </DropdownContent>
      </Dropdown>
    );
  }
}
SettingsDropdown.propTypes = propTypes;
SettingsDropdown.defaultProps = defaultProps;
export default withShortcutHelper(withModalMounter(injectIntl(SettingsDropdown)), 'openOptions');
