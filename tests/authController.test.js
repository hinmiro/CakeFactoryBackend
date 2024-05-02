// authController.test.js

import { getUserByUsername } from '../src/api/models/userModel.js';

describe('getUserByUsername', () => {
    it('should return a user if the username exists', async () => {
        const username = 'kola';
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
