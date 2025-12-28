import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 5, maxlength: 1024 })
  public text!: string;

  @prop({ required: true })
  public publicationDate!: Date;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, ref: () => 'UserEntity' })
  public user!: Types.ObjectId;

  @prop({ required: true, ref: () => 'OfferEntity' })
  public offerId!: Types.ObjectId;
}

export const CommentModel = getModelForClass(CommentEntity);
