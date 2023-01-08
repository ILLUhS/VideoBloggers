import {UserCreateType} from "../types/create-model-types/user-create-type";
import {UserModel} from "./db";
import {UserViewType} from "../types/view-model-types/user-view-type";
import {FilterOneFieldType} from "../types/filter-one-field-type";

export const usersRepository = {
    async create(newUser: UserCreateType): Promise<boolean> {
        try {
            await UserModel.create(newUser);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    },
    async findByField(field: string, value: string): Promise<UserViewType | null> {
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
    },
    async findByFieldWithHash(field: string, value: string) {
        return await UserModel.findOne({[field]: value}).select({_id: 0, __v: 0}).exec();
    },
    async deleteById(id: string) {
        return (await UserModel.deleteOne({id: id}).exec()).deletedCount === 1;
    },
    async deleteAll() {
        return (await UserModel.deleteMany().exec()).acknowledged;
    },
    async updatePassRecovery(id: string, code: string, expiration: Date, isConfirmed: boolean): Promise<boolean> {
        return (await UserModel.updateOne({id: id},
            {
                'passwordRecovery.recoveryCode': code,
                'passwordRecovery.expirationTime': expiration,
                'passwordRecovery.isUsed': isConfirmed
            }).exec()).matchedCount === 1;
    },
    async updateOneField(filter: FilterOneFieldType, update: UpdateOneFieldType) {
        return (await UserModel.updateOne(filter,
            update).exec()).matchedCount === 1;
    }
}