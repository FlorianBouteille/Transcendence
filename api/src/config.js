
export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = "bbb194bce7e3598582ab37e7c4896a83ad945fba5bf0513c23b7be88fb1ab5148950400abefb7d92f973174454f3119041fd48800eb02f2983b402c43387bb8e";

export const API_RATE_LIMIT_WINDOW_MS = Number(process.env.API_RATE_LIMIT_WINDOW_MS || 60000);
export const API_RATE_LIMIT_MAX = Number(process.env.API_RATE_LIMIT_MAX || 120);
