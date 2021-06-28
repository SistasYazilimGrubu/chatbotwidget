import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class VidReply extends PureComponent {
  render() {
    const { src, title } = this.props.message;
    return (
      <div className="video">
        <div className="video-title">
          {title !== 'None' ? title : ''}
        </div>
        <embed
          className="source"
          src={src}
        />
      </div>
    );
  }
}

VidReply.propTypes = {
  message: PROP_TYPES.VIDREPLY
};

export default VidReply;
