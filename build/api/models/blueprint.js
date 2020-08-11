"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var BlueprintModel = /** @class */ (function () {
    function BlueprintModel() {
    }
    BlueprintModel.init = function () {
        var blueprintSchema = new mongoose_1.default.Schema({
            owner: {
                type: mongoose_1.Schema.Types.ObjectId, ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            tags: { type: [String] },
            likes: { type: [String] },
            createdAt: Date,
            modifiedAt: Date,
            thumbnail: String,
            isCopy: Boolean,
            copyOf: {
                type: mongoose_1.Schema.Types.ObjectId, ref: 'Blueprint'
            },
            data: Object,
            deleted: Boolean
        });
        BlueprintModel.model = mongoose_1.default.model('Blueprint', blueprintSchema);
    };
    return BlueprintModel;
}());
exports.BlueprintModel = BlueprintModel;
