import { IdTokenClaims } from "@azure/msal-browser";

/**
 * Populate claims table with appropriate description
 * @param {Object} claims ID token claims
 * @returns claimsObject
 */
export const createClaimsTable = (claims: IdTokenClaims) => {
    const claimsObj = {};
    let index = 0;

    Object.keys(claims).forEach((key) => {
        // if (typeof claims[key] !== 'string' && typeof claims[key] !== 'number') return;
        switch (key) {
            case 'aud':
                populateClaim(
                    key,
                    claims.aud!,
                    "Identifies the intended recipient of the token. In ID tokens, the audience is your app's Application ID, assigned to your app in the Azure portal.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'iss':
                populateClaim(
                    key,
                    claims.iss!,
                    'Identifies the issuer, or authorization server that constructs and returns the token. It also identifies the Azure AD tenant for which the user was authenticated. If the token was issued by the v2.0 endpoint, the URI will end in /v2.0. The GUID that indicates that the user is a consumer user from a Microsoft account is 9188040d-6c67-4c5b-b112-36a304b66dad.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'iat':
                populateClaim(
                    key,
                    changeDateFormat(claims[key] as number),
                    'Issued At indicates when the authentication for this token occurred.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'nbf':
                populateClaim(
                    key,
                    changeDateFormat(claims[key] as number),
                    'The nbf (not before) claim identifies the time (as UNIX timestamp) before which the JWT must not be accepted for processing.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'exp':
                populateClaim(
                    key,
                    changeDateFormat(claims[key] as number),
                    "The exp (expiration time) claim identifies the expiration time (as UNIX timestamp) on or after which the JWT must not be accepted for processing. It's important to note that in certain circumstances, a resource may reject the token before this time. For example, if a change in authentication is required or a token revocation has been detected.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'name':
                populateClaim(
                    key,
                    claims.name!,
                    "The principal about which the token asserts information, such as the user of an application. This value is immutable and can't be reassigned or reused. It can be used to perform authorization checks safely, such as when the token is used to access a resource. By default, the subject claim is populated with the object ID of the user in the directory",
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'preferred_username':
                populateClaim(
                    key,
                    claims.preferred_username!,
                    'The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time. Since it is mutable, this value must not be used to make authorization decisions. It can be used for username hints, however, and in human-readable UI as a username. The profile scope is required in order to receive this claim.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'nonce':
                populateClaim(
                    key,
                    claims.nonce!,
                    'The nonce matches the parameter included in the original /authorize request to the IDP. If it does not match, your application should reject the token.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'oid':
                populateClaim(
                    key,
                    claims.oid!,
                    'The oid (user’s object id) is the only claim that should be used to uniquely identify a user in an Azure AD tenant. The token might have one or more of the following claim, that might seem like a unique identifier, but is not and should not be used as such.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'tid':
                populateClaim(
                    key,
                    claims.tid!,
                    'The tenant ID. You will use this claim to ensure that only users from the current Azure AD tenant can access this app.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'upn':
                populateClaim(
                    key,
                    claims.upn!,
                    '(user principal name) – might be unique amongst the active set of users in a tenant but tend to get reassigned to new employees as employees leave the organization and others take their place or might change to reflect a personal change like marriage.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'email':
                populateClaim(
                    key,
                    (claims as { email: string }).email,
                    'Email might be unique amongst the active set of users in a tenant but tend to get reassigned to new employees as employees leave the organization and others take their place.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'acct':
                populateClaim(
                    key,
                    (claims as { acct: string }).acct,
                    'Available as an optional claim, it lets you know what the type of user (homed, guest) is. For example, for an individual’s access to their data you might not care for this claim, but you would use this along with tenant id (tid) to control access to say a company-wide dashboard to just employees (homed users) and not contractors (guest users).',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'sid':
                populateClaim(
                    key,
                    claims.sid!,
                    'Session ID, used for per-session user sign-out.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'sub':
                populateClaim(
                    key,
                    claims.sub!,
                    'The sub claim is a pairwise identifier - it is unique to a particular application ID. If a single user signs into two different apps using two different client IDs, those apps will receive two different values for the subject claim.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'ver':
                populateClaim(
                    key,
                    claims.ver!,
                    'Version of the token issued by the Microsoft identity platform',
                    index,
                    claimsObj
                );
                index++;
                break;
            case "auth_time":
                populateClaim(
                    key,
                    claims.auth_time!,
                    'The time at which a user last entered credentials, represented in epoch time. There is no discrimination between that authentication being a fresh sign-in, a single sign-on (SSO) session, or another sign-in type.',
                    index,
                    claimsObj
                );
                index++;
                break;
            case "at_hash":
                populateClaim(
                    key,
                    (claims as { at_hash: string }).at_hash,
                    'An access token hash included in an ID token only when the token is issued together with an OAuth 2.0 access token. An access token hash can be used to validate the authenticity of an access token',
                    index,
                    claimsObj
                );
                index++;
                break;
            case 'uti':
            case 'rh':
                index++;
                break;
            default:
                populateClaim(
                    key,
                    (claims as Record<string, unknown>)[key] as string | number,
                    '',
                    index,
                    claimsObj);
                index++;
        }
    });

    return claimsObj;
};

/**
 * Populates claim, description, and value into an claimsObject
 * @param {String} claim
 * @param {String} value
 * @param {String} description
 * @param {Number} index
 * @param {Object} claimsObject
 */
const populateClaim = (claim: string, value: string | number, description: string, index: number, claimsObject: Record<number, Array<string | number>>) => {
    const claimsArray = [];
    claimsArray[0] = claim;
    claimsArray[1] = value;
    claimsArray[2] = description;
    claimsObject[index] = claimsArray;
};

/**
 * Transforms Unix timestamp to date and returns a string value of that date
 * @param {String} date Unix timestamp
 * @returns
 */
const changeDateFormat = (date: number) => {
    const dateObj = new Date(date * 1000);
    return `${date} - [${dateObj.toString()}]`;
};

/**
 * Compare the token issuing policy with a specific policy name
 * @param {object} idTokenClaims - Object containing the claims from the parsed token
 * @param {string} policyToCompare - ID/Name of the policy as expressed in the Azure portal
 * @returns {boolean}
 */
export function compareIssuingPolicy(idTokenClaims: IdTokenClaims, policyToCompare: string) {
    const tfpMatches = idTokenClaims.tfp?.toLowerCase() === policyToCompare.toLowerCase();
    const acrMatches = idTokenClaims.acr?.toLowerCase() === policyToCompare.toLowerCase();
    return tfpMatches || acrMatches;
}
