import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const key = process.env.API_CRYPTO_KEY
const IV_LENGTH = 16

const encrypt = (textToEncrypt: string) => {
	let iv = crypto.randomBytes(IV_LENGTH)
	let cipher = crypto.createCipheriv(algorithm, Buffer.from(key!), iv)
	let encrypted = cipher.update(textToEncrypt)
	encrypted = Buffer.concat([encrypted, cipher.final()])
	return iv.toString('hex') + ':' + encrypted.toString('hex')
}
const decrypt = (text: any) => {
	let textParts = text.split(':')
	let iv = Buffer.from(textParts.shift(), 'hex')
	let encryptedText = Buffer.from(textParts.join(':'), 'hex')
	let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key!), iv)
	let decrypted = decipher.update(encryptedText)
	decrypted = Buffer.concat([decrypted, decipher.final()])
	return decrypted.toString()
}

export default { encrypt, decrypt }
