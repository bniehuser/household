import { Service } from 'typedi';
import { config } from 'dotenv';
config();

@Service('ConfigService')
export class ConfigService {
    private readonly _config: {[key: string]: any};
    constructor() {
        this._config = {
            ...process.env,
        }
    }

    public get(key: string) {
        return this._config[key];
    }
}