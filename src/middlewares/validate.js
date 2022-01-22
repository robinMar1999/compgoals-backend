import User from "../models/user.js";

export const validateRegBody = async (req, res, next) => {
  const { body } = req;
  if (!body.name || body.name === "") {
    return res
      .status(406)
      .json({ msg: "Name is required & should not be empty!" });
  }
  if (!body.email || body.email === "") {
    return res
      .status(406)
      .json({ msg: "Email is required & should not be empty!" });
  }
  const email = await User.findOne({ email: body.email });
  if (email) {
    return res.status(409).json({ msg: "Email is already present!" });
  }
  const roleOptions = ["delivery", "restaurant", "admin", "customer"];

  if (!body.role || !roleOptions.find((role) => role === body.role)) {
    return res.status(406).json({
      msg: "Role is required & should be one of valid options!",
      options: roleOptions,
    });
  }

  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

  if (!body.password || !re.test(body.password)) {
    return res.status(406).json({
      msg: "Password should consist of minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character !",
    });
  }
  next();
};

export const validateLoginBody = async (req, res, next) => {
  const { body } = req;
  if (!body.email || body.email === "") {
    return res
      .status(400)
      .json({ msg: "Email is required & should not be empty!" });
  }
  const roleOptions = ["delivery", "restaurant", "admin", "customer"];

  if (!body.role || !roleOptions.find((role) => role === body.role)) {
    return res.status(400).json({
      msg: "Role is required & should be one of valid options!",
      options: roleOptions,
    });
  }

  if (!body.password || body.password === "") {
    return res.status(400).json({
      msg: "Password should not be empty!",
    });
  }
  next();
};

const validate = {
  validateLoginBody,
  validateRegBody,
};

export default validate;
