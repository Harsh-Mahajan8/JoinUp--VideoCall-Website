import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Credential not forund!!" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found!" });
        }

        if (await bcrypt.compare(password, user.password)) {
            let token = crypto.randomBytes(20).toString('hex');
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token, message: "User is found!" })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials!" });
        }

    } catch (e) {
        return res.status(500).json({ message: `Something went wrong ${e}` })
    }
}


const register = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: "User already exist!!" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email, username, password: hashedPassword
        });

        await newUser.save();

        return res.status(httpStatus.CREATED).json({ message: "User registered!!" })
    } catch (e) {
        return res.status(500).json({ message: `Something went wrong ${e}` })
    }
}

export { register, login };