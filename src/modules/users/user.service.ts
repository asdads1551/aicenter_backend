import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserBasicInfosDto } from './dto/get-user-basic-infos.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(dto: GetUserBasicInfosDto): Promise<User[]> {
    return this.userModel
      .find({
        _id: dto.userIds,
      })
      .exec();
  }

  async findAllBasicInfos(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  async findOneByGithubId(githubId: string): Promise<User | null> {
    return this.userModel
      .findOne({
        sourceData: {
          github: {
            id: githubId,
          },
        },
      })
      .exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdCat = new this.userModel(createUserDto);
    return createdCat.save();
  }

  async updateOne(id: string, dto: Partial<UpdateUserDto>): Promise<boolean> {
    const result = await this.userModel
      .updateOne({ _id: new mongoose.Types.ObjectId(id) }, dto)
      .exec();
    return result.modifiedCount === 1;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
