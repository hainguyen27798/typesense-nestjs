import { Logger } from '@nestjs/common';
import { Client } from 'typesense';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

export class TypesenseCoreSync {
    constructor(options: ConfigurationOptions) {
        const _TypesenseClient: Client = new Client(options);
        return _TypesenseClient.health
            .retrieve()
            .then((rs) => {
                Logger.log(`TypeSenseClient health check: ${rs.ok}`);
                return _TypesenseClient;
            })
            .catch((err) => {
                Logger.error(`TypeSenseClient: ${err.errors}`);
                return null;
            });
    }
}
