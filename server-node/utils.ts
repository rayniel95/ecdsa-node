import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import secp from "ethereum-cryptography/secp256k1";


export function hashMessage(message: string) {
    return keccak256(utf8ToBytes(message)); 
}

export async function recoverKey(message: string, signature: string, recoveryBit: number) {
    return secp.recoverPublicKey(hashMessage(message), signature, recoveryBit)
}

export function verifySignature(message: string, signature: string, publicKey: string) {
    return secp.verify(signature, hashMessage(message), publicKey)
}