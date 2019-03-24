"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var logger_1 = require("../log/logger");
var clip_slot;
(function (clip_slot_1) {
    var LiveApiJs = live_1.live.LiveApiJs;
    var Clip = clip_1.clip.Clip;
    var ClipDao = clip_1.clip.ClipDao;
    var Logger = logger_1.log.Logger;
    var ClipSlot = /** @class */ (function () {
        function ClipSlot(clip_slot_dao) {
            this.clip_slot_dao = clip_slot_dao;
        }
        ClipSlot.prototype.b_has_clip = function () {
            return this.clip !== null;
        };
        ClipSlot.prototype.delete_clip = function () {
        };
        ClipSlot.prototype.duplicate_clip_to = function (clip_slot) {
            this.clip_slot_dao.duplicate_clip_to(clip_slot.get_id());
        };
        ClipSlot.prototype.get_id = function () {
            return;
        };
        ClipSlot.prototype.create_clip = function (length_beats) {
        };
        ClipSlot.prototype.load_clip = function () {
            this.clip = this.clip_slot_dao.get_clip();
        };
        ClipSlot.prototype.get_clip = function () {
            return this.clip;
        };
        return ClipSlot;
    }());
    clip_slot_1.ClipSlot = ClipSlot;
    var ClipSlotDao = /** @class */ (function () {
        function ClipSlotDao(live_api, messenger) {
            this.live_api = live_api;
            this.messenger = messenger;
        }
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
            var logger = new Logger('max');
            // logger.log(String(this.live_api.get('clip')));
            // logger.log(this.live_api.get('clip').split(',').join(' '));
            return new Clip(new ClipDao(new LiveApiJs(String(this.live_api.get('clip')).split(',').join(' ')), this.messenger));
        };
        ClipSlotDao.prototype.get_path = function () {
            return;
        };
        return ClipSlotDao;
    }());
    clip_slot_1.ClipSlotDao = ClipSlotDao;
})(clip_slot = exports.clip_slot || (exports.clip_slot = {}));
//# sourceMappingURL=clip_slot.js.map