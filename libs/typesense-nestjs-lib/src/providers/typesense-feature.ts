import { Logger } from '@nestjs/common';
import { Document } from 'bson';
import { filter, find, keys } from 'lodash';
import { ChangeStreamDocument } from 'mongodb';
import { Client } from 'typesense';
import Collection, { CollectionFieldSchema } from 'typesense/lib/Typesense/Collection';
import { CollectionDropFieldSchema } from 'typesense/src/Typesense/Collection';

import { TypesenseModelDefinition, TypesenseSearchModel } from '../interfaces';

export class TypesenseFeature<TSchema extends Document = Document> implements TypesenseSearchModel<TSchema> {
    private _Collection: Collection<TSchema>;

    constructor(client: Client, model: TypesenseModelDefinition) {
        this.register(client, model).then();
    }

    private async register(client: Client, model: TypesenseModelDefinition) {
        const collection = client.collections<TSchema>(model.schema.name);

        if (await collection.exists()) {
            const updatedFieldNames = model.schema.fields.map((fields) => fields.name);
            const existedFields = (await collection.retrieve()).fields;
            const existedFieldNames = existedFields?.map((fields) => fields.name) || [];
            const newFields: CollectionFieldSchema[] = filter(
                model.schema.fields,
                (field) => field.name !== 'id' && !existedFieldNames.includes(field.name),
            );
            const modifiedFields: CollectionFieldSchema[] = filter(model.schema.fields, (field) => {
                if (field.name === 'id' || !existedFieldNames.includes(field.name)) {
                    return false;
                }
                const oldField = existedFields.find((existedField) => existedField.name === field.name);

                return !!find(keys(field), (key) => field[key] !== oldField[key]);
            });
            const deletedFields: CollectionDropFieldSchema[] = [
                ...filter(existedFields, (field) => field.name !== 'id' && !updatedFieldNames.includes(field.name)),
                ...modifiedFields,
            ].map((field) => ({ name: field.name, drop: true }));

            if (deletedFields?.length || newFields?.length) {
                await collection.update({
                    fields: [...newFields, ...deletedFields, ...modifiedFields],
                });
            }
        } else {
            await client.collections().create(model.schema);
        }
        this._Collection = client.collections<TSchema>(model.schema.name);
    }

    async syncData(record: ChangeStreamDocument<TSchema>) {
        switch (record.operationType) {
            case 'delete':
                await this._Collection.documents(record.documentKey._id.toString()).delete();
                break;
            case 'update':
                await this._Collection
                    .documents(record.documentKey._id.toString())
                    .update(record.updateDescription.updatedFields);
                break;
            case 'insert':
                await this._Collection
                    .documents()
                    .upsert({
                        id: record.documentKey._id,
                        ...record.fullDocument,
                    })
                    .catch((e) => Logger.error(`${record.documentKey._id}: ${e}`));
        }
    }

    get documents() {
        return this._Collection.documents();
    }
}
