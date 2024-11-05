type IUser = {
    userId: string;
    username: string;
    email: string;
    avatarUrl: string;
    bio: string;
    isFollowing: boolean;
    isRequested: boolean;
}

type INavigationItem =  {
    title: string;
}

type IRegsitrationForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type ILoginForm = {
    usernameOrEmail: string;
    password: string;
}

export type { INavigationItem, IRegsitrationForm, ILoginForm, IUser };