import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Apiresponse } from "../utils/Apiresponse.js"


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - any field like username,email,password should not be empty
    // check if user already exists: username and email
    // check for image , check for avatar
    // upload them to cloudinary - check avatar upload 
    // create user object( mongodb take data as object) - create entry in db
    // db will send response with all things- remove password and refresh token from response
    // check for user creation
    // return response

    const { username, email, fullname, password } = req.body
    console.log(`email:${email}\n username:${username}\n fullname:${fullname}`);

    if (
        [fullname, email, username].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user with email or username already existed")
    }

    const avatarLoacalpath = req.files?.avatar[0]?.path
    const coverImageLocalpath = req.files?.coverImage[0]?.path

    if (!avatarLoacalpath) {
        throw new ApiError(400, "Avater file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLoacalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.")
    }

    return res.status(201).json(
        new Apiresponse(200, createdUser, "User registered Successfully")
    )

})



export { registerUser }