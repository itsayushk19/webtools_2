import { Document, model, models, Schema } from "mongoose";

export interface IImage extends Document {
  title: string;
  activityType: string;
  publicId: string;
  secureUrl: string;
  payloadSize: number;
  config: Record<string, any>; // or a more specific config type if known
  actvityUrl: string;
  author?: {
    _id: String,
    firstName: String,
    lastName: String
  },
  createdAt?: Date;
  updatedAt?: Date;
}


const ActivitySchema = new Schema({
    title: {type: String, required: true},
    activityType: {type: String, required: true},
    publicId: {type: String, required: true},
    secureUrl: {type: String, required: true},
    payloadSize: {type: Number, required: true},
    config: {type: Object, required: true},
    actvityUrl: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

const Activity = models.Activity || model('Activity', ActivitySchema)

export default Activity