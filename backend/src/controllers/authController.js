const User = require('../models/User');
const Mechanic = require('../models/Mechanic');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, passwordConfirm } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    if (password !== passwordConfirm) {
      return errorResponse(res, 400, 'Passwords do not match');
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return errorResponse(res, 409, 'User with this email or phone already exists');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'user',
    });

    const token = generateToken(user._id, user.role);

    successResponse(res, 201, 'User registered successfully', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    errorResponse(res, 500, 'Registration failed: ' + error.message);
  }
};

// Register Mechanic
exports.registerMechanic = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      passwordConfirm,
      licenseNumber,
      licenseExpiry,
      skills,
      yearsOfExperience,
      shopName,
      shopAddress,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !licenseNumber ||
      !licenseExpiry ||
      !skills
    ) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    if (password !== passwordConfirm) {
      return errorResponse(res, 400, 'Passwords do not match');
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return errorResponse(res, 409, 'User with this email or phone already exists');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'mechanic',
    });

    // Create mechanic profile
    await Mechanic.create({
      userId: user._id,
      licenseNumber,
      licenseExpiry,
      skills: Array.isArray(skills) ? skills : [skills],
      yearsOfExperience,
      shopName,
      shopAddress,
      isVerified: false,
    });

    const token = generateToken(user._id, user.role);

    successResponse(res, 201, 'Mechanic registered successfully. Awaiting admin verification.', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    errorResponse(res, 500, 'Registration failed: ' + error.message);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    // Find user and select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const token = generateToken(user._id, user.role);

    successResponse(res, 200, 'Login successful', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error) {
    errorResponse(res, 500, 'Login failed: ' + error.message);
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    let userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
      address: user.address,
      isEmailVerified: user.isEmailVerified,
    };

    // Add mechanic info if user is mechanic
    if (user.role === 'mechanic') {
      const mechanic = await Mechanic.findOne({ userId: user._id });
      userData.mechanic = {
        licenseNumber: mechanic.licenseNumber,
        skills: mechanic.skills,
        yearsOfExperience: mechanic.yearsOfExperience,
        shopName: mechanic.shopName,
        isVerified: mechanic.isVerified,
        totalRating: mechanic.totalRating,
        totalReviews: mechanic.totalReviews,
        totalEarnings: mechanic.totalEarnings,
      };
    }

    successResponse(res, 200, 'User fetched successfully', userData);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch user: ' + error.message);
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        phone,
        address,
        profilePicture,
        updatedAt: new Date(),
      },
      { new: true }
    );

    successResponse(res, 200, 'Profile updated successfully', {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update profile: ' + error.message);
  }
};
