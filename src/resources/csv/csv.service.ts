import { Injectable } from '@nestjs/common';
import { Resource } from '../schemas/resource.schema';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class CsvService {
  getHeader(resource: Resource) {
    const stream = fs.createReadStream(resource.file.path);
    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('headers', (data) => {
          stream.destroy();
          resolve(data);
        })
        .on('error', (error) => {
          reject(error);
          stream.destroy();
        });
    });
  }

  getColumns(resource: Resource, column: string) {
    const stream = fs.createReadStream(resource.file.path);
    return new Promise((resolve, reject) => {
      const results: string[] = [];
      stream
        .pipe(
          csv({
            mapHeaders: ({ header }) => (column === header ? header : null),
          }),
        )
        .on('data', (data) => data[column] && results.push(data[column]))
        .on('end', () => resolve(results))
        .on('error', (error) => {
          reject(error);
          stream.destroy();
        });
    });
  }
}
