import { useEffect } from 'react'
import { AuthenticationResult, EventType, IdTokenClaims, IPublicClientApplication } from '@azure/msal-browser';
import { Route, Routes } from 'react-router-dom';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { PageLayout } from './components/PageLayout';
import { b2cPolicies, protectedResources } from './authConfig';
import { Home } from './pages/Home';
import { compareIssuingPolicy } from './utils/claimUtils';

import './styles/App.css';
import { TodoList } from './pages/TodoList';

const Pages = () => {
  /**
   * useMsal is hook that returns the PublicClientApplication instance,
   * an array of all accounts currently signed in and an inProgress value
   * that tells you what msal is currently doing. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */
  const { instance } = useMsal();
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      const payload = event.payload as AuthenticationResult;
      if (
        (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
        payload.account
      ) {
        /**
         * For the purpose of setting an active account for UI update, we want to consider only the auth
         * response resulting from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy
         * policies may use "acr" instead of "tfp"). To learn more about B2C tokens, visit:
         * https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
         */
        if (compareIssuingPolicy(payload.idTokenClaims as IdTokenClaims, b2cPolicies.names.editProfile)) {
          // retrieve the account from initial sing-in to the app
          const originalSignInAccount = instance
            .getAllAccounts()
            .find(
              (account) =>
                (account.idTokenClaims as IdTokenClaims).oid === (payload.idTokenClaims as IdTokenClaims).oid &&
                (account.idTokenClaims as IdTokenClaims).sub === (payload.idTokenClaims as IdTokenClaims).sub &&
                compareIssuingPolicy(account.idTokenClaims as Record<string, string>, b2cPolicies.names.signUpSignIn)
            );

          const signUpSignInFlowRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            account: originalSignInAccount,
          };

          // silently login again with the signUpSignIn policy
          instance.ssoSilent(signUpSignInFlowRequest);
        }

        /**
         * Below we are checking if the user is returning from the reset password flow.
         * If so, we will ask the user to reauthenticate with their new password.
         * If you do not want this behavior and prefer your users to stay signed in instead,
         * you can replace the code below with the same pattern used for handling the return from
         * profile edit flow
         */
        if (compareIssuingPolicy(payload.idTokenClaims as IdTokenClaims, b2cPolicies.names.forgotPassword)) {
          const signUpSignInFlowRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            scopes: [
              ...protectedResources.apiTodoList.scopes.read,
              ...protectedResources.apiTodoList.scopes.write,
            ],
          };
          instance.loginRedirect(signUpSignInFlowRequest);
        }
      }

      if (event.eventType === EventType.LOGIN_FAILURE) {
        // Check for forgot password error
        // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
        if (event.error && 'errorMessage' in event.error && event.error.errorMessage.includes('AADB2C90118')) {
          const resetPasswordRequest = {
            authority: b2cPolicies.authorities.forgotPassword.authority,
            scopes: [],
          };
          instance.loginRedirect(resetPasswordRequest);
        }
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  return (
    <Routes>
      <Route path="/todolist" element={<TodoList />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

type AppProps = {
  instance: IPublicClientApplication;
};

function App({ instance }: AppProps) {
  return (
    <MsalProvider instance={instance}>
      <PageLayout>
        <Pages />
      </PageLayout>
    </MsalProvider>
  )
}

export default App
