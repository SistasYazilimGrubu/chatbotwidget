import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PROP_TYPES } from 'constants';
import DocViewer from '../docViewer';
import './styles.scss';

class Message extends PureComponent {
  messageTemplate = () => {
    const div = document.getWebChatElement().getElementById('messageText');
    const parag = document.createElement('p');
    parag.innerText = this.text;
    const button = document.createElement('button');
    button.style.width = '50px';
    button.value = 'test';
    div.appendChild(button);
  };

  replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }

  render() {
    const { docViewer } = this.props;
    const sender = this.props.message.get('sender');
    let text = this.props.message.get('text');
    text = this.replaceAll(text, '![image](/content', `![image](${this.props.socketUrl}/content`);

    return (
      <div className={sender}>
        <div className="message-text" id="messageText">
          {sender === 'response' ? (
            <ReactMarkdown
              className={'markdown'}
              source={text}
              linkTarget={(url) => {
                if (!url.startsWith('mailto') && !url.startsWith('javascript')) return '_blank';
                return undefined;
              }}
              transformLinkUri={null}
              renderers={{
                link: props =>
                  docViewer ? (
                    <DocViewer src={props.href}>{props.children}</DocViewer>
                  ) : (
                    <a href={props.href} style={{ textDecoration: 'none' }} target="_blank">tıklayınız...</a>
                  )
              }}
            />
          ) : (
            text
          )}
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  message: PROP_TYPES.MESSAGE,
  docViewer: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  socketUrl: state.behavior.get('socketUrl'),
  docViewer: state.behavior.get('docViewer')
});

export default connect(mapStateToProps)(Message);
