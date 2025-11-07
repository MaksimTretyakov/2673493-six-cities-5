import { createReadStream } from 'node:fs';
import { ICommandHandler } from './command-handler.interface.js';
import type { User, Offer, City, HousingType, Amenity, UserType} from '../shared/types';
import chalk from 'chalk';
import { createInterface } from 'node:readline';
import { ILogger } from '../shared/libs/logger/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/index.js';

@injectable()
export class ImportCommand implements ICommandHandler {
  public readonly name = '--import';

  constructor(@inject(Component.Logger) private readonly logger: ILogger) {}

  private printOffer(offer: Offer) {
    this.logger.info(`
      ${chalk.cyan.bold('Имя:')} ${offer.name}
      ${chalk.cyan.bold('Описание:')} ${offer.description}
      ${chalk.cyan.bold('Дата публикации:')} ${offer.publicationDate}
      ${chalk.cyan.bold('Город:')} ${offer.city}
      ${offer.isPremium ? chalk.green('Премиум') : chalk.red('Не премиум')}
      ${offer.isFavorite ? chalk.green('Избранное') : chalk.red('Не в избранном')}
      ${chalk.cyan.bold('Рейтинг:')} ${offer.rating}
      ${chalk.cyan.bold('Тип:')} ${offer.type}
      ${chalk.cyan.bold('Количество комнат:')} ${offer.bedroomsCount}
      ${chalk.cyan.bold('Количество гостей:')} ${offer.guestCount}
      ${chalk.cyan.bold('Стоимость аренды:')} ${offer.price}
      ${chalk.cyan.bold('Удобства:')} ${offer.amenities.join(', ')}
      ${chalk.cyan.bold('Автор предложения:')} ${offer.host.name}
      ${chalk.cyan.bold('Количество комментариев:')} ${offer.commentsCount}
      ${chalk.cyan.bold('Координаты предложения:')} ${offer.coordinates.latitude} ${offer.coordinates.longitude}
    `);
  }

  private getOffer(lineData: string[]) {
    const [
      name,
      description,
      publicationDate,
      city,
      previewSrc,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedroomsCount,
      guestCount,
      price,
      amenities,
      hostData,
      commentsCount,
      coordinatesData
    ] = lineData;

    const [latitude, longitude] = coordinatesData.split(';');
    const [hostName, hostEmail, hostAvatar, hostPassword, hostType] = hostData.split(';');
    const host: User = {
      name: hostName,
      email: hostEmail,
      avatarSrc: hostAvatar,
      password: hostPassword,
      type: hostType as UserType,
    };

    const offer: Offer = {
      name,
      description,
      publicationDate: new Date(publicationDate),
      city: city as City,
      previewSrc,
      images: images.split(','),
      isPremium: isPremium.toLowerCase() === 'true',
      isFavorite: isFavorite.toLowerCase() === 'true',
      rating: parseFloat(rating),
      type: type as HousingType,
      bedroomsCount: parseInt(bedroomsCount, 10),
      guestCount: parseInt(guestCount, 10),
      price: parseFloat(price),
      amenities: amenities.split(',') as Amenity[],
      host,
      commentsCount: parseInt(commentsCount, 10),
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    };

    return offer;
  }

  public async execute(...params: string[]): Promise<void> {
    const [filepath] = params;

    if (!filepath) {
      this.logger.warn('Не указан путь к файлу. Используйте: --import <filepath>');
      return;
    }

    const readStream = createReadStream(filepath.trim(), { encoding: 'utf-8' });
    const rl = createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      if (line.trim() === '') {
        return;
      }
      const offer = this.getOffer(line.split('\t'));
      this.printOffer(offer);
    });

    readStream.on('error', (error) => {
      this.logger.error(`Не удалось прочитать файл с данными. Ошибка: ${error.message}`, error);
    });

    rl.on('close', () => {
      this.logger.info(chalk.green('Импорт данных успешно завершен.'));
    });
  }
}
