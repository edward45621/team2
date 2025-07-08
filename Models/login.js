let users =[
    {
        id :1,
        username: "Admin",
        email: "Admin@gamil.com",
        password: "password123"
    },
    {
        id: 2,
        username: "edward",
        email: "edward@gmail.com",
        password: "30112004"
    },
];

const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

module.exports = {
    users,
    findUserByEmail,
};