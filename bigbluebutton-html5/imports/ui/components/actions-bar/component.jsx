import React, { PureComponent } from 'react';
import cx from 'classnames';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PanToolIcon from '@material-ui/icons/PanTool';
import AlarmIcon from '@material-ui/icons/Alarm';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { styles } from './styles.scss';
import DesktopShare from './desktop-share/component';
import ActionsDropdown from './actions-dropdown/component';
import QuickPollDropdown from './quick-poll-dropdown/component';
import AudioControlsContainer from '../audio/audio-controls/container';
import JoinVideoOptionsContainer from '../video-provider/video-button/container';
import CaptionsButtonContainer from '/imports/ui/components/actions-bar/captions/container';
import PresentationOptionsContainer from './presentation-options/component';
import EndMeetingConfirmationContainer from '/imports/ui/components/end-meeting-confirmation/container';
import Auth from '/imports/ui/services/auth';
// import Modal from '@material-ui/core/Modal';
// added by chata start
import { makeCall } from '/imports/ui/services/api';
// added by chata stop

class ActionsBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { handUp: false };
    // this.LOGOUT_CODE = '680';
  }

  leaveSession() {
    
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', '680');
    // mountModal(<MeetingEndedComponent code={LOGOUT_CODE} />);
  }

  // setHand() {
  //   console.log('from chata ',this.state.handUp);
  //   if(this.state.handUp){
  //     this.setState({handUp:false});
  //     makeCall('setEmojiStatus', Auth.userID, 'none');
  //   }
  //   else{
  //     this.setState({handUp:true});
  //     makeCall('setEmojiStatus', Auth.userID, 'hand');
  //   }
    
  // }

  setHand = () => {
        console.log('from chata ', this.state.handUp);
    
        if(this.state.handUp){
          makeCall('setEmojiStatus', Auth.userID, 'none');
        }
        else{
          makeCall('setEmojiStatus', Auth.userID, 'hand');
        }
        this.setState({handUp: !this.state.handUp});
  }

  render() {
    const {
      amIPresenter,
      handleShareScreen,
      handleUnshareScreen,
      isVideoBroadcasting,
      amIModerator,
      screenSharingCheck,
      enableVideo,
      isLayoutSwapped,
      toggleSwapLayout,
      handleTakePresenter,
      intl,
      currentSlidHasContent,
      parseCurrentSlideContent,
      isSharingVideo,
      screenShareEndAlert,
      stopExternalVideoShare,
      screenshareDataSavingSetting,
      isCaptionsAvailable,
      isMeteorConnected,
      isPollingEnabled,
      isThereCurrentPresentation,
      allowExternalVideo,
      // mountModal
    } = this.props;

    const actionBarClasses = {};

    actionBarClasses[styles.centerWithActions] = amIPresenter;
    actionBarClasses[styles.center] = true;
    actionBarClasses[styles.mobileLayoutSwapped] = isLayoutSwapped && amIPresenter;
    
    return (
      <div className={styles.actionsbar}>
        <div className={styles.left}>
          <ActionsDropdown {...{
            amIPresenter,
            amIModerator,
            isPollingEnabled,
            allowExternalVideo,
            handleTakePresenter,
            intl,
            isSharingVideo,
            stopExternalVideoShare,
            isMeteorConnected,
          }}
          />
          {isPollingEnabled
            ? (
              <QuickPollDropdown
                {...{
                  currentSlidHasContent,
                  intl,
                  amIPresenter,
                  parseCurrentSlideContent,
                }}
              />
            ) : null}
          {isCaptionsAvailable
            ? (
              <CaptionsButtonContainer {...{ intl }} />
            )
            : null}
        </div>
        <div className={cx(actionBarClasses)}>
          <AudioControlsContainer />
          {enableVideo
            ? (
              <JoinVideoOptionsContainer />
            )
            : null}

          {isLayoutSwapped
            ? (
              <PresentationOptionsContainer
                toggleSwapLayout={toggleSwapLayout}
                isThereCurrentPresentation={isThereCurrentPresentation}
              />
            )
            : null}
          {/* Added by chata start */}
          {/* //TODO this is bottom app bar  */}
          <div>
            {/* <button label={'leave'}
            description={'leave'} type="button" >
              Leave
            </button> */}
            <IconButton aria-label="add an alarm" className={styles.newBtn} onClick={this.leaveSession}>
              <CallEndIcon fontSize="large" />
            </IconButton>
          </div>
          {/* Added by chata stop */}
        </div>
        <div className={styles.right}>


          <DesktopShare {...{
            handleShareScreen,
            handleUnshareScreen,
            isVideoBroadcasting,
            amIPresenter,
            screenSharingCheck,
            screenShareEndAlert,
            isMeteorConnected,
            screenshareDataSavingSetting,
          }}
          />
          {/* <IconButton color="#FFFFFF" aria-label="add an alarm" onClick={this.setHand}>
            <PanToolIcon fontSize="large" />
          </IconButton> */}

          <div onClick={this.setHand} className={styles.setStatusBtn} onClick={this.setHand}>
            <PanToolIcon fontSize="default" />
            
            {
              this.state.handUp ? 'Reset Status':'Set Status'
            }
          </div>
        </div>
        {/* //TODO by chata */}


      </div>
    );
  }
}

export default ActionsBar;
