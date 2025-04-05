import { AuthenticatedTemplate } from "@azure/msal-react";
import { ReactNode } from "react";
import { NavigationBar } from "./NavigationBar";

type PageLayoutProps = {
    children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <>
            <NavigationBar />
            <br />
            <h5>
                <center>Welcome to the Microsoft Authentication Library For React Tutorial</center>
            </h5>
            <br />
            {children}
            <br />
            <AuthenticatedTemplate>
                <footer>
                    <center>
                        How did we do?
                        <a
                            href="https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUMlRHSkc5U1NLUkxFNEtVN0dEOTFNQkdTWiQlQCN0PWcu"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {' '}
                            Share your experience!
                        </a>
                    </center>
                </footer>
            </AuthenticatedTemplate>
        </>
    );
}