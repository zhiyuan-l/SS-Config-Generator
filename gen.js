const SS_PREFIX = "ss://";
const SSR_PREFIX = "ssr://";

// scheme references
// ss: https://shadowsocks.org/en/config/quick-guide.html
// ssr: https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/SSR-QRcode-scheme

class Config {
    constructor(server, server_port, password, method, obfs = "plain", protocol = "origin", group = "default", remarks = null, obfsparam = null, protoparam = null, local_port = 1080, stimeout = 600) {
        this.server = server;
        this.server_port = server_port;
        this.local_port = local_port;
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
    const config_text = `${config.method}:${config.password}@${config.server}:${config.server_port}`;
    const ciphertext = base64(config_text);
    const result = `${SS_PREFIX}${ciphertext}`;
    return result;
}

function isNullOrEmpty(text) {
	return text == "" || text == null;
}

function genSSRConfig(config) {

    if (password == null) {
        // invalid config
        return null;
    }

    const base64pass = base64(config.password);

    let config_text = `${config.server}:${config.server_port}:${config.protocol}:${config.method}:${config.obfs}:${base64pass}/?`;
    let flag = false;

    // check obfs param
    if (!isNullOrEmpty(config.obfsparam)) {
        config_text += `obfsparam=${base64(config.obfsparam)}`;
        flag = true;
    }

    // check protocol param
    if (!isNullOrEmpty(config.protoparam)) {
        if (flag) {
            config_text += "&";
        }
        config_text += `protoparam=${base64(config.protoparam)}`;
        flag = true;
    }

    // check group
    if (!isNullOrEmpty(config.group)) {
        if (flag) {
            config_text += "&";
        }
        config_text += `group=${base64(config.group)}`;
        flag = true;
    }

    // check remarks
    if (!isNullOrEmpty(config.remarks)) {
        if (flag) {
            config_text += "&";
        }
        config_text += `remarks=${base64(config.remarks)}`;
        flag = true;
    }

    const ciphertext = base64(config_text);
    const result = `${SSR_PREFIX}${ciphertext}`;
    return result;
}

function base64(text) {
    return removePadding(Base64.encode(text));
}

function removePadding(text) {
    if (text.endsWith("==")) {
        return text.slice(0, -2);
    }
    if (text.endsWith("=")) {
        return text.slice(0, -1);
    }
    return text;
}

function genQRCode(config_text) {

}