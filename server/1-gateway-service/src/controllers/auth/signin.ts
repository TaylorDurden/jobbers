import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { authService } from '@gateway/services/api/auth.service';
import { StatusCodes } from 'http-status-codes';

export class SignIn {
  public async signIn(req: Request, res: Response) {
    const response: AxiosResponse = await authService.signIn(req.body);
    req.session = { jwt: response.data.token }; // see the auth service signup controller response
    res.status(StatusCodes.CREATED).json({ message: response.data.message, user: response.data.user });
  }
}
