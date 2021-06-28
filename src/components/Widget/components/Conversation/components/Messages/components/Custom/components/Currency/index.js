import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss';

class Currency extends Component {
  render() {
    const { currency, buyRate, sellRate, rate, result, amount, date, increaseImage, decreaseImage, targetSymbol } = this.props.message;

    let header;

    if (amount > 1) {
      header = `${amount} ${currency} = ${result}` + 'Türk Lirası';

      return (
        <div className={'response currency'}>
          <div className="flag">
            <div className="body">
              <b>{`${currency} / Türk Lirası`}</b>
            </div>
          </div>
          <div className="trends">
            {
              rate > 0 ?
                <div className="trend">
                  <img width="20px" className="trend-img" src={this.props.socketUrl + increaseImage} />
                  <div>{`%${rate}`}</div>
                </div>
                :
                <div className="trend">
                  <img width="20px" className="trend-img" src={this.props.socketUrl + decreaseImage} />
                  <div>{`%${rate}`}</div>
                </div>
            }
          </div>
          <div className="amount">
            <div dangerouslySetInnerHTML={{ __html: header }} />
          </div>
          <br />
          <div className="forex-text">
            <div className="operation">
              <b>Alış:</b> {`${sellRate} ${targetSymbol}`}
            </div>
            <div className="operation">
              <b>Satış:</b> {`${buyRate} ${targetSymbol}`}
            </div>
          </div>
          <div className="date">
            <p>{date}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={'response currency'}>
        <div className="flag">
          <div className="body">
            {currency}
          </div>
        </div>
        <div className="trends">
          {
            rate > 0 ?
              <div className="trend">
                <img
                  width="20px" className="trend-img" style={{ marginTop: '-5px', marginRight: '3px' }}
                  src={this.props.socketUrl + increaseImage}
                />
                <div>{`%${rate}`}</div>
              </div>
              :
              <div className="trend">
                <img
                  width="20px" className="trend-img" style={{ marginTop: '-5px', marginRight: '3px' }}
                  src={this.props.socketUrl + decreaseImage}
                />
                <div>{`%${rate}`}</div>
              </div>
          }
        </div>
        <div className="forex-text">
          <div className="operation">
            <b>Alış:</b> {`${sellRate} ${targetSymbol}`}
          </div>
          <div className="operation">
            <b>Satış:</b> {`${buyRate} ${targetSymbol}`}
          </div>
        </div>
        <div className="date">
          <p> {date} </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socketUrl: state.behavior.get('socketUrl')
});

export default connect(mapStateToProps)(Currency);
