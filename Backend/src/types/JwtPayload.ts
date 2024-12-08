export interface JwtPayload {
    userId: number;
    tenantId: number;
    role: string;
    iat?: number;
    exp?: number;
}
