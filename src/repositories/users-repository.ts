import {UserCreateModel} from "../models/user-create-model";
import {usersCollection} from "./db";
import {UserViewModel} from "../models/user-view-model";

export const usersRepository = {
    async create(newUser: UserCreateModel) {
        return (await usersCollection.insertOne({...newUser})).acknowledged;
    },
    async findByField(field: string, value: string): Promise<UserViewModel | null> {
        const user =  await usersCollection.findOne({[field]: value}, {projection: {
                _id: 0,
                id: 1,
                'accountData.login': 1,
                'accountData.email': 1,
                'accountData.createdAt': 1
            }});
        return user ? {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        } : null;
    },
    async findByFieldWithHash(field: string, value: string) {
        return await usersCollection.findOne({[field]: value}, {projection: {_id: 0}});
    },
    async deleteById(id: string) {
        return (await usersCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async deleteAll() {
        return (await usersCollection.deleteMany({})).acknowledged;
    },
    async updateConfirmation(id: string): Promise<boolean> {
        return (await usersCollection.updateOne({id: id},
            { $set: { 'emailConfirmation.isConfirmed': true }})).matchedCount === 1
    }
}