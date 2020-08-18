"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blueprint_1 = require("./models/blueprint");
var index_1 = require("../../../blueprintnotincluded-lib/index");
var user_1 = require("./models/user");
var batch_utils_1 = require("./batch/batch-utils");
var BlueprintController = /** @class */ (function () {
    function BlueprintController() {
    }
    BlueprintController.prototype.uploadBlueprint = function (req, res) {
        console.log('uploadBlueprint' + req.clientIp);
        if (blueprint_1.BlueprintModel.model == null)
            res.status(503).send();
        else {
            // TODO input checks here
            var user = req.user;
            var ownerId_1 = user._id;
            var name_1 = req.body.name;
            var data_1 = req.body.blueprint;
            var thumbnail_1 = req.body.thumbnail;
            var overwrite_1 = req.body.overwrite;
            var regexp = /^[a-zA-Z0-9-_ ]+$/;
            if (name_1.search(regexp) == -1 || name_1.length > 60) {
                console.log('Blueprint name too long or with weird characters');
                res.status(500).json({ saveBlueprintResult: 'ERROR' });
                return;
            }
            blueprint_1.BlueprintModel.model.find({ owner: ownerId_1, name: name_1 })
                .then(function (blueprints) {
                if (blueprints.length > 0) {
                    if (overwrite_1 || blueprints[0].deleted)
                        BlueprintController.saveBlueprint(req, res, blueprints[0], ownerId_1, name_1, data_1, thumbnail_1, false);
                    else
                        res.json({ overwrite: true });
                }
                else {
                    var blueprint = new blueprint_1.BlueprintModel.model();
                    blueprint.likes = [ownerId_1];
                    BlueprintController.saveBlueprint(req, res, blueprint, ownerId_1, name_1, data_1, thumbnail_1, true);
                }
            })
                .catch(function (err) {
                console.log('Blueprint find error');
                console.log(err);
                res.status(500).json({ saveBlueprintResult: 'ERROR' });
            });
        }
    };
    BlueprintController.prototype.deleteBlueprint = function (req, res) {
        console.log('deleteBlueprint' + req.clientIp);
        if (blueprint_1.BlueprintModel.model == null)
            res.status(503).send();
        else {
            try {
                var user = req.user;
                var blueprintDelete = req.body;
                var ownerId = user._id;
                if (blueprintDelete.blueprintId == null || user == null) {
                    res.status(500).json({ likeBlueprint: 'ERROR' });
                    return;
                }
                blueprint_1.BlueprintModel.model.find({ _id: blueprintDelete.blueprintId, owner: ownerId })
                    .then(function (blueprints) {
                    if (blueprints.length > 0) {
                        var blueprint = blueprints[0];
                        blueprint.deleted = true;
                        blueprint.save()
                            .then(function () {
                            res.json({ deleteBlueprint: 'OK' });
                        })
                            .catch(function (error) {
                            console.log('deleteBlueprint error');
                            console.log(error);
                            res.status(500).json({ deleteBlueprint: 'ERROR' });
                        });
                    }
                    else
                        res.status(500).json({ deleteBlueprint: 'ERROR' });
                })
                    .catch(function (err) {
                    console.log('deleteBlueprint error');
                    console.log(err);
                    res.status(500).json({ deleteBlueprint: 'ERROR' });
                });
            }
            catch (_a) {
                res.status(500).json({ deleteBlueprint: 'ERROR' });
            }
        }
    };
    BlueprintController.prototype.likeBlueprint = function (req, res) {
        console.log('likeBlueprint' + req.clientIp);
        if (blueprint_1.BlueprintModel.model == null)
            res.status(503).send();
        else {
            try {
                var user_2 = req.user;
                var blueprintLike_1 = req.body;
                if (blueprintLike_1.blueprintId == null || blueprintLike_1.like == null || user_2 == null) {
                    res.status(500).json({ likeBlueprint: 'ERROR' });
                    return;
                }
                blueprint_1.BlueprintModel.model.find({ _id: blueprintLike_1.blueprintId })
                    .then(function (blueprints) {
                    if (blueprints.length > 0) {
                        var blueprint = blueprints[0];
                        if (blueprint.likes == null)
                            blueprint.likes = [];
                        if (blueprintLike_1.like) {
                            if (blueprint.likes.indexOf(user_2._id) == -1)
                                blueprint.likes.push(user_2._id);
                        }
                        else {
                            var indexLike = blueprint.likes.indexOf(user_2._id);
                            if (indexLike != -1)
                                blueprint.likes.splice(indexLike, 1);
                        }
                        blueprint.save()
                            .then(function () {
                            res.json({ likeBlueprint: 'OK' });
                        })
                            .catch(function (error) {
                            console.log('likeBlueprint error');
                            console.log(error);
                            res.status(500).json({ likeBlueprint: 'ERROR' });
                        });
                    }
                    else
                        res.status(500).json({ likeBlueprint: 'ERROR' });
                })
                    .catch(function (err) {
                    console.log('likeBlueprint error');
                    console.log(err);
                    res.status(500).json({ likeBlueprint: 'ERROR' });
                });
            }
            catch (_a) {
                res.status(500).json({ likeBlueprint: 'ERROR' });
            }
        }
    };
    BlueprintController.prototype.getBlueprint = function (req, res) {
        console.log('getBlueprint' + req.clientIp);
        if (blueprint_1.BlueprintModel.model == null)
            res.status(503).send();
        else {
            // TODO checks here
            var id = req.params.id;
            var userId_1 = req.query.userId;
            blueprint_1.BlueprintModel.model.find({ _id: id })
                .then(function (blueprints) {
                if (blueprints.length > 0) {
                    var blueprint = blueprints[0];
                    var likedByMe = false;
                    if (userId_1 != null && blueprint.likes != null && blueprint.likes.indexOf(userId_1) != -1)
                        likedByMe = true;
                    var nbLikes = 0;
                    if (blueprint.likes != null)
                        nbLikes = blueprint.likes.length;
                    var response = {
                        id: blueprint._id,
                        name: blueprint.name,
                        data: blueprint.data,
                        likedByMe: likedByMe,
                        nbLikes: nbLikes
                    };
                    res.json(response);
                }
                else
                    res.status(500).json({ getBlueprint: 'ERROR' });
            })
                .catch(function (err) {
                console.log('Blueprint find error');
                console.log(err);
                res.status(500).json({ getBlueprint: 'ERROR' });
            });
        }
    };
    BlueprintController.prototype.getBlueprintMod = function (req, res) {
        console.log('getBlueprintMod' + req.clientIp);
        if (blueprint_1.BlueprintModel.model == null)
            res.status(503).send();
        else {
            // TODO checks here
            var id = req.params.id;
            var userId = req.query.userId;
            blueprint_1.BlueprintModel.model.find({ _id: id })
                .then(function (blueprints) {
                if (blueprints.length > 0) {
                    var blueprint = blueprints[0];
                    var mdbBlueprint = blueprint.data;
                    var angularBlueprint = new index_1.Blueprint();
                    angularBlueprint.importFromMdb(mdbBlueprint);
                    var bniBlueprint = angularBlueprint.toBniBlueprint(blueprint.name);
                    res.json(bniBlueprint);
                }
                else
                    res.status(500).json({ getBlueprint: 'ERROR' });
            })
                .catch(function (err) {
                console.log('Blueprint find error');
                console.log(err);
                res.status(500).json({ getBlueprint: 'ERROR' });
            });
        }
    };
    BlueprintController.prototype.getBlueprintThumbnail = function (req, res) {
        console.log('getBlueprintThumbnail' + req.clientIp);
        if (blueprint_1.BlueprintModel.model == null)
            res.status(503).send();
        else {
            // TODO checks here
            var id = req.params.id;
            var userId = req.query.userId;
            blueprint_1.BlueprintModel.model.find({ _id: id })
                .then(function (blueprints) {
                if (blueprints.length > 0) {
                    var blueprint = blueprints[0];
                    var mdbBlueprint = blueprint.data;
                    var angularBlueprint = new index_1.Blueprint();
                    angularBlueprint.importFromMdb(mdbBlueprint);
                    // TODO not sure if I should allow users to regen, or just serve the save thumbnail
                    //PixiBackend.pixiBackend.generateThumbnail(angularBlueprint);
                    res.json({ status: 'ok' });
                }
                else
                    res.status(500).json({ getBlueprint: 'ERROR' });
            })
                .catch(function (err) {
                console.log('Blueprint find error');
                console.log(err);
                res.status(500).json({ getBlueprint: 'ERROR' });
            });
        }
    };
    BlueprintController.prototype.getBlueprints = function (req, res) {
        console.log('getBlueprints' + req.clientIp);
        if (blueprint_1.BlueprintModel.model == null)
            res.status(503).send();
        else {
            var filterUserId = void 0;
            var filterName = void 0;
            var getDuplicates = void 0;
            var dateFilter = new Date();
            var userId_2 = '';
            var userJwt = req.user;
            if (userJwt != null)
                userId_2 = userJwt._id;
            try {
                var dateInt = parseInt(req.query.olderthan);
                dateFilter.setTime(dateInt);
                filterUserId = req.query.filterUserId;
                filterName = req.query.filterName;
                getDuplicates = req.query.getDuplicates;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ getBlueprints: 'ERROR' });
                return;
            }
            var filter = { $and: [{ createdAt: { $lt: dateFilter } }, { deleted: { $ne: true } }] };
            if (filterUserId != null)
                filter.$and.push({ owner: filterUserId });
            if (filterName != null)
                filter.$and.push({ name: { $regex: filterName, $options: 'i' } });
            if (!getDuplicates)
                filter.$and.push({ $or: [{ isCopy: null }, { isCopy: false }] });
            var browseIncrement = parseInt(process.env.BROWSE_INCREMENT);
            var query = blueprint_1.BlueprintModel.model.find(filter).sort({ createdAt: -1 }).limit(browseIncrement * 2).populate('owner');
            query.then(function (blueprints) {
                BlueprintController.handleGetBlueprint(req, res, userId_2, blueprints);
            })
                .catch(function (err) {
                console.log('Blueprint find error');
                console.log(err);
                res.status(500).json({ getBlueprint: 'ERROR' });
            });
        }
    };
    BlueprintController.handleGetBlueprint = function (req, res, userId, blueprints) {
        var browseIncrement = parseInt(process.env.BROWSE_INCREMENT);
        var returnValueAny = {};
        var returnValue = returnValueAny;
        returnValue.blueprints = [];
        returnValue.oldest = new Date();
        if (blueprints.length) {
            returnValue.remaining = blueprints.length - browseIncrement;
            if (returnValue.remaining < 0)
                returnValue.remaining = 0;
            for (var indexBlueprint = 0; indexBlueprint < Math.min(browseIncrement, blueprints.length); indexBlueprint++) {
                var blueprint = blueprints[indexBlueprint];
                if (blueprint.createdAt < returnValue.oldest)
                    returnValue.oldest = blueprint.createdAt;
                var ownerId = '';
                var username = '';
                if (user_1.UserModel.isUser(blueprint.owner)) {
                    username = blueprint.owner.username;
                    ownerId = blueprint.owner.id;
                }
                var likedByMe = false;
                if (userId != null && blueprint.likes != null && blueprint.likes.indexOf(userId) != -1)
                    likedByMe = true;
                var ownedByMe = false;
                if (userId != null && ownerId == userId)
                    ownedByMe = true;
                //console.log(userId + '_' + ownerId)
                var nbLikes = 0;
                if (blueprint.likes != null)
                    nbLikes = blueprint.likes.length;
                returnValue.blueprints.push({
                    id: blueprint._id,
                    name: blueprint.name,
                    ownerId: ownerId,
                    ownerName: username,
                    tags: blueprint.tags,
                    createdAt: blueprint.createdAt,
                    modifiedAt: blueprint.modifiedAt,
                    thumbnail: blueprint.thumbnail,
                    nbLikes: nbLikes,
                    likedByMe: likedByMe,
                    ownedByMe: ownedByMe
                });
            }
            // Long timeout for debug
            //setTimeout(() => { res.json(returnValue); }, 2000)
            res.json(returnValue);
        }
        else
            res.json(returnValue);
    };
    BlueprintController.saveBlueprint = function (req, res, blueprint, ownerId, name, data, thumbnail, overwriteCreateDate) {
        blueprint.owner = ownerId;
        blueprint.name = name;
        // TODO tags
        blueprint.data = data;
        blueprint.markModified('data');
        blueprint.thumbnail = thumbnail;
        blueprint.deleted = false;
        if (overwriteCreateDate || blueprint.createdAt == null)
            blueprint.createdAt = new Date();
        blueprint.modifiedAt = new Date();
        blueprint.save()
            .then(function (newBlueprint) {
            var id = newBlueprint.id;
            res.json({ id: id });
            // Then we identify if the uploaded bleuprint is a duplicate
            blueprint_1.BlueprintModel.model.find({}).sort({ createdAt: 1 }).then(function (blueprints) {
                batch_utils_1.BatchUtils.UpdateBasedOn(newBlueprint, blueprints, blueprints.length - 1);
                batch_utils_1.BatchUtils.UpdatePositionCorrection(newBlueprint);
            });
        })
            .catch(function (error) {
            console.log('Blueprint save error');
            console.log(error);
            res.status(500).json({ saveBlueprintResult: 'ERROR' });
        });
    };
    return BlueprintController;
}());
exports.BlueprintController = BlueprintController;
