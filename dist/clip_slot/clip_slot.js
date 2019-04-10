"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var LiveApiJs = live_1.live.LiveApiJs;
var utils_1 = require("../utils/utils");
var clip_slot;
(function (clip_slot_1) {
    var Clip = clip_1.clip.Clip;
    var ClipDao = clip_1.clip.ClipDao;
    var ClipSlot = /** @class */ (function () {
        function ClipSlot(clip_slot_dao) {
            this.clip_slot_dao = clip_slot_dao;
        }
        ClipSlot.prototype.b_has_clip = function () {
            return this.clip_slot_dao.has_clip();
        };
        ClipSlot.prototype.delete_clip = function () {
            this.clip_slot_dao.delete_clip();
        };
        ClipSlot.prototype.duplicate_clip_to = function (clip_slot) {
            this.clip_slot_dao.duplicate_clip_to(clip_slot.get_id());
        };
        ClipSlot.prototype.get_id = function () {
            return this.clip_slot_dao.get_id();
        };
        ClipSlot.prototype.create_clip = function (length_beats) {
            this.clip_slot_dao.create_clip(length_beats);
        };
        ClipSlot.prototype.load_clip = function () {
            if (this.b_has_clip()) {
                this.clip = this.clip_slot_dao.get_clip();
            }
        };
        // TODO: we should consider checking whether it exists here
        ClipSlot.prototype.get_clip = function () {
            return this.clip;
        };
        return ClipSlot;
    }());
    clip_slot_1.ClipSlot = ClipSlot;
    var ClipSlotDaoVirtual = /** @class */ (function () {
        function ClipSlotDaoVirtual(clip) {
            this.clip = clip;
        }
        ClipSlotDaoVirtual.prototype.create_clip = function (length_beats) {
            throw 'error';
        };
        ClipSlotDaoVirtual.prototype.delete_clip = function () {
            throw 'error';
        };
        ClipSlotDaoVirtual.prototype.duplicate_clip_to = function (id) {
            throw 'error';
        };
        ClipSlotDaoVirtual.prototype.get_clip = function () {
            return this.clip;
        };
        ClipSlotDaoVirtual.prototype.get_id = function () {
            throw 'error';
        };
        ClipSlotDaoVirtual.prototype.get_path = function () {
            throw 'error';
        };
        ClipSlotDaoVirtual.prototype.has_clip = function () {
            return true;
        };
        return ClipSlotDaoVirtual;
    }());
    clip_slot_1.ClipSlotDaoVirtual = ClipSlotDaoVirtual;
    var ClipSlotDao = /** @class */ (function () {
        function ClipSlotDao(live_api, messenger) {
            this.live_api = live_api;
            this.messenger = messenger;
        }
        ClipSlotDao.prototype.create_clip = function (length_beats) {
            this.live_api.call("create_clip", String(length_beats));
        };
        ClipSlotDao.prototype.delete_clip = function () {
            this.live_api.call("delete_clip");
        };
        ClipSlotDao.prototype.has_clip = function () {
            return this.live_api.get("has_clip")[0] === 1;
        };
        ClipSlotDao.prototype.duplicate_clip_to = function (id) {
            this.live_api.call("duplicate_clip_to", ['id', id].join(' '));
        };
        ClipSlotDao.prototype.get_clip = function () {
            return new Clip(new ClipDao(new LiveApiJs(utils_1.utils.cleanse_id(this.live_api.get('clip'))), this.messenger));
        };
        ClipSlotDao.prototype.get_path = function () {
            return utils_1.utils.cleanse_path(this.live_api.get_path());
        };
        ClipSlotDao.prototype.get_id = function () {
            return this.live_api.get_id();
        };
        return ClipSlotDao;
    }());
    clip_slot_1.ClipSlotDao = ClipSlotDao;
})(clip_slot = exports.clip_slot || (exports.clip_slot = {}));
//# sourceMappingURL=clip_slot.js.map