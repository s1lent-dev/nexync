type IUser = {
    userId: string;
    googleId: string | null;
    githubId: string | null;
    username: string;
    email: string;
    password: string | null;
    avatarUrl: string;
    bio: string;
}

type IConnection = {
    userId: string;
    username: string;
    email: string;
    avatarUrl: string;
    bio: string;
    isFollowing: boolean;
    isRequested: boolean;
}

type IConnectionRequests = {
    userId: string;
    username: string;
    avatarUrl: string;
    bio: string;
}

type IConnectionChat = {
    chatId: string;
    userId: string;
    googleId: string | null;
    githubId: string | null;
    username: string;
    email: string;
    password: string | null;
    avatarUrl: string;
    bio: string;
}

type IMessage = {
    senderId: string;
    chatId: string;
    memberIds: string[];
    content: string;
    createdAt: Date | null;
}

type IChats = {
    [chatId: string]: IMessage[]
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

export type { INavigationItem, IRegsitrationForm, ILoginForm, IUser, IConnection, IConnectionChat, IConnectionRequests, IMessage, IChats };