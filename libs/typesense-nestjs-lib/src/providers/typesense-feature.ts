import { Logger } from '@nestjs/common';
import { filter, find, keys } from 'lodash';
import { ChangeStreamDocument } from 'mongodb';
import { Client } from 'typesense';
import Collection, { CollectionFieldSchema } from 'typesense/lib/Typesense/Collection';
import { CollectionDropFieldSchema } from 'typesense/src/Typesense/Collection';

import { TypesenseModelDefinition, TypesenseSearchModel } from '../interfaces';

class TypesenseSearch<TSchema = any> implements TypesenseSearchModel<TSchema> {
    private _Collection: Collection<TSchema>;

    constructor(collection: Collection<TSchema>) {
        this._Collection = collection;
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

export class TypesenseFeature {
    static async register<TSchema = any>(client: Client, model: TypesenseModelDefinition) {
        let collection = client.collections<TSchema>(model.schema.name);

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
            const newSchema = model.schema;
            newSchema.fields.unshift({
                name: 'id',
                type: 'string',
            });
            await client.collections().create(newSchema);
        }

        collection = client.collections<TSchema>(model.schema.name);

        return new TypesenseSearch(collection);
    }
}
