import { Amenity, City, Coordinates, HousingType } from '../../../types/index.js';

export class UpdateOfferDto {
  public name?: string;
  public description?: string;
  public city?: City;
  public previewSrc?: string;
  public images?: string[];
  public isPremium?: boolean;
  public type?: HousingType;
  public bedroomsCount?: number;
  public guestCount?: number;
  public price?: number;
  public amenities?: Amenity[];
  public coordinates?: Coordinates;
}
