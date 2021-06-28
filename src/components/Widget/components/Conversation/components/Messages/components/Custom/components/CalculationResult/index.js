import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss';

class CalculationResult extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { button } = this.props.message;
    if (button.src != null) {
      window.open(button.src, '_blank');
    }
  }

  render() {
    const { title, menu, button, info } = this.props.message;
    let wrapper;

    if (menu) {
      wrapper = menu.map((item, key) => (
        <div key={key} className="calculation-result-item">
          <div className="calculation-result-item-title"><b>{item.title}</b></div>
          <div className="calculation-result-item-value">{`:${item.value}`}</div>
        </div>
      ));
    }

    return (
      <div className="response">
        <div className="calculation-result-title">
          {title}
        </div>
        <div className="wrapper">
          {wrapper}
        </div>
        <div className="calculation-result-details">
          <button className="calculation-result-detail-button" onClick={this.handleClick}>
            <span>
              {
                (button.img && true) ?
                  button.img.includes('/content/img') ?
                    <img className="button-icon" src={this.props.socketUrl + button.img} />
                    :
                    <img className="button-icon" src={button.img} />
                  :
                  ''
              }
              {button.title}
            </span>
          </button>
        </div>
        <div className="calculation-result-info">
          {info}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socketUrl: state.behavior.get('socketUrl')
});

export default connect(mapStateToProps)(CalculationResult);
