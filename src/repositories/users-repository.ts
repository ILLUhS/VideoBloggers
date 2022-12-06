import {UserCreateModel} from "../models/user-create-model";
import {usersCollection} from "./db";
import {UserViewModel} from "../models/user-view-model";

export const usersRepository = {
    async create(newUser: UserCreateModel) {
        return (await usersCollection.insertOne({...newUser})).acknowledged;
    },
    async findByField(field: string, value: string): Promise<UserViewModel | null> {
        return await usersCollection.findOne({[field]: value}, {projection: {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                createdAt: 1
            }});
    },
    async findByFieldWithHash(field: string, value: string) {
        return await usersCollection.findOne({[field]: value}, {projection: {_id: 0}});
    },
    async deleteById(id: string) {
        return (await usersCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async deleteAll() {
        return (await usersCollection.deleteMany({})).acknowledged;
    }
}