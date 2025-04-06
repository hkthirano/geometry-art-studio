import { useEffect, useState } from 'react';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { AccountInfo, InteractionRequiredAuthError, InteractionStatus, InteractionType } from '@azure/msal-browser';

// import { ListView } from '../components/ListView';
import { loginRequest } from "../authConfig";
import { callMsGraph } from '../utils/MsGraphApiCall';

const TodoListContent = () => {
    const { instance, inProgress } = useMsal();
    const [todoListData, setTodoListData] = useState(null);

    useEffect(() => {
        if (!todoListData && inProgress === InteractionStatus.None) {
            callMsGraph().then(response => setTodoListData(response)).catch((e) => {
                if (e instanceof InteractionRequiredAuthError) {
                    instance.acquireTokenRedirect({
                        ...loginRequest,
                        account: instance.getActiveAccount() as AccountInfo
                    });
                }
            });
        }
    }, [inProgress, todoListData, instance]);

    return <pre>{JSON.stringify(todoListData, null, 2)}</pre>
}

/**
 * The `MsalAuthenticationTemplate` component will render its children if a user is authenticated
 * or attempt to sign a user in. Just provide it with the interaction type you would like to use
 * (redirect or popup) and optionally a request object to be passed to the login API, a component to display while
 * authentication is in progress or a component to display if an error occurs. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const TodoList = () => {
    const authRequest = {
        ...loginRequest,
    };

    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
        >
            <TodoListContent />
        </MsalAuthenticationTemplate>
    );
};
