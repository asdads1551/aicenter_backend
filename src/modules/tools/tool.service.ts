import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tool } from './tool.schema';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { isNil } from 'lodash';

@Injectable()
export class ToolService {
  constructor(@InjectModel(Tool.name) private toolModel: Model<Tool>) {}

  async findAll(): Promise<Tool[]> {
    return this.toolModel.find().exec();
  }

  async findOne(id: string): Promise<Tool | null> {
    return this.toolModel.findOne({ _id: id }).exec();
  }

  async create(createToolDto: CreateToolDto): Promise<Tool> {
    const createdCat = new this.toolModel(createToolDto);
    return createdCat.save();
  }

  async updateOne(id: string, dto: UpdateToolDto): Promise<boolean> {
    const result = await this.toolModel
      .updateOne({ _id: new mongoose.Types.ObjectId(id) }, dto)
      .exec();
    return result.modifiedCount === 1;
  }

  async adjustLikes(id: string, range: number): Promise<boolean> {
    const result = await this.toolModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { $inc: { likeCount: range } },
    );
    return result.modifiedCount === 1;
  }

  async adjustFavs(id: string, range: number): Promise<boolean> {
    const result = await this.toolModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { $inc: { favCount: range } },
    );
    return result.modifiedCount === 1;
  }

  async adjustComments(id: string, range: number): Promise<boolean> {
    const result = await this.toolModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { $inc: { commentCount: range } },
    );
    return result.modifiedCount === 1;
  }

  async addReview(id: string, rating: number): Promise<boolean> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    const tool = await this.toolModel.findOne({ _id: id });
    if (isNil(tool)) {
      return false;
    }
    const newAvgReviewRating =
      (tool.reviewCount * tool.reviewAvgRating + rating) /
      (tool.reviewCount + 1);
    const result = await this.toolModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        reviewAvgRating: newAvgReviewRating,
        reviewCount: tool.reviewCount + 1,
      },
    );
    return result.modifiedCount === 1;
  }

  async deleteReview(id: string, rating: number): Promise<boolean> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    const tool = await this.toolModel.findOne({ _id: id });
    if (isNil(tool)) {
      return false;
    }
    const newAvgReviewRating =
      (tool.reviewCount * tool.reviewAvgRating - rating) /
      (tool.reviewCount - 1);
    const result = await this.toolModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        reviewAvgRating: newAvgReviewRating,
        reviewCount: tool.reviewCount - 1,
      },
    );
    return result.modifiedCount === 1;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.toolModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
