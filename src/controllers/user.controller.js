import { asyncHandler } from '../utils/asynHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser  = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    if(![fullName, email, username, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existUser = User.findOne({
        $or: [{ email }, { username }]
    });

    if(existUser) throw new ApiError(409, "User with this username or email already exist");

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImgLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath) throw new ApiError(400, "Avatar file is required.");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImg = await uploadOnCloudinary(coverImgLocalPath);

    if(avatar) throw new ApiError(400, "Faild to upload Avatar.");

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowercase()
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser) throw new ApiError(500, "Something went wrong while registreing User.");

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully.")
    );
});

export { registerUser }