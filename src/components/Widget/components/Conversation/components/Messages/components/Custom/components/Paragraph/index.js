import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import DocViewer from '../../../docViewer';
import './style.scss';

class Paragraph extends Component {
  idGenerator = () => 'xxxxxxyxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  handleClickButton(item) {
    window.open(item.src, '_blank');
  }

  render() {
    const { docViewer } = this.props;
    const { title, text, menu } = this.props.message;

    let list;
    let detailInfo;

    if (menu !== undefined) {
      list = menu.map((item) => {
        if (item.src === undefined) {
          const id = this.idGenerator();

          return (
            <li key={item} id={id}>{item}</li>
          );
        }
      });

      detailInfo = menu.map((item) => {
        if (item.src !== undefined) {
          const id = this.idGenerator();

          return (
            <button key={item} id={id} className="menu-element" onClick={() => this.handleClickButton(item, id)}>{item.title}</button>
          );
        }
      });
    }

    return (
      <div className={'response'}>
        <div className="paragraph-title">
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
        <div className="list-menu">
          <ul>
            {list != null ? list : ''}
          </ul>
          <div>
            {detailInfo != null ? detailInfo : ''}</div>
        </div>
      </div>
    );
  }
}

export default Paragraph;
