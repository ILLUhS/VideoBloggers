import {UserCreateModel} from "../types/models/user-create-model";
import {UserModel} from "./db";
import {UserViewModel} from "../types/models/user-view-model";
import {FilterOneFieldType} from "../types/filter-one-field-type";

export const usersRepository = {
    async create(newUser: UserCreateModel): Promise<boolean> {
        try {
            await UserModel.create(newUser);
            return true;
        }
        catch (e) {
            console.log(e);
            return false
        }
        //return (await usersCollection.insertOne({...newUser})).acknowledged;
    },
    async findByField(field: string, value: string): Promise<UserViewModel | null> {
        const user = await UserModel.findOne({[field]: value}).select({
            _id: 0,
            id: 1,
            'accountData.login': 1,
            'accountData.email': 1,
            'accountData.createdAt': 1
        }).exec();
        return user ? {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        } : null;
        /*const user = await usersCollection.findOne({[field]: value}, {
            projection: {
                _id: 0,
                id: 1,
                'accountData.login': 1,
                'accountData.email': 1,
                'accountData.createdAt': 1
            }
        });
        return user ? {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        } : null;*/
    },
    async findByFieldWithHash(field: string, value: string) {
        return await UserModel.findOne({[field]: value}).select({_id: 0, __v: 0}).exec();
        //return await usersCollection.findOne({[field]: value}, {projection: {_id: 0}});
    },
    async deleteById(id: string) {
        return (await UserModel.deleteOne({id: id}).exec()).deletedCount === 1;
        //return (await usersCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async deleteAll() {
        return (await UserModel.deleteMany().exec()).acknowledged;
        //return (await usersCollection.deleteMany({})).acknowledged;
    },
    async updateConfirmation(id: string): Promise<boolean> {
        return (await UserModel.updateOne({id: id},
            {'emailConfirmation.isConfirmed': true}).exec()).matchedCount === 1;
        /*return (await usersCollection.updateOne({id: id},
            {$set: {'emailConfirmation.isConfirmed': true}})).matchedCount === 1;*/
    },
    async updateExpirationTime(id: string, expirationTime: Date): Promise<boolean> {
        return (await UserModel.updateOne({id: id},
            {'emailConfirmation.expirationTime': expirationTime}).exec()).matchedCount === 1;
        /*return (await usersCollection.updateOne({id: id},
            {$set: {'emailConfirmation.expirationTime': expirationTime}})).matchedCount === 1;*/
    },
    async updateConfirmationCode(id: string, code: string): Promise<boolean> {
        return (await UserModel.updateOne({id: id},
            {'emailConfirmation.confirmationCode': code}).exec()).matchedCount === 1;
        /*return (await usersCollection.updateOne({id: id},
            {$set: {'emailConfirmation.confirmationCode': code}})).matchedCount === 1;*/
    },
    async updatePassRecovery(id: string, code: string, expiration: Date, isConfirmed: boolean): Promise<boolean> {
        return (await UserModel.updateOne({id: id},
            {
                'passwordRecovery.recoveryCode': code,
                'passwordRecovery.expirationTime': expiration,
                'passwordRecovery.isUsed': isConfirmed
            }).exec()).matchedCount === 1;
        /*return (await usersCollection.updateOne({id: id},
            {
                $set: {
                    'passwordRecovery.recoveryCode': code,
                    'passwordRecovery.expirationTime': expiration,
                    'passwordRecovery.isUsed': isConfirmed
                }
            })).matchedCount === 1;*/
    },
    async updatePassRecoveryStatus(id: string): Promise<boolean> {
        return (await UserModel.updateOne({id: id},
            {'passwordRecovery.isUsed': true}).exec()).matchedCount === 1;
        /*return (await usersCollection.updateOne({id: id},
            {$set: {'passwordRecovery.isUsed': true}})).matchedCount === 1;*/
    },
    async updatePassword(id: string, newPasswordHash: string): Promise<boolean> {
        return (await UserModel.updateOne({id: id},
            {'accountData.passwordHash': newPasswordHash}).exec()).matchedCount === 1;
        /*return (await usersCollection.updateOne({id: id},
            {$set: {'accountData.passwordHash': newPasswordHash}})).matchedCount === 1;*/
    },
    async updateOneField(filter: FilterOneFieldType, update: UpdateOneFieldType) {
        return (await UserModel.updateOne(filter,
            update).exec()).matchedCount === 1;
    }
}