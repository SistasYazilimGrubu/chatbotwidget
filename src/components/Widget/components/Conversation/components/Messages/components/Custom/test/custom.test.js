import React from 'react';
import { shallow } from 'enzyme';
import { createCustomSnippet } from 'helper';

import Custom from '../index';
import Currency from '../components/Currency';
import Location from '../components/Location';
import Paragraph from '../components/Paragraph';
import RedirectChatOptions from '../components/RedirectChatOptions';
import CalculationResultForm from '../components/CalculationResult';
import customMock from '../../../../../../../../../../mocks/customMock';

describe('<Custom />', () => {
  const sender = 'response';

  // Currency Component

  const currencyModel = customMock.currencyModel;

  const currency = createCustomSnippet(currencyModel, sender);

  const currencyComponent = shallow(
    <Custom.WrappedComponent
      message={currency}
    />
  );

  it('should render a Currency component', () => {
    expect(currencyComponent.find(Currency)).toHaveLength(1);
  });

  // Location Component

  const locationModel = customMock.locationModel;

  const location = createCustomSnippet(locationModel, sender);

  const locationComponent = shallow(
    <Custom.WrappedComponent
      message={location}
    />
  );

  it('should render a Location component ', () => {
    expect(locationComponent.find(Location)).toHaveLength(1);
  });

  it('should create a prev button in location component ', () => {
    expect(locationComponent.find('.prev')).toBeDefined();
  });

  it('should create a next button in location component  ', () => {
    expect(locationComponent.find('.next')).toBeDefined();
  });

  // Paragraph Component

  const paragraphModel = customMock.paragraphModel;

  const paragraph = createCustomSnippet(paragraphModel, sender);

  const paragraphComponent = shallow(
    <Custom.WrappedComponent
      message={paragraph}
    />
  );

  it('should render a Paragraph component', () => {
    expect(paragraphComponent.find(Paragraph)).toHaveLength(1);
  });

  // RedirectChatOptions Component

  const redirectChatOptionsModel = customMock.redirectChatOptionsModel;

  const redirectChat = createCustomSnippet(redirectChatOptionsModel, sender);

  const redirectChatComponent = shallow(
    <Custom.WrappedComponent
      message={redirectChat}
    />
  );

  it('should render a RedirectChatOptions component', () => {
    expect(redirectChatComponent.find(RedirectChatOptions)).toHaveLength(1);
  });

  // CalculationResult Component

  const calculationModel = customMock.calculationResultModel;
  const CalculationResultForms = createCustomSnippet(calculationModel, sender);

  const CalculationResultFormComponent = shallow(
    <Custom.WrappedComponent
      message={CalculationResultForms}
    />
  );

  it('should render a CalculationResultForm component', () => {
    expect(CalculationResultFormComponent.find(CalculationResultForm)).toHaveLength(1);
  });
});
