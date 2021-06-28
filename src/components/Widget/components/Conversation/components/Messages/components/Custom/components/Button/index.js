import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addUserMessage, emitUserMessage } from 'actions';
import ReactMarkdown from 'react-markdown';
import DocViewer from '../../../docViewer';
import './style.scss';

class Button extends Component {
  constructor() {
    super();
    this.handleClickButton = this.handleClickButton.bind(this);
  }

  idGenerator = () => 'xxxxxxyxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  handleClickButton(item) {
    if (item.buttonType === 'url') {
      window.open(item.src, '_blank');
    }

    if (item.buttonType === 'payload') {
      const reply = { text: item.payload != null ? item.payload : item.title };
      this.props.submitMessage(reply);
    }
  }

  showMoreButton(count, buttonIds, id) {
    const buttonItem = document.getWebChatElement().getElementById(`show-more-button-${id}`);
    const textItem = document.getWebChatElement().getElementById(`text-${id}`);

    if (buttonItem.classList.contains('show-more-button') && !buttonItem.classList.contains('open')) {
      for (let i = 7; i <= count; i++) {
        const menu = document.getWebChatElement().getElementById(buttonIds[i - 1]);
        menu.style.display = '';
      }

      textItem.innerText = 'DAHA AZ GÖSTER';
      buttonItem.classList.add('open');
    } else {
      for (let i = 7; i <= count; i++) {
        const menu = document.getWebChatElement().getElementById(buttonIds[i - 1]);
        menu.style.display = 'none';
      }

      textItem.innerText = 'DAHA FAZLA GÖSTER';
      buttonItem.classList.remove('open');
    }
  }

  render() {
    const { docViewer, buttonType } = this.props;
    const { title, text, menu } = this.props.message;

    const buttonIds = [];
    let buttonCount = 0;
    let response;

    let cssTypeGreaterThen;
    let cssTypeLessThen;

    if (buttonType !== undefined && buttonType.toLowerCase() === 'rectangle') {
      cssTypeGreaterThen = 'reply-greater-then-five';
      cssTypeLessThen = 'reply-less-then-six';
    } else {
      cssTypeGreaterThen = 'reply-greater-then-four';
      cssTypeLessThen = 'reply-less-then-five';
    }

    if (menu.length < 5) {
      response = menu.map((item) => {
        const id = this.idGenerator();
        buttonIds.push(id);

        return (
          <button
            key={item.title} id={id} className={cssTypeLessThen}
            onClick={this.handleClickButton.bind(this, item, buttonIds)}
          >
            <span>
              {
                (item.img && true) ?
                  item.img.includes('/content/img') ?
                    <img className="button-icon" src={this.props.socketUrl + item.img} />
                    :
                    <img className="button-icon" src={item.img} />
                  :
                  ''
              }
              <div className={'text'}>{item.title}</div>
            </span>
          </button>
        );
      });
    } else if (menu.length >= 5) {
      response = menu.map((item) => {
        const id = this.idGenerator();
        buttonIds.push(id);
        buttonCount += 1;

        if (buttonCount < 7) {
          return (
            <button
              key={item.title} id={id} className={cssTypeGreaterThen}
              onClick={this.handleClickButton.bind(this, item, buttonIds)}
            >
              <span>
                {
                  (item.img && true) ?
                    item.img.includes('/content/img') ?
                      <img className="button-icon" src={this.props.socketUrl + item.img} />
                      :
                      <img className="button-icon" src={item.img} />
                    :
                    ''
                }
                <div className={'text'}>{item.title}</div>
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.title} id={id} className={cssTypeGreaterThen} style={{ display: 'none' }}
            onClick={this.handleClickButton.bind(this, item, buttonIds)}
          >
            <span>
              {
                (item.img && true) ?
                  item.img.includes('/content/img') ?
                    <img className="button-icon" src={this.props.socketUrl + item.img} />
                    :
                    <img className="button-icon" src={item.img} />
                  :
                  ''
              }
              <div className={'text'}>{item.title}</div>
            </span>
          </button>
        );
      });

      if (menu.length > 6) {
        const id = this.idGenerator();
        response.push(
          <button
            key={'showMoreButton'} id={`show-more-button-${id}`} className="show-more-button"
            onClick={this.showMoreButton.bind(this, menu.length, buttonIds, id)}
          >
            <span id={`text-${id}`}>
                DAHA FAZLA GÖSTER
            </span>
            <img id={`img-${id}`} className="icon" src={`${this.props.socketUrl}/content/img/showmoredown.png`} />
          </button>
        );
      }
    }

    return (
      <div className={'response button'}>
        <div className="button-title">
          {title != null ? title : ''}
        </div>
        <ReactMarkdown
          className={'markdown'}
          source={text}
          linkTarget={(url) => {
            if (!url.startsWith('mailto') && !url.startsWith('javascript')) {
              return '_blank';
            }
            return undefined;
          }}
          transformLinkUri={null}
          renderers={{
            link: props => docViewer ?
              (
                <DocViewer src={props.href}>{props.children}</DocViewer>
              ) : (
                <a href={props.href} style={{ textDecoration: 'none' }} target="_blank">{props.href}</a>
              )
          }}
        />
        <div className="replies">
          {response}
          <br />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socketUrl: state.behavior.get('socketUrl'),
  buttonType: state.behavior.get('buttonType')
});

const mapDispatchToProps = dispatch => ({
  submitMessage: (payload) => {
    dispatch(addUserMessage(payload));
    dispatch(emitUserMessage(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);

