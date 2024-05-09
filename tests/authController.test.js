// authController.test.js
import { jest } from '@jest/globals';
import { describe, it, expect } from '@jest/globals';
import { postLogin, getMe } from '../src/api/controllers/authController.js';
import { getUserByUsername } from '../src/api/models/userModel.js';

describe('getUserByUsername', () => {
    it('should return a user if the username exists', async () => {
        const username = 'miro';
        const user = await getUserByUsername(username);

        await expect(user).toBeDefined();
        await expect(user.username).toBe(username);
    });

    it('should return null if the username does not exist', async () => {
        const username = 'nonExistingUser';
        const user = await getUserByUsername(username);

        await expect(user).toBeFalsy();
    });
});


// New tests for postLogin
describe('postLogin', () => {
    it('should return 401 if the username is invalid', async () => {
        const req = { body: { username: 'invalidUsername', password: 'password' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await postLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid username" });
    });

    it('should return 401 if the password is incorrect', async () => {
        const req = { body: { username: 'validUsername', password: 'invalidPassword' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await postLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid username" });
    });

    it('should return the user and token if the username and password are correct', async () => {
        const req = { body: { username: 'validUsername', password: 'validPassword' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await postLogin(req, res);

        expect(res.json).toHaveBeenCalled();
    });
});

// New tests for getMe
describe('getMe', () => {
    it('should return the user if authenticated', async () => {
        const req = {};
        const res = { locals: { user: { username: 'validUsername' } }, json: jest.fn() };

        await getMe(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: "Token is valid", user: res.locals.user });
    });

    it('should return 401 if not authenticated', async () => {
        const req = {};
        const res = { locals: {}, sendStatus: jest.fn() };

        await getMe(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });
});
