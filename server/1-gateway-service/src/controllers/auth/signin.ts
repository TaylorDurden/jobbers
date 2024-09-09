import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { authService } from '@gateway/services/api/auth.service';
import { StatusCodes } from 'http-status-codes';

export class SignIn {
  public async signIn(req: Request, res: Response) {
    const response: AxiosResponse = await authService.signIn(req.body);
    const { message, user, token } = response.data;
    req.session = { jwt: token }; // see the auth service signin controller response
    res.status(StatusCodes.OK).json({ message, user });
  }
}
