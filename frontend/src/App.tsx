import { ReactNode, useEffect, useState } from 'react'
import { IPublicClientApplication } from '@azure/msal-browser';
import { useNavigate } from 'react-router-dom';
import { CustomNavigationClient } from './utils/NavigationClient';
import { MsalProvider } from '@azure/msal-react';

type AppProps = {
  pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {

  return (
    <ClientSideNavigation pca={pca}>
      <MsalProvider instance={pca}>
        <div>hello</div>
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

export default App
