export class EventRPC {
    getMessage() {
        throw new Error('Необходимо использовать для EventRPC!')
    }

    genKey() {
        let new_key = "";
        let possible_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 20; i++)
            new_key += possible_chars.charAt(Math.floor(Math.random() * possible_chars.length));

        return new_key;
    }
}