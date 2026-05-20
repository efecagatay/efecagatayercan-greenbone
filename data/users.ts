// Credentials are loaded from .env (excluded from git) and from GitHub Secrets in CI,
// following the team's practice for sensitive test data management.
export const USERS = {
    STANDARD: {
        username: process.env.SAUCE_STANDARD_USERNAME ?? '',
        password: process.env.SAUCE_STANDARD_PASSWORD ?? '',
    },
    LOCKED_OUT: {
        username: process.env.SAUCE_LOCKED_OUT_USERNAME ?? '',
        password: process.env.SAUCE_LOCKED_OUT_PASSWORD ?? '',
    },
};
