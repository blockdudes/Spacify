import { Document, Types } from "mongoose";

export interface UserRegisterBody {
    name: string;
    username: string;
    description: string;
    image: string;
    address: string;
}

export interface PostCreateBody {
    post_id: string;
    title: string;
    description: string;
    post: string;
    createdBy: Types.ObjectId;
    space: string;
    privateSpaceId: Types.ObjectId | null;
    channel: "general" | "governance" | "announcement" | null;
}

export interface LikePostBody {
    _id: string;
    likedBy: Types.ObjectId;
    space: string;
    privateSpaceId: Types.ObjectId | null;
    channel: "general" | "governance" | "announcement" | null;
}

export interface RePostBody {
    _id: string;
    repostBy: Types.ObjectId;
    repostDescription: string;
    space: string;
    privateSpaceId: Types.ObjectId | null;
    channel: "general" | "governance" | "announcement" | null;
}

export interface FollowUserBody {
    userId: Types.ObjectId;
    followUserId: Types.ObjectId;
}

export interface CommentPostBody {
    _id: string;
    commentBy: Types.ObjectId;
    comment: string,
    space: string;
    privateSpaceId: Types.ObjectId | null;
    channel: "general" | "governance" | "announcement" | null;
}

export interface Comment extends Document {
    user: Types.ObjectId;
    comment: string;
    timestamp: number;
}

export interface Private extends Document {
    privateSpaceId: Types.ObjectId;
    channel: "general" | "governance" | "announcement";
}

export interface Post extends Document {
    post_id: string;
    post: string;
    title: string;
    description: string;
    createdBy: Types.ObjectId;
    repostBy: Types.ObjectId;
    repostDescription: string;
    timestamp: number;
    likes: Types.ObjectId[];
    comments: Comment[];
    type: "created" | "repost";
    space: "public" | "private";
    private: Private;
    repost: number;
}