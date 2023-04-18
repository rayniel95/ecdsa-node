import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

export function hashMessage(message: string) {
    return keccak256(utf8ToBytes(message));
}

function recoverKey(message: string, signature: string, recoveryBit: number) {
    return secp.recoverPublicKey(hashMessage(message), signature, recoveryBit)
}

export function verifySignature(message: string, signature: string, publicKey: string) {
    return secp.verify(signature, hashMessage(message), publicKey)
}

function getAddress(publicKey: Uint8Array) {
    return keccak256(publicKey.slice(1)).slice(-20)
}

export function getAddressFromSignature(message: string, signature: string, recoveryBit: number) {
    return toHex(getAddress(
        recoverKey(message, signature, recoveryBit))
    )
}