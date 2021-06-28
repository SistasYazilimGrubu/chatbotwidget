import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addUserMessage, emitUserMessage } from 'actions';
import Select from './../../../../../../../../../../utils/react-select/Select';
import './style.scss';

class DynamicForm extends Component {
  constructor() {
    super();
    this.handleDependent = this.handleDependent.bind();

    Select.prototype.handleTouchOutside = () => {
    };
  }

  state = {
    parentElement: '',
    open: false
  };

  componentWillMount() {
    const { menu } = this.props.message;

    menu.map((item) => {
      if (item.node === 'dropdown' && (item.defaultValue !== 'None')) {
        const defaultValue = item.defaultValue;

        item.options.map((item) => {
          if (item.value === defaultValue) {
            this.setState({ [item.src]: item });
            this.handleDependent(item);
          }
        });
      }
    });
  }

  idGenerator = () => 'xxxxxxyxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; const
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  handleButtonClick = () => {
    this.setState(state => ({
      open: !state.open
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let { menu, userResponse, botResponse, userResponseWithDependent } = this.props.message;
    let isValid = true;
    let i = 0;
    this.setState({ elements: e.target.elements });

    if (e.target.elements.length === menu.length) {
      menu.map((item) => {
        if (item.node === 'dropdown' && this.state[item.src] == null) {
          isValid = false;
          e.target.elements[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = 'select-style dropdown form-elements-error';
        } else if (item.node !== 'dropdown' && e.target.elements[i].value === '' && e.target.elements[i].id !== '' && e.target.elements[i].type !== 'submit') {
          e.target.elements[i].classList.add('form-elements-error');
          isValid = false;
        }

        i += 1;
      });
    } else {
      for (let l = 0; l < (e.target.elements.length - 1); l++) {
        const dependentDiv = document.getWebChatElement().getElementById(this.state[`${menu[l].src}-key`] != null ? this.state[`${menu[l].src}-key`] : '');

        if (dependentDiv != null && dependentDiv.getAttribute('data-newElement') === 'newElement') {
        } else if (menu[l].node === 'dropdown' && menu[l].src !== e.target[l + 1].id && this.state[menu[l].src] == null) {
          isValid = false;
          e.target.elements[l].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = 'select-style dropdown form-elements-error';
        } else if (e.target.elements[l + 1].value === '' && menu[l + 1].node === 'input' && e.target.elements[l + 1].type !== 'submit') {
          isValid = false;
          e.target.elements[l + 1].classList.add('form-elements-error');
        }
      }
    }

    if (isValid) {
      this.setState({ clicked: true });

      for (const k in e.target.elements) {
        if (e.target.elements[k].setAttribute) {
          e.target.elements[k].setAttribute('disabled', 'disabled');
        }
      }

      let i = 0;
      if (e.target.elements.length === menu.length) {
        menu.map((item) => {
          const element = e.target.elements[i];
          const target = e.target[i];
          const state = this.state[item.src];

          if (item.node === 'radiobutton' || item.node === 'checkbox') {
            if (element != null && target != null && element.checked === true) {
              userResponse = userResponse.replace(`+${target.id}+`, target.value);
              botResponse !== undefined ? botResponse = botResponse.replace(`+${target.id}+`, target.value) : undefined;
            }
          } else if (state != null && item.node === 'dropdown') {
            if (state.amountType != null) {
              userResponse = userResponse.replace(`+${item.src}+`, state.amountType !== 'None' ? (`${state.amountType} ${state.label}`) : state.label);
            } else {
              userResponse = userResponse.replace(`+${item.src}+`, state.label);
            }
          } else if (target != null) {
            userResponse = userResponse.replace(`+${target.id}+`, target.value);
          }

          i += 1;
        });

        const response = { text: userResponse };
        const rasaResponse = { text: '' };

        if (botResponse != null) {
          rasaResponse.text = botResponse;
          this.props.submitMessageFind(rasaResponse, response);
        } else {
          this.props.submitMessage(response);
          e.target.style.opacity = '0.4';
        }
      } else {
        let responseModel = userResponse;

        for (let k = 0; k < e.target.length - 1; k++) {
          if (e.target[k].getAttribute('data-change') !== null) {
            responseModel = userResponseWithDependent;
          }
        }

        for (let l = 0; l < (e.target.elements.length - 1); l++) {
          const target = e.target[l];
          const menuItem = menu[l];
          const state = this.state[menuItem.src];

          const dependentDiv = document.getWebChatElement().getElementById(this.state[`${menuItem.src}-key`] != null ? this.state[`${menuItem.src}-key`] : '');

          if (target != null && (dependentDiv == null || dependentDiv.getAttribute('data-newElement') !== 'newElement')) {
            if (target.type === 'radio' || target.type === 'checkbox') {
              if (e.target.elements[l].checked === true) {
                responseModel = responseModel.replace(`+${target.id}+`, target.value);

                if (botResponse != null) {
                  botResponse = botResponse.replace(`+${target.id}+`, target.value);
                }
              }
            } else if (state != null && menuItem.node === 'dropdown' && menuItem.src !== e.target[l + 1].id) {
              if (state.amountType != null) {
                responseModel = responseModel.replace(`+${menuItem.src}+`, state.amountType !== 'None' ? `${state.amountType} ${state.label}` : state.label);
              } else {
                responseModel = responseModel.replace(`+${menuItem.src}+`, state.label);
              }
            } else {
              responseModel = responseModel.replace(`+${target.id}+`, target.value);
            }
          }
        }

        const response = { text: responseModel };

        String.prototype.turkishToUpper = function () {
          let string = this;
          const letters = { i: 'İ', ş: 'Ş', ğ: 'Ğ', ü: 'Ü', ö: 'Ö', ç: 'Ç', ı: 'I' };
          string = string.replace(/(([iışğüçö]))/g, letter => letters[letter]);
          return string.toUpperCase();
        };

        response.text = response.text[0].turkishToUpper() + response.text.slice(1);
        this.props.submitMessage(response);
        e.target.style.opacity = '0.4';
      }
    }
  };

  sortBy = property => function (x, y) {
    return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
  };

  handleDependent = (item) => {
    const { menu } = this.props.message;

    menu.map((element) => {
      if (element.src === item.src) {
        const itemValue = item.label;

        element.options.map((option) => {
          if (option.dependent !== undefined) {
            if (itemValue === option.label) {
              option.dependent.map((dependent) => {
                const parentElement = document.getWebChatElement().getElementById(this.state[`${item.src}-key`]);

                if (parentElement.childElementCount < option.dependent.length + 1) {
                  const newElement = document.createElement(dependent.node);
                  const wrapperDiv = document.getWebChatElement().getElementById(element.src);
                  wrapperDiv.setAttribute('data-newElement', 'newElement');
                  newElement.setAttribute('type', dependent.input_type);
                  newElement.setAttribute('autoComplete', 'off');
                  newElement.setAttribute('required', element.not_null === true ? 'required' : false);
                  newElement.setAttribute('data-change', 'change');
                  newElement.setAttribute('id', element.src);
                  this.setState({ parentElement });
                  newElement.setAttribute('placeholder', dependent.placeholder);
                  parentElement.appendChild(newElement);
                }
              });
            }
          }
        });

        if (item.value !== 'günlük' && item.src === 'vade' && this.state.parentElement !== '') {
          const element = document.getWebChatElement().getElementById(this.state.parentElement.id);

          for (let i = 1; i < element.childElementCount; i++) {
            element.removeChild(element.childNodes[i]);
          }

          this.setState({ parentElement: '' });
        }
      }
    });
  };

  handleChange = (value) => {
    this.setState({ [value.src]: value });
    this.handleDependent(value);
    document.getWebChatElement().getElementById(this.state[`${value.src}-key`]).classList.remove('form-elements-error');
  };

  inputOnChange(e) {
    e.target.classList.remove('form-elements-error');
  }

  inputValidation(e) {
    if (e.target.value.match('[A-Za-zıIşŞğĞçÇöÖüÜİ]$') === null) {
      e.target.value = e.target.value.slice(0, e.target.value.length - 1);
    }
  }

  inputNumberValidation(e) {
    try {
      const number = parseInt(e.target.value);

      if (isNaN(number) || number <= 0) {
        e.target.value = null;
        return;
      } else if (`${number}` !== e.target.value) {
        e.target.value = `${number}`;
      }

      if (e.target.value.length > e.target.maxLength) {
        e.target.value = e.target.value.slice(0, e.target.value.length - 1);
      }

      e.target.classList.remove('form-elements-error');
    } catch (_e) {
      e.target.value = null;
    }
  }

  render() {
    const { menu, title } = this.props.message;
    menu.sort(this.sortBy('queue'));

    const formElements = menu.map((item) => {
      if (item.node === 'input' && item.input_type !== 'submit') {
        let defaultValue = '';

        if (item.input_type !== 'submit' && item.defaultValue !== 'None') {
          defaultValue = item.defaultValue;
        }

        const required = item.not_null === 'True' ? 'required' : '';

        return (
          <div>
            <input
              required={required} id={item.src} defaultValue={defaultValue !== '' ? defaultValue : item.value}
              min="0" maxLength={item.max_value ? item.max_value.length : null}
              onChange={this.inputOnChange && item.input_type === 'text' ? this.inputValidation : this.inputNumberValidation}
              type="text" placeholder={item.placeholder}
              name={item.src} autoComplete="off" disabled={this.state.clicked === true ? 'disabled' : ''}
            />
            <br />
          </div>
        );
      } else if (item.input_type === 'submit') {
        return (
          <div>
            <input
              disabled={this.state.clicked === true ? 'disabled' : ''} id={item.src} type="submit"
              value={item.value}
            />
            <br />
          </div>
        );
      } else if (item.node === 'dropdown') {
        if (item.options.length > 0) {
          const id = this.idGenerator();

          if (this.state[`${item.src}-key`] === undefined) {
            this.setState({ [`${item.src}-key`]: id });
          }

          return (
            <div className="select-style dropdown" data-key={id} id={this.state[`${item.src}-key`]}>
              <div className="template-wrapper" id={item.src}>
                <Select
                  required
                  data-key={id}
                  placeholder={item.placeholder}
                  onChange={this.handleChange}
                  value={this.state[item.src]}
                  options={item.options}
                  disabled={this.state.clicked}
                  id={item.src}
                />
              </div>
            </div>
          );
        }
      } else if (item.node === 'checkbox') {
        if (item.options.length > 0) {
          const id = item.src;

          return (
            item.options.map((item) => {
              const checked = item.checked === true ? 'defaultChecked' : '';

              return (
                <label>
                  <input key={item.src} id={id} type="checkbox" defaultChecked={checked} value={item.title} />
                  {item.title}
                </label>
              );
            })
          );
        }
      } else if (item.node === 'radiobutton') {
        if (item.options.length > 0) {
          const id = item.src;
          const key = this.idGenerator();
          let checked = '';
          let defaultChecked = '';

          if (item.defaultValue === 'atm') {
            checked = 'atm';
          } else {
            checked = 'sube';
          }

          return (
            <div className="radio-wrapper">
              {
                item.options.map((item) => {
                  defaultChecked = '';

                  if (checked === item.src) {
                    defaultChecked = 'checked';
                  }

                  return (
                    <wrapper>
                      <input
                        key={item.src + key} id={id} name={id} type="radio" defaultChecked={defaultChecked}
                        value={item.title} disabled={this.state.clicked === true ? 'disabled' : ''}
                      />
                      <label htmlFor={id}>{item.title}</label>
                    </wrapper>
                  );
                })
              }
            </div>
          );
        }
      }
    });

    return (
      <div className="response">
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="form-title">
            {title}
          </div>
          <div id="form-elem" className="form-elements">
            {formElements}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  submitMessageFind: (botResponse, userResponse) => {
    dispatch(addUserMessage(userResponse));
    dispatch(emitUserMessage(botResponse));
  },
  submitMessage: (userResponse) => {
    dispatch(addUserMessage(userResponse));
    dispatch(emitUserMessage(userResponse));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DynamicForm);
