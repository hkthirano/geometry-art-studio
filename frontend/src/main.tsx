import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthenticationResult, EventType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig.ts';
import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/theme.ts';
import { BrowserRouter } from 'react-router-dom';

export const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  // Default to using the first account if no account is active on page load
  if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  // Optional - This will update account state if a user signs in from another tab or window
  msalInstance.enableAccountStorageEvents();

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS
      ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ||
      event.eventType === EventType.SSO_SILENT_SUCCESS
    ) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  )
});
