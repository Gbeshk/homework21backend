"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Module = void 0;
const common_1 = require("@nestjs/common");
const awss3_service_1 = require("./awss3.service");
let AwsS3Module = class AwsS3Module {
};
exports.AwsS3Module = AwsS3Module;
exports.AwsS3Module = AwsS3Module = __decorate([
    (0, common_1.Module)({
        providers: [awss3_service_1.AwsS3Service],
        exports: [awss3_service_1.AwsS3Service]
    })
], AwsS3Module);
//# sourceMappingURL=awss3.module.js.map