import jwt from 'jsonwebtoken';
export const verifyToken = (req, res) => {

    const { app_key } = req.body;

    if (!app_key) {
        return res.status(400).json({ message: 'Token required' });
    }

    jwt.verify(app_key, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        return res.json({ message: "Thanks For Activate", data: "Token Valid forever" })
    });

    // if (app_key === process.env.APP_KEY) {
    //     return res.json({ message: "Thanks For Activate", data: "Key Valid forever" })
    // } else {
    //     return res.status(401).json({ message: 'Invalid Key' });
    // }
    // return res.json({ message: "Thanks For Activate", data: "Key Valid forever" })
};


export const generateToken = (req, res) => {
    const payload = {};

    const token = jwt.sign(payload, process.env.JWT_SECRET,
        {
            expiresIn: '1d', // Token expiration time set to 5 minutes
        }
    );

    return res.send(`<html><body><div id="token">${token}</div></body></html>`)
};



const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};