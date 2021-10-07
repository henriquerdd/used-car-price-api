import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp({ email, password }: { email: string; password: string }) {
    const users = await this.usersService.find(email)

    if (users.length) throw new BadRequestException('email in use')

    const salt = randomBytes(8).toString('hex')

    const hash = (await scrypt(password, salt, 32)) as Buffer
    const result = `${salt}.${hash.toString('hex')}`

    const user = await this.usersService.create({ email, password: result })
    return user
  }

  async signIn({ email, password }: { email: string; password: string }) {
    const [user] = await this.usersService.find(email)

    if (!user) throw new NotFoundException('user not found')

    const [salt, hash] = user.password.split('.')

    const testHash = (await scrypt(password, salt, 32)) as Buffer

    if (testHash.toString('hex') !== hash) {
      throw new UnauthorizedException('invalid password')
    }

    return user
  }
}
