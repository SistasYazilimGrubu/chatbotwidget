import React from 'react';
import { connect } from 'react-redux';
import { addUserMessage, emitUserMessage, showInformationForm } from 'actions';
import './styles.scss';

class InformationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  menuClickQuickReply(conversation) {
    const reply = { text: conversation };
    this.props.submitMessage(reply);
    if (this.props.showInformation === true) {
      this.props.showInformationForm();
      document.getWebChatElement().getElementById('messages-wrapper').style.display = 'block';
      document.getWebChatElement().getElementById('messageDiv') ? document.getWebChatElement().getElementById('messageDiv').style.display = '' : '';
      document.getWebChatElement().getElementById('informationForm').style.display = 'none';
    }
  }

  render() {
    const path = '/content/img/';
    // const template = document.getWebChatElement().getElementById("info-message").innerHTML;
    const { images, texts, socketUrl, menuQuickReplies, titleInfo, info } = this.props;

    return (
      <div className="information-form">
        <div className="scale-up-ver-top unselectable">
          {/* <div dangerouslySetInnerHTML={{ __html: template }} /> */}
          <div className="title-info"> {titleInfo} </div>
          <div className="wrapper-info">
            {images.map((item, index) => <div key={index} className="img-wrapper">
              <img className="image" src={socketUrl + path + item} />
              <p
                onClick={this.menuClickQuickReply.bind(this, menuQuickReplies[index] ? menuQuickReplies[index] : '')}
                className="item"
              >
                {texts[index]}
              </p>
            </div>
            )}
          </div>
          <div className="info">{info}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showInformation: state.behavior.get('showInformation'),
  socketUrl: state.behavior.get('socketUrl')
});

const mapDispatchToProps = dispatch => ({
  submitMessage: (payload) => {
    dispatch(addUserMessage(payload));
    dispatch(emitUserMessage(payload));
  },
  showInformationForm: () => {
    dispatch(showInformationForm());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(InformationForm);
