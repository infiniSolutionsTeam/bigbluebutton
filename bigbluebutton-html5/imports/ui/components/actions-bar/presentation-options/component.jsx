import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Button from '/imports/ui/components/button/component';
import MediaService from '/imports/ui/components/media/service';

const propTypes = {
  intl: PropTypes.object.isRequired,
  toggleSwapLayout: PropTypes.func.isRequired,
};

const intlMessages = defineMessages({
  restorePresentationLabel: {
    id: 'app.actionsBar.actionsDropdown.restorePresentationLabel',
    description: 'Restore Presentation option label',
  },
  restorePresentationDesc: {
    id: 'app.actionsBar.actionsDropdown.restorePresentationDesc',
    description: 'button to restore presentation after it has been closed',
  },
});

const shouldUnswapLayout = () => MediaService.shouldShowScreenshare() || MediaService.shouldShowExternalVideo();

const PresentationOptionsContainer = ({ intl, toggleSwapLayout, isThereCurrentPresentation }) => {
  if (shouldUnswapLayout()) toggleSwapLayout();
  return (
    <Button
      customIcon={
        <svg xmlns="http://www.w3.org/2000/svg" width="28.75" height="23" viewBox="0 0 28.75 23">
          <path id="Icon_awesome-chalkboard-teacher" data-name="Icon awesome-chalkboard-teacher" d="M9.344,15.813a1.028,1.028,0,0,0-.317.049,5.926,5.926,0,0,1-1.839.31,5.931,5.931,0,0,1-1.84-.31,1.025,1.025,0,0,0-.317-.049A5.032,5.032,0,0,0,0,20.872,2.151,2.151,0,0,0,2.156,23H12.219a2.151,2.151,0,0,0,2.156-2.128A5.032,5.032,0,0,0,9.344,15.813ZM7.187,14.375a4.313,4.313,0,1,0-4.313-4.313A4.312,4.312,0,0,0,7.187,14.375ZM26.594,0H9.344A2.2,2.2,0,0,0,7.187,2.228V4.313a5.685,5.685,0,0,1,2.875.8V2.875H25.875V15.813H23V12.938H17.25v2.875H13.825a5.725,5.725,0,0,1,1.783,2.875H26.594A2.2,2.2,0,0,0,28.75,16.46V2.228A2.2,2.2,0,0,0,26.594,0Z" transform="translate(0)" fill="#f2f2f2"/>
        </svg>
      }
      data-test="restorePresentationButton"
      label="White Board"
      description={intl.formatMessage(intlMessages.restorePresentationDesc)}
      color="primary"
      circle={false}
      size="lg"
      onClick={toggleSwapLayout}
      id="restore-presentation"
      disabled={!isThereCurrentPresentation}
    />
  );
};

PresentationOptionsContainer.propTypes = propTypes;
export default injectIntl(PresentationOptionsContainer);
