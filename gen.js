const SS_PREFIX = 'ss://';
const SSR_PREFIX = 'ssr://';

// scheme references
// ss: https://shadowsocks.org/en/config/quick-guide.html
// ssr: https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/SSR-QRcode-scheme

class Config {
    constructor(server, serverPort, password, method, obfs = 'plain', protocol = 'origin', group = 'default', remarks = null, obfsparam = null, protoparam = null, localPort = 1080, stimeout = 600) {
        this.server = server;
        this.serverPort = serverPort;
        this.localPort = localPort;
        this.password = password;
        this.stimeout = stimeout;
        this.method = method;
        this.group = group;
        this.remarks = remarks;
        this.obfs = obfs;
        this.obfsparam = obfsparam;
        this.protoparam = protoparam;
        this.protocol = protocol;
    }
}

function genSSConfig(config) {
    const configText = `${config.method}:${config.password}@${config.server}:${config.serverPort}`;
    const cipher = base64(configText);
    return `${SS_PREFIX}${cipher}#${config.remarks}`;
}

function isNullOrEmpty(text) {
	return text === '' || text == null;
}

function genSSRConfig(config) {
    if (config.password == null) {
        // invalid config
        return null;
    }

    const base64pass = base64(config.password);

    let configText = `${config.server}:${config.serverPort}:${config.protocol}:${config.method}:${config.obfs}:${base64pass}/?`;
    let flag = false;

    // check obfs param
    if (!isNullOrEmpty(config.obfsparam)) {
        configText += `obfsparam=${base64(config.obfsparam)}`;
        flag = true;
    }

    // check protocol param
    if (!isNullOrEmpty(config.protoparam)) {
        if (flag) {
            configText += '&';
        }
        configText += `protoparam=${base64(config.protoparam)}`;
        flag = true;
    }

    // check group
    if (!isNullOrEmpty(config.group)) {
        if (flag) {
            configText += '&';
        }
        configText += `group=${base64(config.group)}`;
        flag = true;
    }

    // check remarks
    if (!isNullOrEmpty(config.remarks)) {
        if (flag) {
            configText += '&';
        }
        configText += `remarks=${base64(config.remarks)}`;
        // flag = true;
    }

    const cipher = base64(configText);
    return `${SSR_PREFIX}${cipher}`;
}

function base64(text) {
    return removePadding(Base64.encode(text));
}

function removePadding(text) {
    if (text.endsWith('==')) {
        return text.slice(0, -2);
    }
    if (text.endsWith('=')) {
        return text.slice(0, -1);
    }
    return text;
}

/**
 * localStorage helper class
 * */
class LSHelper {

    static set(key, value){
        if (isNullOrEmpty(key)){
            return;
        }

        localStorage.setItem(key, JSON.stringify(value));
    }

    static get(key){
        let value = localStorage.getItem(key);
        if (value) {
            value = JSON.parse(value);
        }

        return value;
    }

}