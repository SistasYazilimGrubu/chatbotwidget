import React, { Component } from 'react';
import { connect } from 'react-redux';
import './styles.scss';

class Location extends Component {
  state = {
    slideIndex: 1,
    ids: [],
    button: []
  }

  componentDidMount() {
    const data = this.props.message;
    let ids = [];

    if (this.state.ids.length === 0) {
      for (let i = 0; i < data.arr.length; i++) {
        const id = this.idGenerator();
        ids.push(id);
      }

      this.setState({ ids });
    } else {
      ids = this.state.ids;
    }

    let iter = -1;

    const buttons = data.arr.map((elem, key) => {
      if (iter === -1) {
        iter += 1;

        return (
          <div key={key} id={ids[iter]} className={'location-fade'}>
            <div className="numbertext">
              {`${iter + 1} / ${data.arr.length}`}
            </div>
            <div className="body">
              <div className="locationHeader">
                <div className="image">
                  <img src={this.props.socketUrl + data.img} />
                </div>
                <div className="locationInfo">
                  <p><b>{elem.name}</b></p>
                </div>
              </div>
              <p className="address">
                {elem.address}
              </p>
              {
                data.locationType === 'Şube' ?
                  <div>
                    <div className="properties">
                      <div className="propertyFirst"><b>{data.phoneLabel}</b></div>
                      <div className="propertySecond">{elem.phone}</div>
                    </div>
                    <div className="properties">
                      <div className="propertyFirst"><b>{data.faxLabel}</b></div>
                      <div className="propertySecond">{elem.fax}</div>
                    </div>
                    <div className="properties">
                      <div className="propertyFirst"><b>{data.branchLabel}</b></div>
                      <div className="propertySecond">{elem.branchId}</div>
                    </div>
                  </div>
                  :
                  ''
              }
              <button onClick={() => this.goToMaps(elem)}><span>{data.buttonName}</span></button>
            </div>
          </div>
        );
      }

      iter += 1;
      return (
        <div key={key} id={ids[iter]} className={'location-fade'} style={{ display: 'none' }}>
          <div className="numbertext">
            {`${iter + 1} / ${data.arr.length}`}
          </div>
          <div className="body">
            <div className="locationHeader">
              <div className="image">
                <img src={this.props.socketUrl + data.img} />
              </div>
              <div className="locationInfo">
                <p><b>{elem.name}</b></p>
              </div>
            </div>
            <p className="address"> {elem.address} </p>
            {
              data.locationType === 'Şube' ?
                <div>
                  <div className="properties">
                    <div className="propertyFirst"><b>{data.phoneLabel}</b></div>
                    <div className="propertySecond">{elem.phone}</div>
                  </div>
                  <div className="properties">
                    <div className="propertyFirst"><b>{data.faxLabel}</b></div>
                    <div className="propertySecond">{elem.fax}</div>
                  </div>
                  <div className="properties">
                    <div className="propertyFirst"><b>{data.branchLabel}</b></div>
                    <div className="propertySecond">{elem.branchId}</div>
                  </div>
                </div>
                :
                ''
            }
            <button onClick={() => this.goToMaps(elem)}><span>{data.buttonName}</span></button>
          </div>
        </div>);
    });

    this.setState({ button: buttons });
  }

  getIterationIcons(count) {
    let temp;

    if (count < 2) {
      temp = mapCountLessThanTwo;
    }

    const iteration = (
      <div>
        <a className="prev" style={temp} onClick={() => count >= 2 ? this.minusSlides() : ''}>
          <img src={`${this.props.socketUrl}/content/img/mapsLeftButton.png`} alt="mapsLeftButton" />
        </a>
        <a className="next" style={temp} onClick={() => count >= 2 ? this.plusSlides() : ''}>
          <img src={`${this.props.socketUrl}/content/img/mapsRightButton.png`} alt="mapsLeftButton" />
        </a>
      </div>
    );

    return iteration;
  }

  idGenerator = () => 'xxxxxxyxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; const
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  plusSlides = () => {
    const index = this.state.slideIndex;
    const idsLength = this.state.ids.length;

    if (idsLength > 1) {
      const elem = document.getWebChatElement().getElementById(this.state.ids[index - 1]);
      elem.style.display = 'none';
      const elemblock = document.getWebChatElement().getElementById(this.state.ids[index]);
      elemblock.style.display = 'block';
      this.setState({ slideIndex: (index + 1 < idsLength ? index + 1 : index) });
    }
  }

  minusSlides = () => {
    if (this.state.ids.length > 1) {
      const index = this.state.slideIndex;
      const elem = document.getWebChatElement().getElementById(this.state.ids[index]);
      elem.style.display = 'none';
      const elemblock = document.getWebChatElement().getElementById(this.state.ids[index - 1]);
      elemblock.style.display = 'block';
      this.setState({ slideIndex: (this.state.slideIndex - 1 >= 2 ? this.state.slideIndex - 1 : 1) });
    }
  }

  goToMaps = (elem) => {
    window.open(
      `https://google.com.tr/maps/place/${elem.lat},${elem.long}`,
      '_blank'
    );
  }

  render() {
    const data = this.props.message;

    if (data.arr.length > 0) {
      return (
        <div className={'response location'}>
          <div className="slideshow-container">
            {this.state.button}
            {this.getIterationIcons(data.arr.length)}
          </div>
        </div>
      );
    }

    return (
      <div className="response">
          Lütfen daha sonra tekrar deneyin.
      </div>
    );
  }
}

const mapCountLessThanTwo = {
  opacity: 0.1,
  cursor: 'auto'
};

const mapStateToProps = state => ({
  socketUrl: state.behavior.get('socketUrl')
});

export default connect(mapStateToProps)(Location);
