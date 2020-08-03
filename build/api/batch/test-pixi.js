"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPixi = /** @class */ (function () {
    function TestPixi() {
        console.log('Running batch TestPixi');
        setTimeout(this.testPixi, 1000);
    }
    TestPixi.prototype.testPixi = function () {
        console.log('Running batch TestPixi');
    };
    return TestPixi;
}());
exports.TestPixi = TestPixi;
new TestPixi();
