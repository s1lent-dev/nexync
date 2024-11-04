interface INavigationItem {
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

export type { INavigationItem, IRegsitrationForm, ILoginForm };