"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_slot;
(function (clip_slot_1) {
    var ClipSlot = /** @class */ (function () {
        function ClipSlot() {
        }
        ClipSlot.prototype.b_has_clip = function () {
        };
        ClipSlot.prototype.delete_clip = function () {
        };
        ClipSlot.prototype.duplicate_clip_to = function (clip_slot) {
            this.clip_slot_dao.duplicate_clip_to(clip_slot.get_id());
        };
        ClipSlot.prototype.get_id = function () {
        };
        return ClipSlot;
    }());
    clip_slot_1.ClipSlot = ClipSlot;
    var ClipSlotDao = /** @class */ (function () {
        function ClipSlotDao(live_api) {
            this.live_api = live_api;
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
        return ClipSlotDao;
    }());
    clip_slot_1.ClipSlotDao = ClipSlotDao;
})(clip_slot = exports.clip_slot || (exports.clip_slot = {}));
//# sourceMappingURL=clip_slot.js.map