import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthenticationResult, EventType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig.ts';
import { BrowserRouter } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";

/**
* MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
* For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
*/
export const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  // Default to using the first account if no account is active on page load
  if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  msalInstance.addEventCallback((event) => {
    const payload = event.payload as AuthenticationResult;
    if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS) &&
      payload.account
    ) {
      msalInstance.setActiveAccount(payload.account);
    }
  });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App instance={msalInstance} />
      </BrowserRouter>
    </StrictMode>,
  )
});