import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import Button from '/imports/ui/components/button/component';
import Dropdown from '/imports/ui/components/dropdown/component';
import DropdownTrigger from '/imports/ui/components/dropdown/trigger/component';
import DropdownContent from '/imports/ui/components/dropdown/content/component';
import DropdownList from '/imports/ui/components/dropdown/list/component';
import DropdownListItem from '/imports/ui/components/dropdown/list/item/component';
import { withModalMounter } from '/imports/ui/components/modal/service';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import DropdownListSeparator from '/imports/ui/components/dropdown/list/separator/component';
import ExternalVideoModal from '/imports/ui/components/external-video-player/modal/container';
import RandomUserSelectContainer from '/imports/ui/components/modal/random-user/container';
import cx from 'classnames';
import { styles } from '../styles';

const propTypes = {
  amIPresenter: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  mountModal: PropTypes.func.isRequired,
  amIModerator: PropTypes.bool.isRequired,
  shortcuts: PropTypes.string,
  handleTakePresenter: PropTypes.func.isRequired,
  allowExternalVideo: PropTypes.bool.isRequired,
  stopExternalVideoShare: PropTypes.func.isRequired,
};

const defaultProps = {
  shortcuts: '',
};

const intlMessages = defineMessages({
  actionsLabel: {
    id: 'app.actionsBar.actionsDropdown.actionsLabel',
    description: 'Actions button label',
  },
  presentationLabel: {
    id: 'app.actionsBar.actionsDropdown.presentationLabel',
    description: 'Upload a presentation option label',
  },
  presentationDesc: {
    id: 'app.actionsBar.actionsDropdown.presentationDesc',
    description: 'adds context to upload presentation option',
  },
  desktopShareDesc: {
    id: 'app.actionsBar.actionsDropdown.desktopShareDesc',
    description: 'adds context to desktop share option',
  },
  stopDesktopShareDesc: {
    id: 'app.actionsBar.actionsDropdown.stopDesktopShareDesc',
    description: 'adds context to stop desktop share option',
  },
  pollBtnLabel: {
    id: 'app.actionsBar.actionsDropdown.pollBtnLabel',
    description: 'poll menu toggle button label',
  },
  pollBtnDesc: {
    id: 'app.actionsBar.actionsDropdown.pollBtnDesc',
    description: 'poll menu toggle button description',
  },
  takePresenter: {
    id: 'app.actionsBar.actionsDropdown.takePresenter',
    description: 'Label for take presenter role option',
  },
  takePresenterDesc: {
    id: 'app.actionsBar.actionsDropdown.takePresenterDesc',
    description: 'Description of take presenter role option',
  },
  startExternalVideoLabel: {
    id: 'app.actionsBar.actionsDropdown.shareExternalVideo',
    description: 'Start sharing external video button',
  },
  stopExternalVideoLabel: {
    id: 'app.actionsBar.actionsDropdown.stopShareExternalVideo',
    description: 'Stop sharing external video button',
  },
  selectRandUserLabel: {
    id: 'app.actionsBar.actionsDropdown.selectRandUserLabel',
    description: 'Label for selecting a random user',
  },
  selectRandUserDesc: {
    id: 'app.actionsBar.actionsDropdown.selectRandUserDesc',
    description: 'Description for select random user option',
  },
});

const handlePresentationClick = () => Session.set('showUploadPresentationView', true);

class ActionsDropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.presentationItemId = _.uniqueId('action-item-');
    this.pollId = _.uniqueId('action-item-');
    this.takePresenterId = _.uniqueId('action-item-');
    this.selectUserRandId = _.uniqueId('action-item-');

    this.handleExternalVideoClick = this.handleExternalVideoClick.bind(this);
    this.makePresentationItems = this.makePresentationItems.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { amIPresenter: wasPresenter } = prevProps;
    const { amIPresenter: isPresenter, mountModal } = this.props;
    if (wasPresenter && !isPresenter) {
      mountModal(null);
    }
  }

  handleExternalVideoClick() {
    const { mountModal } = this.props;
    mountModal(<ExternalVideoModal />);
  }

  getAvailableActions() {
    const {
      intl,
      amIPresenter,
      allowExternalVideo,
      handleTakePresenter,
      isSharingVideo,
      isPollingEnabled,
      isSelectRandomUserEnabled,
      stopExternalVideoShare,
      mountModal,
    } = this.props;

    const {
      pollBtnLabel,
      pollBtnDesc,
      presentationLabel,
      presentationDesc,
      takePresenter,
      takePresenterDesc,
    } = intlMessages;

    const {
      formatMessage,
    } = intl;

    return _.compact([
      (amIPresenter && isPollingEnabled
        ? (
          <DropdownListItem
            customIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 31.5 31.5">
                <path id="Icon_awesome-poll" data-name="Icon awesome-poll" d="M28.125,2.25H3.375A3.376,3.376,0,0,0,0,5.625v24.75A3.376,3.376,0,0,0,3.375,33.75h24.75A3.376,3.376,0,0,0,31.5,30.375V5.625A3.376,3.376,0,0,0,28.125,2.25ZM11.25,25.875A1.125,1.125,0,0,1,10.125,27H7.875A1.125,1.125,0,0,1,6.75,25.875v-9A1.125,1.125,0,0,1,7.875,15.75h2.25a1.125,1.125,0,0,1,1.125,1.125Zm6.75,0A1.125,1.125,0,0,1,16.875,27h-2.25A1.125,1.125,0,0,1,13.5,25.875V10.125A1.125,1.125,0,0,1,14.625,9h2.25A1.125,1.125,0,0,1,18,10.125Zm6.75,0A1.125,1.125,0,0,1,23.625,27h-2.25a1.125,1.125,0,0,1-1.125-1.125v-4.5a1.125,1.125,0,0,1,1.125-1.125h2.25a1.125,1.125,0,0,1,1.125,1.125Z" transform="translate(0 -2.25)" fill="#7080aa"/>
              </svg>
            }
            data-test="polling"
            label={formatMessage(pollBtnLabel)}
            description={formatMessage(pollBtnDesc)}
            key={this.pollId}
            onClick={() => {
              if (Session.equals('pollInitiated', true)) {
                Session.set('resetPollPanel', true);
              }
              Session.set('openPanel', 'poll');
              Session.set('forcePollOpen', true);
              window.dispatchEvent(new Event('panelChanged'));
            }}
          />
        )
        : null),
      (!amIPresenter
        ? (
          <DropdownListItem
            customIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 33 27">
                  <path id="Icon_material-present-to-all" data-name="Icon material-present-to-all" d="M31.5,4.5H4.5a2.99,2.99,0,0,0-3,3v21a2.99,2.99,0,0,0,3,3h27a2.99,2.99,0,0,0,3-3V7.5A2.99,2.99,0,0,0,31.5,4.5Zm0,24.03H4.5V7.47h27V28.53ZM15,18H12l6-6,6,6H21v6H15Z" transform="translate(-1.5 -4.5)" fill="#7080aa"/>
                </svg>
              }
            label={formatMessage(takePresenter)}
            description={formatMessage(takePresenterDesc)}
            key={this.takePresenterId}
            onClick={() => handleTakePresenter()}
          />
        )
        : null),
      (amIPresenter
        ? (
          <DropdownListItem
            data-test="uploadPresentation"
            customIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="27" viewBox="0 0 33 27">
                <path id="Icon_material-present-to-all" data-name="Icon material-present-to-all" d="M31.5,4.5H4.5a2.99,2.99,0,0,0-3,3v21a2.99,2.99,0,0,0,3,3h27a2.99,2.99,0,0,0,3-3V7.5A2.99,2.99,0,0,0,31.5,4.5Zm0,24.03H4.5V7.47h27V28.53ZM15,18H12l6-6,6,6H21v6H15Z" transform="translate(-1.5 -4.5)" fill="#7080aa"/>
              </svg>
            }
            label={formatMessage(presentationLabel)}
            description={formatMessage(presentationDesc)}
            key={this.presentationItemId}
            onClick={handlePresentationClick}
          />
        )
        : null),
      (amIPresenter && allowExternalVideo
        ? (
          <DropdownListItem
            customIcon={
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" y="0"/></g><g><path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M9.5,16.5v-9l7,4.5L9.5,16.5z"/></g></svg>
            }
            label={!isSharingVideo ? intl.formatMessage(intlMessages.startExternalVideoLabel)
              : intl.formatMessage(intlMessages.stopExternalVideoLabel)}
            description="External Video"
            key="external-video"
            onClick={isSharingVideo ? stopExternalVideoShare : this.handleExternalVideoClick}
          />
        )
        : null),
      (amIPresenter && isSelectRandomUserEnabled
        ? (
          <DropdownListItem
            customIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
                <path id="Icon_material-person" data-name="Icon material-person" d="M18.5,18.5a6.25,6.25,0,1,0-6.25-6.25A6.248,6.248,0,0,0,18.5,18.5Zm0,3.125c-4.172,0-12.5,2.094-12.5,6.25V31H31V27.875C31,23.719,22.672,21.625,18.5,21.625Z" transform="translate(-6 -6)" fill="#7080aa"/>
              </svg>
            }
            label={intl.formatMessage(intlMessages.selectRandUserLabel)}
            description={intl.formatMessage(intlMessages.selectRandUserDesc)}
            key={this.selectUserRandId}
            onClick={() => mountModal(<RandomUserSelectContainer isSelectedUser={false} />)}
          />
        )
        : null),
    ]);
  }

  makePresentationItems() {
    const {
      presentations,
      setPresentation,
      podIds,
    } = this.props;

    if (!podIds || podIds.length < 1) return [];

    // We still have code for other pods from the Flash client. This intentionally only cares
    // about the first one because it's the default.
    const { podId } = podIds[0];

    const presentationItemElements = presentations
      .sort((a, b) => (a.name.localeCompare(b.name)))
      .map((p) => {
        const itemStyles = {};
        itemStyles[styles.presentationItem] = true;
        itemStyles[styles.isCurrent] = p.current;

        return (
          <DropdownListItem
            className={cx(itemStyles)}
            icon="file"
            iconRight={p.current ? 'check' : null}
            label={p.name}
            description="uploaded presentation file"
            key={`uploaded-presentation-${p.id}`}
            onClick={() => {
              setPresentation(p.id, podId);
            }}
          />
        );
      });

    presentationItemElements.push(<DropdownListSeparator key={_.uniqueId('list-separator-')} />);
    return presentationItemElements;
  }

  render() {
    const {
      intl,
      amIPresenter,
      amIModerator,
      shortcuts: OPEN_ACTIONS_AK,
      isMeteorConnected,
    } = this.props;

    const availableActions = this.getAvailableActions();
    const availablePresentations = this.makePresentationItems();
    const children = availablePresentations.length > 2 && amIPresenter
      ? availablePresentations.concat(availableActions) : availableActions;

    if ((!amIPresenter && !amIModerator)
      || availableActions.length === 0
      || !isMeteorConnected) {
      return null;
    }

    return (
      <Dropdown className={styles.dropdown} ref={(ref) => { this._dropdown = ref; }}>
        <DropdownTrigger tabIndex={0} accessKey={OPEN_ACTIONS_AK}>
          <Button
            hideLabel
            aria-label={intl.formatMessage(intlMessages.actionsLabel)}
            label={intl.formatMessage(intlMessages.actionsLabel)}
            icon="plus"
            color="primary"
            size="lg"
            circle
            onClick={() => null}
          />
        </DropdownTrigger>
        <DropdownContent placement="top left">
          <DropdownList className={styles.scrollableList}>
            {children}
          </DropdownList>
        </DropdownContent>
      </Dropdown>
    );
  }
}

ActionsDropdown.propTypes = propTypes;
ActionsDropdown.defaultProps = defaultProps;

export default withShortcutHelper(withModalMounter(ActionsDropdown), 'openActions');
