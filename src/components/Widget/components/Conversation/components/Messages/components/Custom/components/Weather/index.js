import React, { Component } from 'react';
import './style.scss';

class Weather extends Component {
  constructor() {
    super();
    this.callWeatherImage.bind(this);
  }

  callWeatherImage(name) {
    const map = new Map();
    map.set('clearsky', "<img width='80px' height='80px' src='/assets/sunny.png'/>");
    map.set('fewclouds', "<img width='80px' height='80px' src='/assets/fewclouds.png'/>");
    map.set('brokenclouds', "<img width='80px' height='80px' src='/assets/brokenclouds.png'/>");
    return map.get(name);
  }

  render() {
    const date = new Date();
    const dateTimeNow = date.toLocaleString();
    const weather = this.props.message;

    return (
      <div className={'response'} style={{ width: '200px' }}>
        <div style={{ display: 'inline', textAlign: 'center' }}>
          <div>
              Image
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '5%' }}>
          <div style={{ width: '50%', textAlign: 'center' }}>
            <h2> {`${weather.min_temperature} °C`} </h2>
          </div>
          <div style={{ width: '50%', textAlign: 'center' }}>
            <h2> {`${weather.max_temperature} °C`} </h2>
          </div>
        </div>
        <div style={{ marginTop: '5%', marginBottom: '5%', textAlign: 'center' }}>
          <div>
            {`Nem Oranı: % ${weather.humidity}`}
          </div>
        </div>
        <div
          style={{
            marginTop: '5%',
            marginBottom: '5%',
            borderBottom: '1px solid #d9dbde',
            height: '26px',
            textAlign: 'center'
          }}
        >
          <div>
            {`Rüzgar Hızı: ${weather.wind} m/s`}
          </div>
        </div>
        <div style={{ display: 'inline', textAlign: 'center' }}>
          <div>
            {dateTimeNow}
          </div>
        </div>
      </div>
    );
  }
}

export default Weather;
