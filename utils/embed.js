const package = require('../package.json');

let color;

module.exports = (message, description, type, footer, image, fields, thumbnail, title) => {
    switch (type) {
        case 'success':
            color = 0x2ecc71;
            break;
        case 'warn':
            color = 0xEDD809;
            break;
        case 'error':
            color = 0xe74c3c;
            break;
        default:
            color = 0x36393F;
            break;
    }

    let output = {
            author: {
                name: `Hey ${message.author.username}`,
                icon_url: message.author.avatarURL()
            },
            color,
            title,
            description,
            fields,
            thumbnail: {
                url: thumbnail
            },
            image,
            footer: {
                text: footer !== undefined ? footer + ` | v${package.version}` : `v${package.version}`,
            }
        };
    return output;
}