import bcrypt from "bcrypt";
import User from "../models/user.js";
import Farmer from "../models/RegistedUser.js";

// Create a new user
export const createUser = async (req, res) => {
  const { name, role, mobileNumber, password, farmerId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, role, mobileNumber, password: hashedPassword, farmerId });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User login
export const loginUser = async (req, res) => {
  const { mobileNumber, password } = req.body;

  try {
    const user = await User.findOne({ where: { mobileNumber } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: [Farmer] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, role, mobileNumber, password, farmerId } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    await user.update({ name, role, mobileNumber, password: hashedPassword, farmerId });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [Farmer],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};