import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBlog extends Document {
   name: string;
   img: string;
   slug: string;
   like: number;
   likedBy: Types.ObjectId[];
   description?: string;
   content: string;

   comments: {
      _id: any;
      user: Types.ObjectId;
      userName: string;
      userAvatar?: string;
      content: string;
      likes: number;
      likedBy: string[];
      isDeleted?: boolean;
      replies: {
         _id: any;
         user: Types.ObjectId;
         userName: string;
         userAvatar?: string;
         content: string;
         likes: number;
         likedBy: string[];
         isDeleted?: boolean;

         // Reply cấp 2 (tối đa)
         replies: {
            _id: any;
            user: Types.ObjectId;
            userName: string;
            userAvatar?: string;
            content: string;
            likes: number;
            likedBy: string[];
            isDeleted?: boolean;
            createdAt: Date;
         }[];

         createdAt: Date;
      }[];

      createdAt: Date;
   }[];

   createdAt?: Date;
   updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
   {
      name: { type: String, required: true },
      img: { type: String, required: true },
      slug: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
      },
      like: { type: Number, default: 0 },
      likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],

      description: String,
      content: { type: String, required: true },
      comments: [
         {
            user: { type: Schema.Types.ObjectId, ref: "User", required: true },
            userName: { type: String, required: true },
            userAvatar: String,
            content: {
               type: String,
               required: true,
               trim: true,
               maxlength: 2000,
            },

            likes: { type: Number, default: 0 },
            likedBy: [{ type: String }],

            isDeleted: { type: Boolean, default: false },
            replies: [
               {
                  user: {
                     type: Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
                  },
                  userName: { type: String, required: true },
                  userAvatar: String,
                  content: { type: String, required: true, maxlength: 2000 },

                  likes: { type: Number, default: 0 },
                  likedBy: [{ type: String }],

                  isDeleted: { type: Boolean, default: false },

                  // Reply cấp 2
                  replies: [
                     {
                        user: {
                           type: Schema.Types.ObjectId,
                           ref: "User",
                           required: true,
                        },
                        userName: { type: String, required: true },
                        userAvatar: String,
                        content: {
                           type: String,
                           required: true,
                           maxlength: 2000,
                        },
                        likes: { type: Number, default: 0 },
                        likedBy: [{ type: String }],
                        isDeleted: { type: Boolean, default: false },
                        createdAt: { type: Date, default: Date.now },
                     },
                  ],

                  createdAt: { type: Date, default: Date.now },
               },
            ],

            createdAt: { type: Date, default: Date.now },
         },
      ],
   },
   { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", blogSchema);
