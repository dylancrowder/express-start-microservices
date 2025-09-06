export declare class AppError extends Error {
    readonly httpCode: number;
    readonly isOperational: boolean;
    readonly responseMessage: string;
    constructor(name: string, httpCode: number, message: any, responseMessage: string, isOperational?: boolean);
}
//# sourceMappingURL=appError.d.ts.map