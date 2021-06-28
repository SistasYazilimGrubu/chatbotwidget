import React, { PureComponent } from 'react';

import './styles.scss';

class ImgReply extends PureComponent {
  render() {
    const { src, title } = this.props.message;
    return (
      <div className="image">
        <div className="title">
          {title}
        </div>
        <div className="details">
          <img className="frame" src={src} />
        </div>
      </div>
    );
  }
}

export default ImgReply;

