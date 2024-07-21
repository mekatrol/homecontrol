import { lock } from 'proper-lockfile';
import fs from 'fs';
import { APP_FILE_NAME, DEVICES_FILE_NAME, POINTS_FILE_NAME, USERS_FILE_NAME } from '../constants';
import path from 'path';
import { Point } from '../models/point';
import { User } from '../models/user';

const APP_LOCK = './app';

export interface DataManager {
  initData(): void;
  getPoints(): Promise<Point[]>;
  addPoint(point: Point): Promise<Point>;

  // User methods
  createUser(user: User): Promise<User>;
  deleteUser(username: string): Promise<boolean>;
  findUser(username: string): Promise<User | undefined>;
}

class DataManagerImpl implements DataManager {
  private _dataDir: string;
  private _appFile: string;
  private _devicesFile: string;
  private _pointsFile: string;
  private _usersFile: string;
  private _users: User[] | undefined;

  constructor(dataDir: string) {
    this._dataDir = dataDir;
    this._appFile = path.join(dataDir, APP_FILE_NAME);
    this._devicesFile = path.join(dataDir, DEVICES_FILE_NAME);
    this._pointsFile = path.join(dataDir, POINTS_FILE_NAME);
    this._usersFile = path.join(dataDir, USERS_FILE_NAME);
  }

  public initData(): void {
    const dataDirectory = this._dataDir;

    lock(APP_LOCK, { realpath: false })
      .then(async (release: any) => {
        if (!fs.existsSync(dataDirectory)) {
          fs.mkdirSync(dataDirectory);
        }

        if (!fs.existsSync(this._appFile)) {
          this._writeJsonFile(this._appFile, {
            appName: 'homecontrol-server'
          });
        }

        if (!fs.existsSync(this._devicesFile)) {
          this._writeJsonFile(this._devicesFile, []);
        }

        if (!fs.existsSync(this._pointsFile)) {
          this._writeJsonFile(this._pointsFile, []);
        }

        if (!fs.existsSync(this._usersFile)) {
          this._writeJsonFile(this._usersFile, []);
        }

        // Release the lock
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
    await this._writeJsonFile(this._pointsFile, points);

    // Release the lock
    release();

    return point;
  }

  // User methods
  public async createUser(user: User): Promise<User> {
    if (!!(await this.findUser(user.username))) {
      throw new Error(`The user '${user.username}' already exists.`);
    }

    const newUser = { ...user };
    this._users?.push(newUser);
    await this._writeJsonFile(this._usersFile, this._users);

    return { username: newUser.username, password: '*******' };
  }

  public async deleteUser(username: string): Promise<boolean> {
    const user = (this._users ?? (await this._readUsers())).find((u) => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      return false;
    }

    this._users = this._users!.filter((u) => u.username.toLowerCase() !== username.toLowerCase());
    await this._writeJsonFile(this._usersFile, this._users);

    return true;
  }

  public async findUser(username: string): Promise<User | undefined> {
    const users = this._users ?? (await this._readUsers());

    return users.find((u) => u.username.toLowerCase() === username);
  }

  private async _readPoints(): Promise<Point[]> {
    // Read points
    const json = await fs.promises.readFile(this._pointsFile, 'utf8');
    const points = JSON.parse(json);
    return points;
  }

  private async _readUsers(): Promise<User[]> {
    try {
      // Read users
      const json = await fs.promises.readFile(this._usersFile, 'utf8');
      this._users = JSON.parse(json) as User[];
      return this._users;
    } catch (err: any) {
      // Not a valid JSON file?
      if (err.message.includes('JSON')) {
        // Back up the file
        await fs.promises.copyFile(this._usersFile, this._usersFile + `.${crypto.randomUUID()}`);

        // Reset file to empty
        this._users = [];
        await this._writeJsonFile(this._usersFile, this._users);
        return this._users;
      }

      // Rethrow error
      throw err;
    }
  }

  private async _writeJsonFile(filename: string, o: any) {
    await fs.promises.writeFile(filename, JSON.stringify(o, null, 4), 'utf8');
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
