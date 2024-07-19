import { lock } from 'proper-lockfile';
import fs from 'fs';
import { APP_FILE_NAME, DEVICES_FILE_NAME, POINTS_FILE_NAME } from '../constants';
import path from 'path';
import { Point } from '../models/point';

const APP_LOCK = './app';

export interface DataManager {
  initData(): void;
  getPoints(): Promise<Point[]>;
  addPoint(point: Point): Promise<Point>;
}

class DataManagerImpl implements DataManager {
  private _dataDir: string;
  private _appFile: string;
  private _devicesFile: string;
  private _pointsFile: string;

  constructor(dataDir: string) {
    this._dataDir = dataDir;
    this._appFile = path.join(dataDir, APP_FILE_NAME);
    this._devicesFile = path.join(dataDir, DEVICES_FILE_NAME);
    this._pointsFile = path.join(dataDir, POINTS_FILE_NAME);
  }

  public initData(): void {
    const dataDirectory = this._dataDir;

    lock(APP_LOCK, { realpath: false })
      .then((release: any) => {
        if (!fs.existsSync(dataDirectory)) {
          fs.mkdirSync(dataDirectory);
        }

        // Initialise database directory if not already exists
        if (!fs.existsSync(this._appFile)) {
          fs.writeFileSync(
            this._appFile,
            JSON.stringify(
              {
                appName: 'homecontrol-server'
              },
              null,
              4
            )
          );
        }

        if (!fs.existsSync(this._appFile)) {
          fs.writeFileSync(
            this._appFile,
            JSON.stringify(
              {
                appName: 'homecontrol-server'
              },
              null,
              4
            )
          );
        }

        if (!fs.existsSync(this._devicesFile)) {
          fs.writeFileSync(this._devicesFile, JSON.stringify([], null, 4));
        }

        if (!fs.existsSync(this._pointsFile)) {
          fs.writeFileSync(this._pointsFile, JSON.stringify([], null, 4));
        }

        // Call the provided release function when you're done,
        // which will also return a promise
        return release();
      })
      .catch((e: any) => {
        // either lock could not be acquired
        // or releasing it failed
        console.error(e);
      });
  }

  public async getPoints(): Promise<Point[]> {
    // Get lock on file
    const release = await lock(APP_LOCK, { realpath: false });

    // Read points
    const points = await this._readPoints();

    // Release the lock
    release();

    return points;
  }

  public async addPoint(point: Point): Promise<Point> {
    // Get lock on file
    const release = await lock(APP_LOCK, { realpath: false });

    const points = await this._readPoints();
    points.push(point);
    await this._writePoints(points);

    // Release the lock
    release();

    return point;
  }

  private async _readPoints(): Promise<Point[]> {
    // Read points
    const json = await fs.promises.readFile(this._pointsFile, 'utf8');
    const points = JSON.parse(json);
    return points;
  }

  private async _writePoints(points: Point[]): Promise<void> {
    await fs.promises.writeFile(this._pointsFile, JSON.stringify(points), 'utf8');
  }
}

let dataManager: DataManager | undefined = undefined;

export const initDataManager = (dataDir: string): DataManager => {
  dataManager = new DataManagerImpl(dataDir);
  dataManager.initData();
  return dataManager;
};

export const getDataManagerInstance = (): DataManager => {
  if (!dataManager) {
    throw new Error();
  }

  return dataManager;
};
