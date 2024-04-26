import { Logger } from '@nestjs/common';
import { Client } from 'typesense';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

export class TypesenseCoreSync {
    static async init(options: ConfigurationOptions) {
        const _TypesenseClient: Client = new Client(options);
        await _TypesenseClient.health
            .retrieve()
            .then((rs) => {
                Logger.log(`TypeSenseClient health check: ${rs.ok}`);
                return _TypesenseClient;
            })
            .catch((err) => {
                Logger.error(`TypeSenseClient: ${err.errors}`);
                return null;
            });
        return _TypesenseClient;
    }
}
