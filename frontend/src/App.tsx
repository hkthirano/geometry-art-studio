import { ReactNode, useEffect, useState } from 'react'
import { AuthenticationResult, EventType, IPublicClientApplication, PromptValue } from '@azure/msal-browser';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { CustomNavigationClient } from './utils/NavigationClient';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { PageLayout } from './ui-components/PageLayout';
import { Grid } from '@mui/material';
import { b2cPolicies, loginRequest } from './authConfig';
import { Profile } from './pages/Profile';
import { Logout } from './pages/Logout';
import { Home } from './pages/Home';

type AppProps = {
  pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {

  return (
    <ClientSideNavigation pca={pca}>
      <MsalProvider instance={pca}>
        <PageLayout>
          <Grid container justifyContent="center">
            <Pages />
          </Grid>
        </PageLayout>
      </MsalProvider>
    </ClientSideNavigation>
  )
}

/**
 *  This component is optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
 */
function ClientSideNavigation({ pca, children }: { pca: IPublicClientApplication; children: ReactNode }) {
  const navigate = useNavigate();
  const navigationClient = new CustomNavigationClient(navigate);
  pca.setNavigationClient(navigationClient);

  // react-router-dom v6 doesn't allow navigation on the first render - delay rendering of MsalProvider to get around this limitation
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    setFirstRender(false);
  }, []);

  if (firstRender) {
    return null;
  }

  return children;
}

function Pages() {
  const { instance } = useMsal();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      const payload = event.payload as AuthenticationResult & { idTokenClaims: { tfp?: string; oid?: string; sub?: string } };
      const account = payload.account;
      if ((event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) && account) {
        /**
         * For the purpose of setting an active account for UI update, we want to consider only the auth 
         * response resulting from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy 
         * policies may use "acr" instead of "tfp"). To learn more about B2C tokens, visit:
         * https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
         */
        if (payload.idTokenClaims['tfp'] === b2cPolicies.names.editProfile) {
          // retrieve the account from initial sign-in to the app
          const originalSignInAccount = instance.getAllAccounts()
            .find(account =>
              account.idTokenClaims?.oid === payload.idTokenClaims.oid
              &&
              account.idTokenClaims?.sub === payload.idTokenClaims.sub
              &&
              account.idTokenClaims?.['tfp'] === b2cPolicies.names.signUpSignIn
            );

          const signUpSignInFlowRequest = {
            scopes: [...loginRequest.scopes],
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            account: originalSignInAccount,
            prompt: PromptValue.NONE
          };

          // To get the updated account information
          instance.acquireTokenPopup(signUpSignInFlowRequest).then(() => {
            setStatus("update success")
          });
        }
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    }
    // eslint-disable-next-line  
  }, []);

  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/" element={<Home status={status} />} />
    </Routes>
  );
}

export default App
