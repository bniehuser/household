import { Inject, Service } from 'typedi';
import { LogService } from './log.service';
import fs from "fs";
import path from "path";

@Service('FilesystemService')
export class FilesystemService {
    constructor(@Inject('LogService') private readonly logService: LogService) {}

    /**
     * Gets a file's contents relative to the proiect root
     * NOTE: this works pre and post compilation since /src and /lib are the same depth
     * @param filePath
     * @param options
     */
    public getFileContents(filePath: string, options: string = 'utf8') {
        const finalPath = path.resolve(__dirname, '..', '..', filePath);
        console.log('trying path', finalPath);
        return fs.readFileSync(finalPath, options)
    }
}