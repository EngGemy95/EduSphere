import User from '../models/User.js';

const userRepository = {
  async createUser(userData) {
    return await User.create(userData);
  },

  async getAllUsers() {
    return await User.find().lean();
  },

  /**
   * Generic users pagination with optional text search on name/email/phone.
   */
  async getUsersPagination({ page = 1, limit = 20, search = "" }) {
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    return {
      users,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit,
    };
  },

  async getUserById(userId) {
    return await User.findById(userId);
  },

  async insertMultiple(users) {
    return await User.insertMany(users);
  },

  async getUserByEmail(email) {
    return await User.findOne({ email });
  },

  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
  },

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  },

  async updateDeviceId(userId, deviceId) {
    return await User.findByIdAndUpdate(userId, { deviceId }, { new: true });
  },

  generateRandomEmail() {
    const randomString = Math.random().toString(36).substring(2, 15);
    return `user_${randomString}@eduSphere.com`;
  },
};

export default userRepository;
