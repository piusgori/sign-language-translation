import User from "../models/user";

export const checkEmail = async (email: string, id?: string) => {
    try {
        let foundUserWithEmail;
        foundUserWithEmail = id ? await User.findOne({ $and: [{ _id: { $ne: id } }, { email }] }) : await User.findOne({ email });
        return (!!foundUserWithEmail);
    } catch (err) {
        console.log(err);
    }
}