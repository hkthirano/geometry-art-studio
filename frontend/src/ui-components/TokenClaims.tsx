import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

type TokenClaimsProps = {
    tokenClaims: { [key: string]: unknown } | undefined;
};

export const TokenClaims = ({ tokenClaims }: TokenClaimsProps) => {
    return (
        <List id="idTokenClaims">
            {tokenClaims && Object.entries(tokenClaims).map(claim => {
                return (
                    <ListItem key={`claim-${claim[0]}`}>
                        <ListItemText primary={claim[0]} secondary={claim[1] as string} />
                    </ListItem>
                );
            })}
        </List>
    );
};
