import { ec } from 'elliptic';

const EC = new ec('secp256k1');

export const getEc = () => EC;
