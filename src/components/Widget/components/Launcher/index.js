import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Badge from './components/Badge';

import './style.scss';

class Launcher extends React.Component {
  render() {
    const {
      toggle,
      isChatOpen,
      badge,
      fullScreenMode,
      openLauncherImage,
      closeImage,
      unreadCount,
      displayUnreadCount
    } = this.props;

    const className = ['launcher'];
    if (isChatOpen) className.push('hide-sm');
    if (fullScreenMode) className.push(`full-screen${isChatOpen ? '  hide' : ''}`);

    const renderOpenLauncherImage = () => (
      <div className="open-launcher__container">
        {
          unreadCount > 0 && displayUnreadCount &&
          <div className="unread-count-pastille">
            {unreadCount}
          </div>
        }
        <img src={this.props.socketUrl + openLauncherImage} className="open-launcher" alt="" />
      </div>
    );

    return (
      <button
        type="button"
        className={className.join(' ')}
        onClick={toggle}
      >
        <Badge badge={badge} />
        {isChatOpen ?
          <img src={this.props.socketUrl + closeImage} className={`close-launcher ${closeImage ? '' : 'default'}`} alt="" /> :
          renderOpenLauncherImage()
        }
      </button>
    );
  }
}

Launcher.propTypes = {
  toggle: PropTypes.func,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  fullScreenMode: PropTypes.bool,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  unreadCount: PropTypes.number,
  displayUnreadCount: PropTypes.bool
};

const mapStateToProps = state => ({
  socketUrl: state.behavior.get('socketUrl'),
  unreadCount: state.behavior.get('unreadCount') || 0
});

export default connect(mapStateToProps)(Launcher);
