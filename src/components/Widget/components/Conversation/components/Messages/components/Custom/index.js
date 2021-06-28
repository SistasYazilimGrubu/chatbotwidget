import React, { Component } from 'react';
import Button from './components/Button';
import CalculationResult from './components/CalculationResult';
import Currency from './components/Currency';
import Donut from './components/Donut';
import DynamicForm from './components/DynamicForm';
import DynamicTable from './components/DynamicTable';
import Location from './components/Location';
import Paragraph from './components/Paragraph/index';
import RedirectChatOptions from './components/RedirectChatOptions';
import Weather from './components/Weather';
import ImgReply from '../ImgReply/index';
import VidReply from '../VidReply/index';

class Custom extends Component {
  render() {
    let custom = this.props.message.get('custom');
    let type = this.props.message.get('custom').type;

    if (type == null) {
      custom = JSON.parse(custom);
      type = custom.type;
    }

    switch (type) {
      case 'button':
        return (<Button key={type} message={custom} />);
      case 'calculationResults':
        return (<CalculationResult key={type} message={custom} />);
      case 'currency':
        return (<Currency key={type} message={custom} />);
      case 'donut':
        return (<Donut key={type} message={custom} />);
      case 'dynamicForm':
        return (<DynamicForm key={type} message={custom} />);
      case 'dynamicTable':
        return (<DynamicTable key={type} message={custom} />);
      case 'location':
        return (<Location key={type} message={custom} />);
      case 'paragraph':
        return (<Paragraph key={type} message={custom} />);
      case 'weather':
        return (<Weather key={type} message={custom} />);
      case 'image':
        return (<div className="custom"><ImgReply key={type} message={custom} /></div>);
      case 'video':
        return (<VidReply key={type} message={custom} />);
      case 'changeChatMessageTarget':
        return (<RedirectChatOptions key={type} messagesComponent={this.props.messagesComponent} message={custom} />);
    }
    // TODO: ERROR TEMPLATE
    return (
      <div className="response">
          Şu anda hizmet veremiyorum.
      </div>
    );
  }
}

export default Custom;
