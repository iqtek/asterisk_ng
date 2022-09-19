export type ServerSettings = {
    serverAddress: string,
    secretKey: string
}


export type AmocrmSettings = {
    showPanel: boolean,
    enableNotification: boolean,
}


export type SettingsModel = {
    server: ServerSettings,
    amocrm: AmocrmSettings
}
