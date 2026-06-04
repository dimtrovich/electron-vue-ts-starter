import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

export function getPackage() {
    const file = path.resolve('package.json');
    if (process.env.NODE_ENV === 'development' && existsSync(file))
        return JSON.parse(readFileSync(file));

    const files = [
        path.join(process.resourcesPath, 'app.asar', 'package.json'),
        path.join(process.resourcesPath, 'app', 'package.json'),
        file,
    ];

    for (const f of files) {
        if (existsSync(f)) {
            return JSON.parse(readFileSync(f));
        }
    }

    throw new Error('package.json not found');
};