import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";
import { ethers } from "ethers";
//NOTE - I think will be better to use ethersjs

export function hashMessage(message: string) {
    return keccak256(utf8ToBytes(message));
}

function recoverKey(message: string, signature: string, recoveryBit: number) {
    return secp.recoverPublicKey(hashMessage(message), signature, recoveryBit)
}

export function verifySignature(message: string, signature: string, recoverBit?: number) {
    if (recoverBit) {
        return secp.verify(
            signature,
            hashMessage(message),
            recoverKey(message, signature, recoverBit)
        )
    }

    return ethers.utils.verifyMessage(message, signature)
}

function getAddress(publicKey: Uint8Array) {
    return keccak256(publicKey.slice(1)).slice(-20)
}

export function getAddressFromSignature(message: string, signature: string, recoveryBit?: number) {
    if (recoveryBit) {
        return `0x${toHex(getAddress(
            recoverKey(message, signature, recoveryBit))
        )}`
    }
    return ethers.utils.verifyMessage(message,signature)
}

export async function getSignature(message: string, privateKey: string) {
    const [signature, recoverBit] = await secp.sign(
        hashMessage(message),
        sha256(utf8ToBytes(privateKey)),
        { recovered: true }
    )
    return [toHex(signature), recoverBit]
}