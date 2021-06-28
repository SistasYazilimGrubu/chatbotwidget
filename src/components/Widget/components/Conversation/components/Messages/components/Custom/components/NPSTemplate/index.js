import React, { Component } from 'react';
import './style.scss';

class NPSTemplate extends Component {
  state = {
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
    clickedStarLevel: 0
  }

  hover = (id) => {
    switch (id) {
      case 0:
        this.setState({ star1: false, star2: false, star3: false, star4: false, star5: false });
        break;
      case 1:
        this.setState({ star1: true, star2: false, star3: false, star4: false, star5: false });
        break;
      case 2:
        this.setState({ star1: true, star2: true, star3: false, star4: false, star5: false });
        break;
      case 3:
        this.setState({ star1: true, star2: true, star3: true, star4: false, star5: false });
        break;
      case 4:
        this.setState({ star1: true, star2: true, star3: true, star4: true, star5: false });
        break;
      case 5:
        this.setState({ star1: true, star2: true, star3: true, star4: true, star5: true });
        break;
      default:
        break;
    }
  }

  unHover = () => {
    this.handleClick(this.state.clickedStarLevel);
  }

  handleClick = (id) => {
    this.setState({ clickedStarLevel: id });
    switch (id) {
      case 0:
        this.setState({ star1: false, star2: false, star3: false, star4: false, star5: false });
        break;
      case 1:
        this.setState({ star1: true, star2: false, star3: false, star4: false, star5: false });
        break;
      case 2:
        this.setState({ star1: true, star2: true, star3: false, star4: false, star5: false });
        break;
      case 3:
        this.setState({ star1: true, star2: true, star3: true, star4: false, star5: false });
        break;
      case 4:
        this.setState({ star1: true, star2: true, star3: true, star4: true, star5: false });
        break;
      case 5:
        this.setState({ star1: true, star2: true, star3: true, star4: true, star5: true });
        break;
      default:
        break;
    }
  }

  writeReview = () => {
    document.getWebChatElement().getElementById('reviewInput').style.display = 'block';
    document.getWebChatElement().getElementById('isReview').style.display = 'none';
  }

  submitReviewForm() {
    const reviewText = document.getWebChatElement().getElementById('reviewInput').value;
    const reviewForm = { score: this.state.clickedStarLevel, reviewText };
    console.log(reviewForm);
  }

  render() {
    return (
      <div className="response">
        <h3 style={{ textAlign: 'center', marginBottom: '18px' }}><b>Konuşmayı Değerlendir</b></h3>
        <div style={{ display: 'flex', width: '226px' }}>
          <img
            onClick={() => this.handleClick(1)}
            onMouseOver={() => this.hover(1)}
            onMouseOut={() => this.unHover()}
            src={this.state.star1 === false ? 'http://localhost:28080/widget/content/img/emptystar.png'
              : 'http://localhost:28080/widget/content/img/filledstar.png'}
            style={{ marginRight: '10px' }}
          />
          <img
            onClick={() => this.handleClick(2)}
            onMouseOver={() => this.hover(2)}
            onMouseOut={() => this.unHover()}
            src={this.state.star2 === false ? 'http://localhost:28080/widget/content/img/emptystar.png'
              : 'http://localhost:28080/widget/content/img/filledstar.png'}
            style={{ marginRight: '10px' }}
          />
          <img
            onClick={() => this.handleClick(3)}
            onMouseOver={() => this.hover(3)}
            onMouseOut={() => this.unHover()}
            src={this.state.star3 === false ? 'http://localhost:28080/widget/content/img/emptystar.png'
              : 'http://localhost:28080/widget/content/img/filledstar.png'}
            style={{ marginRight: '10px' }}
          />
          <img
            onClick={() => this.handleClick(4)}
            onMouseOver={() => this.hover(4)}
            onMouseOut={() => this.unHover()}
            src={this.state.star4 === false ? 'http://localhost:28080/widget/content/img/emptystar.png'
              : 'http://localhost:28080/widget/content/img/filledstar.png'}
            style={{ marginRight: '10px' }}
          />
          <img
            onClick={() => this.handleClick(5)}
            onMouseOver={() => this.hover(5)}
            onMouseOut={() => this.unHover()}
            src={this.state.star5 === false ? 'http://localhost:28080/widget/content/img/emptystar.png'
              : 'http://localhost:28080/widget/content/img/filledstar.png'}
            style={{ marginRight: '10px' }}
          />
        </div>
        <br />
        <textarea
          id="reviewInput" placeholder="değerlendir... (isteğe bağlı)"
          style={{ width: '100%', display: 'none', resize: 'none' }} className="inputStyle"
        />
        <p id="isReview" onClick={this.writeReview} style={{ color: 'green', cursor: 'pointer' }}>Değerlendirme Yaz</p>
        <br />
        <button
          style={{ width: '100%', borderRadius: '10px', height: '30px' }}
          onClick={() => this.submitReviewForm()}
        >
          Gönder
        </button>
      </div>
    );
  }
}

export default NPSTemplate;
