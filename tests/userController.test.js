import { jest } from '@jest/globals';
import { describe, it, expect } from '@jest/globals';


jest.spyOn(userController, 'getUserById').mockImplementation(jest.fn());
jest.spyOn(userController, 'modifyUser').mockImplementation(jest.fn());
jest.spyOn(userModel, 'deleteUser').mockImplementation(jest.fn());

import * as userController from '../src/api/controllers/userController.js';
import * as userModel from '../src/api/models/userModel.js';
// New tests for getUserById
describe('getUserById', () => {
    it('should return a user if the id exists', async () => {
        const id = 1;
        userController.getUserById.mockResolvedValue({ id, username: 'testUser' });
        const req = { params: { id } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await userController.getUserById(req, res);

        expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 if the id does not exist', async () => {
        const id = 9999;
        userController.getUserById.mockResolvedValue(null);
        const req = { params: { id } };
        const res = { sendStatus: jest.fn() };

        await userController.getUserById(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(400);
    });
});

// New tests for modifyUser
describe('modifyUser', () => {
    it('should return 200 and a success message if the user is updated', async () => {
        const id = 1;
        userController.modifyUser.mockResolvedValue(true);
        const req = { params: { id }, body: { username: 'newUsername' }, locals: { user: { role: 'admin' } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await userController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User updated successfully" });
    });

    it('should return 401 if the user is not authorized to update', async () => {
        const id = 1;
        userController.modifyUser.mockResolvedValue(false);
        const req = { params: { id }, body: { username: 'newUsername' }, locals: { user: { role: 'user' } } };
        const res = { sendStatus: jest.fn() };

        await userController.modifyUser(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });
});

// New tests for deleteUser
describe('deleteUser', () => {
    it('should return 200 and a success message if the user is deleted', async () => {
        const id = 1;
        userModel.deleteUser.mockResolvedValue(true);
        const req = { params: { id }, locals: { user: { role: 'admin' } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await userModel.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
    });

    it('should return 401 if the user is not authorized to delete', async () => {
        const id = 1;
        const req = { params: { id }, locals: { user: { role: 'user' } } };
        const res = { sendStatus: jest.fn() };

        await userModel.deleteUser(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should return 400 if the user with the provided id does not exist', async () => {
        const id = 9999;
        userModel.deleteUser.mockResolvedValue(false);
        const req = { params: { id }, locals: { user: { role: 'admin' } } };
        const res = { sendStatus: jest.fn() };

        await userModel.deleteUser(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(400);
    });
});
