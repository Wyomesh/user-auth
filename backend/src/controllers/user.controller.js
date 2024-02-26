import { asyncHandler } from "../utils/asyncHandler.js";
import isEmail from "validator/lib/isEmail.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshAccess = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Internal sever error");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;

  if (
    [fullName, email, phoneNumber, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!isEmail(email.trim())) {
    throw new ApiError(401, "Please enter valid email");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });

  if (existedUser) {
    throw new ApiError(409, "User with email or phone number already exists");
  }
  let avatarLocalPath;
  let coverImageLocalPath;
  let avatar;
  let coverImage;
  if (req.files.avatar) {
    avatarLocalPath = req.files?.avatar[0]?.path;
    avatar = await uploadOnCloudinary(avatarLocalPath);
  }
  if (req.files.coverImage) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }
  const user = await User.create({
    fullName,
    email,
    phoneNumber,
    password,
    avatar: avatar || "",
    coverImage: coverImage || "",
  });

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Internal server error, Registration failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  if (!email && !phoneNumber) {
    throw new ApiError(400, "Email or Phone number is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshAccess(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(loggedInUser);
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookie?.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised request");
  }
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const [accessToken, newRefreshToken] = await generateAccessAndRefreshAccess(
    user._id
  );

  res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", newRefreshToken)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed"
      )
    );
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const getUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateDetails = asyncHandler(async (req, res) => {
  const { fullName, phoneNumber, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
      },
    },
    { new: true }
  );
  if (!user) {
    throw new ApiError(400, "Unauthorised request");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  if (req.files) {
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const newAvatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
        avatar: newAvatar,
      },
    }).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(400, "unauthorised request");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { user }, "User updated successfully"));
  }
  throw new ApiError(401, "All fields are required");
});

const updateCoverImage = asyncHandler(async (req, res) => {
  if (req.files) {
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    const user = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
        coverImage: coverImage,
      },
    });
    if (!user) {
      throw new ApiError(400, "unauthorised request");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { user }, "User updated successfully"));
  }
  throw new ApiError(401, "All fields are required");
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user?._id);
  if (!user) {
    throw new ApiError(400, "Unauthorized request");
  }
  return res
    .status(200)
    .json(200, new ApiResponse(200, {}, "User deleted successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  getUser,
  updateDetails,
  updateAvatar,
  updateCoverImage,
  deleteUser,
};
