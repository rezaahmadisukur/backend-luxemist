export class LoginResponseDto {
  message?: string;
  token?: string;
  admin?: {
    id: number;
    name: string | null;
    email: string;
  };
}
