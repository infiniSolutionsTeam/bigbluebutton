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
// added by chata start
import { makeCall } from '/imports/ui/services/api';
// added by chata stop


class ActionsBar extends PureComponent {
  leaveSession() {
    
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', '680');
    // mountModal(<MeetingEndedComponent code={LOGOUT_CODE} />);
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
          <Button

              label="3Dot"
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
            />
        {enableVideo
            ? (
              <JoinVideoOptionsContainer />
            )
            : null}
            <Button
              label="END"
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
              label="Home"
              color={currentUser.emoji === 'raiseHand' ? 'primary' : 'default'}
              data-test={currentUser.emoji === 'raiseHand' ? 'lowerHandLabel' : 'raiseHandLabel'}
              className={cx(currentUser.emoji === 'raiseHand' || styles.btn)}
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
