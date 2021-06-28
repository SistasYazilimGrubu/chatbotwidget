import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss';

class DynamicTable extends Component {
  constructor() {
    super();
  }

  render() {
    const { title, menu, header } = this.props.message;

    const list = menu.map(item => (
      <tr key={item}>
        {
          Object.keys(item).map(itemKey => (<tr key={item + itemKey}>
            <td value={itemKey}>{itemKey}</td>
            {(header && header.length > 2) ?
              <div style={{ textAlign: 'center' }}>
                <td value={itemKey} style={{ width: '70px' }}><b>{(item[itemKey][0])}</b></td>
                <td value={itemKey} style={{ width: '90px' }}><b>{(item[itemKey])[1]}</b></td>
              </div> :
              <td value={itemKey} style={{ textAlign: 'center' }}><b>{(item[itemKey])}</b></td>
            }
          </tr>))
        }
      </tr>
    ));

    let status;
    if (header) {
      status = header.map(item => (
        <td style={{ width: '150px' }} key={item} ><b style={{ marginLeft: '-15px' }}>{item}</b></td>
      ));
    }

    return (
      <fieldset className="dynamic-table-response">
        <div className="dynamic-table-title">
          {title}
        </div>
        {header && <div className="dynamic-table">
          <table style={{ width: '100%' }}>
            <tbody>
              <tr style={{ textAlign: 'center' }}>{status}</tr>
            </tbody>
          </table>
        </div>
        }
        <div className="dynamic-table">
          <table style={{ width: '100%' }}>
            <tbody>{list}</tbody>
          </table>
        </div>
      </fieldset>
    );
  }
}

const mapStateToProps = state => ({
  socketUrl: state.behavior.get('socketUrl')
});

export default connect(mapStateToProps)(DynamicTable);
