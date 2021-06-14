import React, { PureComponent } from 'react';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { ACTIONSBAR_HEIGHT } from '/imports/ui/components/layout/layout-manager/component';
import CaptionsButtonContainer from '/imports/ui/components/actions-bar/captions/container';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import { styles } from './styles.scss';
import ActionsDropdown from './actions-dropdown/container';
import ScreenshareButtonContainer from '/imports/ui/components/actions-bar/screenshare/container';
import AudioControlsContainer from '../audio/audio-controls/container';
import JoinVideoOptionsContainer from '../video-provider/video-button/container';
import PresentationOptionsContainer from './presentation-options/component';
import SettingsDropdownContainer from '../nav-bar/settings-dropdown/container';
// added by chata start
import { Session } from 'meteor/session';
import { makeCall } from '/imports/ui/services/api';
// added by chata stop


class ActionsBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {moreItems: false};
    this.moreItemsSH = this.moreItemsSH.bind(this);
  }

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

  leaveSession() {
    
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', '680');
    // mountModal(<MeetingEndedComponent code={LOGOUT_CODE} />);
  }
  moreItemsSH(){
    console.log("more icon btn clicked");
    // this.setState({moreItems: !this.state.moreItems})
    this.setState((state) => ({ moreItems: !state.moreItems}));
  }
  render() {
    const {
      amIPresenter,
      amIModerator,
      enableVideo,
      isLayoutSwapped,
      toggleSwapLayout,
      handleTakePresenter,
      intl,
      isSharingVideo,
      stopExternalVideoShare,
      isCaptionsAvailable,
      isMeteorConnected,
      isPollingEnabled,
      isSelectRandomUserEnabled,
      isPresentationDisabled,
      isThereCurrentPresentation,
      allowExternalVideo,
      setEmojiStatus,
      currentUser,
      shortcuts,
    } = this.props;

    return (
      <>
      <div
        className={styles.actionsbar}
        style={{
          height: ACTIONSBAR_HEIGHT,
        }}
      >
        <div className={styles.left}>
          <ActionsDropdown {...{
            amIPresenter,
            amIModerator,
            isPollingEnabled,
            isSelectRandomUserEnabled,
            allowExternalVideo,
            handleTakePresenter,
            intl,
            isSharingVideo,
            stopExternalVideoShare,
            isMeteorConnected,
          }}
          />
          {isCaptionsAvailable
            ? (
              <CaptionsButtonContainer {...{ intl }} />
            )
            : null
          }
        </div>
          
        <div className={styles.center}>
          {this.state.moreItems ? <div className={styles.moreContainer}>
            {isLayoutSwapped && !isPresentationDisabled
              ? (
                <PresentationOptionsContainer
                  toggleSwapLayout={toggleSwapLayout}
                  isThereCurrentPresentation={isThereCurrentPresentation}
                />
              )
              : null
            }
            <Button
            customIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18.319" height="23.053" viewBox="0 0 18.319 23.053">
              <path id="Icon_ionic-ios-hand" data-name="Icon ionic-ios-hand" d="M23.856,7.214a1.181,1.181,0,0,0-1.208,1.141v6.061a.51.51,0,0,1-1.019,0V5.475a1.21,1.21,0,0,0-2.415,0V12.5a.51.51,0,0,1-1.019,0V4.516a1.21,1.21,0,0,0-2.415,0v8.942a.51.51,0,0,1-1.019,0V6.433a1.21,1.21,0,0,0-2.415,0V18.527L10.756,17.22c-1.494-1.258-2.759-1.8-3.789-.87C6.275,17,7.362,18.062,8.5,19.3c1.1,1.191,4.006,5.091,6.484,6.5a4.57,4.57,0,0,0,2.324.632h3.274c2.638,0,4.487-2.1,4.487-5.163V8.356A1.189,1.189,0,0,0,23.856,7.214Z" transform="translate(-6.75 -3.375)" fill="#ebebeb"/>
              </svg>
            }
              label={intl.formatMessage({
                id: `app.actionsBar.emojiMenu.${
                  currentUser.emoji === 'raiseHand'
                    ? 'lowerHandLabel'
                    : 'raiseHandLabel'
                }`,
              })}
              accessKey={shortcuts.raisehand}
              color={'default'}
              data-test={currentUser.emoji === 'raiseHand' ? 'lowerHandLabel' : 'raiseHandLabel'}
              ghost={currentUser.emoji !== 'raiseHand'}
              className={cx(currentUser.emoji === 'raiseHand' || styles.btn)}
              circle={false}
              size="lgNew"
              onClick={() => {
                setEmojiStatus(
                  currentUser.userId,
                  currentUser.emoji === 'raiseHand' ? 'none' : 'raiseHand',
                );
              }}
            />
          </div>: null}
          <Button

              label="More"
              color={currentUser.emoji === 'raiseHand' ? 'primary' : 'default'}
              data-test={currentUser.emoji === 'raiseHand' ? 'lowerHandLabel' : 'raiseHandLabel'}
              className={cx(currentUser.emoji === 'raiseHand' || styles.btn)}
              size="lg"
              btnnew
              btnMobileOnly
              customIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="7" viewBox="0 0 27 7">
                  <circle id="Ellipse_37" data-name="Ellipse 37" cx="3.5" cy="3.5" r="3.5" fill="#f2f2f2"/>
                  <circle id="Ellipse_38" data-name="Ellipse 38" cx="3.5" cy="3.5" r="3.5" transform="translate(10)" fill="#f2f2f2"/>
                  <circle id="Ellipse_39" data-name="Ellipse 39" cx="3.5" cy="3.5" r="3.5" transform="translate(20)" fill="#f2f2f2"/>
                </svg>
              }
              hideLabel
              onClick={this.moreItemsSH}
            />
        {enableVideo
            ? (
              <JoinVideoOptionsContainer />
            )
            : null}
            <Button
              label="Leave"
              color={currentUser.emoji === 'raiseHand' ? 'primary' : 'default'}
              data-test={currentUser.emoji === 'raiseHand' ? 'lowerHandLabel' : 'raiseHandLabel'}
              className={cx(styles.btnRed)}
              size="lg"
              btnnew
              onClick={this.leaveSession}
            />
          {/* <Button variant="contained" color="secondary" style={{backgroundColor:"#FF3131",color:"white",borderRadius:"8px",height:"30px"}}>
            End
          </Button> */}
          <AudioControlsContainer />
          <Button
              // onClick={NavBar.handleToggleUserList}
              onClick={ActionsBar.handleToggleUserList}
              btnMobileOnly
              btnnew
              hideLabel
              data-test=''
              label="label"
              aria-label='ari label'
              customIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="26.714" height="17" viewBox="0 0 26.714 17">
                  <path id="Icon_material-people-outline" data-name="Icon material-people-outline" d="M20.321,17.214a14.555,14.555,0,0,0-5.464,1.214,14.324,14.324,0,0,0-5.464-1.214c-2.635,0-7.893,1.311-7.893,3.946V24.5H28.214V21.161C28.214,18.526,22.956,17.214,20.321,17.214Zm-4.857,5.464H3.321V21.161c0-.656,3.109-2.125,6.071-2.125s6.071,1.469,6.071,2.125Zm10.929,0H17.286V21.161a2.209,2.209,0,0,0-.631-1.481,11.715,11.715,0,0,1,3.667-.644c2.963,0,6.071,1.469,6.071,2.125ZM9.393,16a4.25,4.25,0,1,0-4.25-4.25A4.255,4.255,0,0,0,9.393,16Zm0-6.679A2.429,2.429,0,1,1,6.964,11.75,2.436,2.436,0,0,1,9.393,9.321ZM20.321,16a4.25,4.25,0,1,0-4.25-4.25A4.255,4.255,0,0,0,20.321,16Zm0-6.679a2.429,2.429,0,1,1-2.429,2.429A2.436,2.436,0,0,1,20.321,9.321Z" transform="translate(-1.5 -7.5)" fill="#f2f2f2"/>
                </svg>

              }
              // className={cx(toggleBtnClasses)}
              // aria-expanded={isExpanded}
              // accessKey={TOGGLE_USERLIST_AK}
            />
          {/* <SettingsDropdownContainer amIModerator={amIModerator} home/> */}
          
        </div>
        
        <div className={styles.right}>
          {isLayoutSwapped && !isPresentationDisabled
            ? (
              <PresentationOptionsContainer
                toggleSwapLayout={toggleSwapLayout}
                isThereCurrentPresentation={isThereCurrentPresentation}
              />
            )
            : null
          }
          <ScreenshareButtonContainer {...{
            amIPresenter,
            isMeteorConnected,
          }}
          />
          {
            <Button
            customIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18.319" height="23.053" viewBox="0 0 18.319 23.053">
              <path id="Icon_ionic-ios-hand" data-name="Icon ionic-ios-hand" d="M23.856,7.214a1.181,1.181,0,0,0-1.208,1.141v6.061a.51.51,0,0,1-1.019,0V5.475a1.21,1.21,0,0,0-2.415,0V12.5a.51.51,0,0,1-1.019,0V4.516a1.21,1.21,0,0,0-2.415,0v8.942a.51.51,0,0,1-1.019,0V6.433a1.21,1.21,0,0,0-2.415,0V18.527L10.756,17.22c-1.494-1.258-2.759-1.8-3.789-.87C6.275,17,7.362,18.062,8.5,19.3c1.1,1.191,4.006,5.091,6.484,6.5a4.57,4.57,0,0,0,2.324.632h3.274c2.638,0,4.487-2.1,4.487-5.163V8.356A1.189,1.189,0,0,0,23.856,7.214Z" transform="translate(-6.75 -3.375)" fill="#ebebeb"/>
              </svg>
            }
              label={intl.formatMessage({
                id: `app.actionsBar.emojiMenu.${
                  currentUser.emoji === 'raiseHand'
                    ? 'lowerHandLabel'
                    : 'raiseHandLabel'
                }`,
              })}
              accessKey={shortcuts.raisehand}
              color={currentUser.emoji === 'raiseHand' ? 'primary' : 'default'}
              data-test={currentUser.emoji === 'raiseHand' ? 'lowerHandLabel' : 'raiseHandLabel'}
              className={cx(currentUser.emoji === 'raiseHand' || styles.btn)}
              circle={false}
              size="lgNew"
              onClick={() => {
                setEmojiStatus(
                  currentUser.userId,
                  currentUser.emoji === 'raiseHand' ? 'none' : 'raiseHand',
                );
              }}
            />
          }
          
        </div>
      </div>
      {/* <div
        className={styles.actionsbar}
        style={{
          height: ACTIONSBAR_HEIGHT,
        }}
      >
        <div className={styles.left}>
          <ActionsDropdown {...{
            amIPresenter,
            amIModerator,
            isPollingEnabled,
            isSelectRandomUserEnabled,
            allowExternalVideo,
            handleTakePresenter,
            intl,
            isSharingVideo,
            stopExternalVideoShare,
            isMeteorConnected,
          }}
          />
          {isCaptionsAvailable
            ? (
              <CaptionsButtonContainer {...{ intl }} />
            )
            : null
          }
        </div>
        <div className={styles.center}>
          <AudioControlsContainer />
          {enableVideo
            ? (
              <JoinVideoOptionsContainer />
            )
            : null}
          <ScreenshareButtonContainer {...{
            amIPresenter,
            isMeteorConnected,
          }}
          />
        </div>
        <div className={styles.right}>
          {
            <Button
              icon="hand"
              label={intl.formatMessage({
                id: `app.actionsBar.emojiMenu.${
                  currentUser.emoji === 'raiseHand'
                    ? 'lowerHandLabel'
                    : 'raiseHandLabel'
                }`,
              })}
              accessKey={shortcuts.raisehand}
              color={currentUser.emoji === 'raiseHand' ? 'primary' : 'default'}
              data-test={currentUser.emoji === 'raiseHand' ? 'lowerHandLabel' : 'raiseHandLabel'}
              ghost={currentUser.emoji !== 'raiseHand'}
              className={cx(currentUser.emoji === 'raiseHand' || styles.btn)}
              hideLabel
              circle
              size="lg"
              onClick={() => {
                setEmojiStatus(
                  currentUser.userId,
                  currentUser.emoji === 'raiseHand' ? 'none' : 'raiseHand',
                );
              }}
            />
          }
          {isLayoutSwapped && !isPresentationDisabled
            ? (
              <PresentationOptionsContainer
                toggleSwapLayout={toggleSwapLayout}
                isThereCurrentPresentation={isThereCurrentPresentation}
              />
            )
            : null
          }
        </div>
      </div> */}
      </>
    );
  }
}

export default withShortcutHelper(ActionsBar, ['raiseHand']);
