interface User {
    publicKey: string;
}

interface Post {
    id: number;
    title: string;
    body: string;
    author: User;
}

interface Comment {
    id: number;
    text: string;
    author: User;
    post: Post;
}
