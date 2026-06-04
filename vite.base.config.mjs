import { builtinModules } from 'node:module';
import pkg from './package.json';

export const builtins = [
    'electron', 
    'unhead/scripts', 'unhead/utils',
    ...builtinModules.map((m) => [m, `node:${m}`]).flat()
];

export const external = [...builtins, ...Object.keys('dependencies' in pkg ? pkg.dependencies : {})];
