interface ImportMetaEnv {
    readonly B2C_1_SISO_POLICY_NAME: string
    readonly B2C_1_PROFILE_EDIT_POLICY_NAME: string
    readonly SIGN_UP_SIGN_IN_AUTHORITY: string
    readonly EDIT_PROFILE_AUTHORITY: string
    readonly AUTHORITY_DOMAIN: string
    readonly MSAL_CLIENT_ID: string
    readonly LOGIN_REQUEST_SCOPES: string
    readonly API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}