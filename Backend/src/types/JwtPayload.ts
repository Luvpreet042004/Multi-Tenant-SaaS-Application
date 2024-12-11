export interface JwtPayload {
    id: number;
    tenantId: number;
    role: string;
    iat?: number;
    exp?: number;
}
