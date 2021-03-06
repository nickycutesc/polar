import React from 'react';
import { getI18n, useTranslation } from 'react-i18next';
import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from 'utils/tests';
import AppLayout from './AppLayout';

describe('AppLayout component', () => {
  const renderComponent = (route?: string) => {
    const initialState = {
      app: {
        initialized: true,
      },
    };
    // create a wrapper component to test language switching
    const LangWrapper: React.FC = () => {
      const { t } = useTranslation();
      return (
        <AppLayout>
          <p>Hello World!</p>
          <p>{t('cmps.home.GetStarted.title')}</p>
        </AppLayout>
      );
    };
    return renderWithProviders(<LangWrapper />, { route, initialState });
  };

  beforeEach(async () => {
    await getI18n().changeLanguage('en-US');
  });

  it('should contain the text of child components', () => {
    const { getByText } = renderComponent();
    expect(getByText('Hello World!')).toBeInTheDocument();
  });

  it('should have language set to English by default', () => {
    const { getByText } = renderComponent();
    expect(getByText("Let's get started!")).toBeInTheDocument();
  });

  it('should navigate to home page when logo clicked', async () => {
    const { findByAltText, history } = renderComponent('/network');
    fireEvent.click(await findByAltText('logo'));
    expect(history.location.pathname).toEqual('/');
  });

  describe('Language Switcher', () => {
    it('should set language to English', async () => {
      const { getByText, findByText } = renderComponent();
      expect(getByText("Let's get started!")).toBeInTheDocument();
      fireEvent.mouseEnter(getByText('English'));
      fireEvent.click(await findByText('Español (es-ES)'));
      expect(await findByText('¡Empecemos!')).toBeInTheDocument();
      fireEvent.click(getByText('English (en-US)'));
      expect(await findByText("Let's get started!")).toBeInTheDocument();
    });

    it('should set language to Spanish', async () => {
      const { getByText, findByText } = renderComponent();
      expect(getByText("Let's get started!")).toBeInTheDocument();
      fireEvent.mouseEnter(getByText('English'));
      fireEvent.click(await findByText('Español (es-ES)'));
      expect(await findByText('¡Empecemos!')).toBeInTheDocument();
    });
  });

  describe('Theme Switcher', () => {
    it('should display dark mode by default', async () => {
      const { getByText } = renderComponent();
      expect(getByText('Dark')).toBeInTheDocument();
    });

    it('should switch to Light mode', async () => {
      const { getByText, findByText } = renderComponent();
      expect(getByText('Dark')).toBeInTheDocument();
      fireEvent.click(getByText('Dark'));
      expect(await findByText('Light')).toBeInTheDocument();
    });

    it('should switch to Dark mode', async () => {
      const { getByText, findByText } = renderComponent();
      expect(getByText('Dark')).toBeInTheDocument();
      fireEvent.click(getByText('Dark'));
      expect(await findByText('Light')).toBeInTheDocument();
      fireEvent.click(getByText('Light'));
      expect(await findByText('Dark')).toBeInTheDocument();
    });
  });
});
