class BlacklistTokenDTO {
    constructor(blacklistToken) {
        this.token = blacklistToken.token || null;
        this.reason = blacklistToken.reason || null;
        this.user = blacklistToken.user || null;
    }
}

module.exports = BlacklistTokenDTO;
