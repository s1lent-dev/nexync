type IUser = {
    userId: string;
    username: string;
    email: string;
    avatarUrl: string;
    bio: string;
    isAdmin: boolean | null;
}

type IConnection = {
    userId: string;
    username: string;
    email: string;
    avatarUrl: string;
    bio: string;
    isFollower: boolean;
    isFollowing: boolean;
    isRequested: boolean;
}

type IConnectionRequests = {
    userId: string;
    username: string;
    avatarUrl: string;
    bio: string;
}

type IGroupChat = {
    chatId: string;
    name: string;
    avatarUrl: string;
    tagline: string;
    members: IUser[];
}


type IConnectionChat = {
    chatId: string;
    userId: string;
    username: string;
    email: string;
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

export type { INavigationItem, IRegsitrationForm, ILoginForm, IUser, IConnection, IGroupChat, IConnectionChat, IConnectionRequests, IMessage, IChats };