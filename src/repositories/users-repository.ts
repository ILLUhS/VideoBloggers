import {UserCreateModel} from "../models/user-create-model";
import {usersCollection} from "./db";

export const usersRepository = {
    async create(newUser: UserCreateModel) {
        return (await usersCollection.insertOne({...newUser})).acknowledged;
    },
    async findByField(field: string, value: string) {
        return await usersCollection.findOne({[field]: value});
    },
    async deleteById(id: string) {
        return (await usersCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async deleteAll() {
        return (await usersCollection.deleteMany({})).acknowledged;
    }
}