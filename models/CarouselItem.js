import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const CarouselItemSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  routerLink: {
    type: String,
    required: true
  },
  queryParams: {
    query: String
  }
});

export default mongoose.model('CarouselItem', CarouselItemSchema);
