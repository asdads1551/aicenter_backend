import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BadRequestError } from 'passport-headerapikey';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryModel.findOne({ _id: id }).exec();
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCat = new this.categoryModel(createCategoryDto);
    return createdCat.save();
  }

  async updateOne(id: string, dto: UpdateCategoryDto): Promise<boolean> {
    const result = await this.categoryModel
      .updateOne({ _id: new mongoose.Types.ObjectId(id) }, dto)
      .exec();
    return result.modifiedCount === 1;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.categoryModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
