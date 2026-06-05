import { hashCompare, hashValue } from '@/common/utils/hash.util';
import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private readonly userService: UsersService, 
        private readonly jwtService: JwtService
    ){}

    private async createTokens(payload: any): Promise<any>{
        const [accessToken,refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload,{expiresIn:'15m'}),
            this.jwtService.signAsync(payload,{expiresIn:'30m'})])

        return [accessToken,refreshToken]
    }

    

    async signIn(email:string,password:string):Promise<any>{
        try{

            const user = await this.userService.findOneByEmail(email)
            const isPasswordMatch = await hashCompare(password, user.passwordHash)
            if(!isPasswordMatch){
                throw new UnauthorizedException('Invalid credentials')
            }

            const payload = { sub:user.id, email:user.email,roles:user.role }
            const [accessToken,refreshToken] = await this.createTokens(payload)


            const data = { access_token:accessToken, refresh_token:refreshToken}

            return data

        }catch(err) {
            throw new UnauthorizedException('Invalid credentials')
        }

    }

    async refresh(old_refresh_token:string){
        try{
            const oldPayload = await this.jwtService.verifyAsync(old_refresh_token)
            const user = await this.userService.findOneByEmail(oldPayload.email)
            
            const payload = { sub:user.id, email:user.email, roles:user.role }

            const [accessToken,refreshToken] = await this.createTokens(payload)

            const data = { access_token:accessToken, refresh_token:refreshToken}

            return data

        }catch(err){throw new UnauthorizedException('Invalid credentials')}

    }
}
