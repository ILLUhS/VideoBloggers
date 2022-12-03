import {UserCreateModel} from "../models/user-create-model";
import {usersCollection} from "./db";

export const usersRepository = {
    async createUser(newUser: UserCreateModel) {
        return (await usersCollection.insertOne({...newUser})).acknowledged;
    },
    async deleteUserById(id: string) {
        return (await usersCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async deleteAllUsers() {
        return (await usersCollection.deleteMany({})).acknowledged;
    }
}