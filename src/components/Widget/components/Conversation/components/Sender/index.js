import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showInformationForm } from 'actions';
import './style.scss';

class Sender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passiveSenderImage: `${this.props.socketUrl}/content/img/sender.svg`,
      activeSenderImage: `${this.props.socketUrl}/content/img/sender-active.svg`
    };
  }

  onClickButton = () => {
    const icon = document.getWebChatElement().getElementById('sendicon');
    icon.setAttribute('src', this.state.passiveSenderImage);
  };

  onChangeKeyDown(e) {
    if (e === 'Enter') {
      const icon = document.getWebChatElement().getElementById('sendicon');
      icon.setAttribute('src', this.state.passiveSenderImage);
    }
  }

  onChange(value) {
    if (value.length >= 1) {
      const icon = document.getWebChatElement().getElementById('sendicon');
      icon.setAttribute('src', this.state.activeSenderImage);
    } else if (value.length === 0) {
      const icon = document.getWebChatElement().getElementById('sendicon');
      icon.setAttribute('src', this.state.passiveSenderImage);
    }
  }

  closeInformationForm = () => {
    if (this.props.showInformation === true) {
      this.props.showInformationForm();
    }
  };

  render() {
    const { sendMessage, inputFieldTextHint, disabledInput } = this.props;

    if (!this.props.readonly) {
      return (
        <form className="sender" id={this.props.readonly} onSubmit={sendMessage}>
          <input
            type="text" id="sendinput" onKeyPress={e => this.onChangeKeyDown(e.key)}
            onChange={e => this.onChange(e.target.value)} onClick={this.closeInformationForm} autoFocus="true"
            className="new-message" name="message" placeholder={inputFieldTextHint} disabled={disabledInput}
            maxLength={this.props.inputCharacterLength} autoComplete="off"
          />
          <button type="submit" onClick={this.onClickButton} id="sendbutton" className="send">
            <img src={this.state.passiveSenderImage} id="sendicon" className="send-icon" alt="send" />
          </button>
        </form>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  inputFieldTextHint: state.behavior.get('inputFieldTextHint'),
  socketUrl: state.behavior.get('socketUrl')
});

const mapDispatchToProps = dispatch => ({
  showInformationForm: () => {
    dispatch(showInformationForm());
  }
});

Sender.propTypes = {
  sendMessage: PropTypes.func,
  inputFieldTextHint: PropTypes.string,
  inputCharacterLength: PropTypes.number,
  disabledInput: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(Sender);
