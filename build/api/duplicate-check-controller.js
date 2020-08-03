"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./models/user");
var DuplicateCheckController = /** @class */ (function () {
    function DuplicateCheckController() {
    }
    DuplicateCheckController.prototype.checkUsername = function (req, res) {
        // If we can't access mongoose, assume the username is not present
        if (user_1.UserModel.model == null)
            res.json({ usernameExists: false });
        else
            user_1.UserModel.model.find({ username: req.query.username }, function (err, users) {
                if (users.length)
                    res.json({ usernameExists: true });
                else
                    res.json({ usernameExists: false });
            });
    };
    return DuplicateCheckController;
}());
exports.DuplicateCheckController = DuplicateCheckController;
