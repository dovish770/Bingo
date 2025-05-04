import { IUser } from "..";

interface UserState {
    user: IUser | null;
    status: string;
    error: string | null;
    token: string | null
}

export default UserState