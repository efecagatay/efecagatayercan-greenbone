import { URLS } from '../utils/urls';
import { USERS } from './users';

export interface LoginScenario {
    description: string;
    username: string;
    password: string;
    shouldLogin: boolean;
    expectedError?: string;
    expectedUrlPattern?: RegExp;
}

export const loginScenarios: LoginScenario[] = [
    {
        description: 'standard_user should login successfully',
        username: USERS.STANDARD.username,
        password: USERS.STANDARD.password,
        shouldLogin: true,
        expectedUrlPattern: URLS.INVENTORY,
    },
    {
        description: 'locked_out_user should see locked-out error',
        username: USERS.LOCKED_OUT.username,
        password: USERS.LOCKED_OUT.password,
        shouldLogin: false,
        expectedError: 'Sorry, this user has been locked out',
    },
    {
        description: 'invalid password should show credentials error',
        username: USERS.STANDARD.username,
        password: 'wrong_password',
        shouldLogin: false,
        expectedError: 'Username and password do not match',
    },
];