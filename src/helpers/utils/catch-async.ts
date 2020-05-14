import { HttpStatus, HttpException } from "@nestjs/common";

export const catchAsync = function <T>(promise: Promise<T>, statusCode?: HttpStatus ) {
    return promise.catch(err => {
        if (!statusCode) statusCode = HttpStatus.BAD_REQUEST

        throw new HttpException(err, statusCode);
    });
};