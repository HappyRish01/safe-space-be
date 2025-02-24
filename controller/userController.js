import { prisma } from "../libs/prisma.js";
import { setUser } from "../services/auth.js";
import { compare, hash } from "bcrypt";

export async function handleUserSignupController(req, res) {
  const { username, password  } = req.body;
  try {
    const exsistingUserByEmail = await prisma.user.findUnique({
      where: {
        username
      },
    });
    if (exsistingUserByEmail) {
      return res.status(400).json({
        user: null,
        message: "User exists with same email",
      });
    }
    const exsistingUserByUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (exsistingUserByUsername) {
      return res.status(400).json({
        user: null,
        message: "User exists with the same username",
      });
    }
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    const token = setUser(user);

    res.status(201).json({token, message: "User succesfully registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create user"
    });
  }
}

export async function handleUserLoginController(req, res) {
  const { username, password } = req.body;
  //validate user like password length and any other thing
  try {
    const user = await prisma.user.findUnique({
      where: {
        username
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordvalid = await compare(password, user.password);

    if (!isPasswordvalid) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = setUser(user);

    res.status(200).json({token})
    
  } catch (error) {
    res.status(500).json({message: "Something went wrong"})
  }
}

