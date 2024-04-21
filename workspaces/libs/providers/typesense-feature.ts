import { Logger } from '@nestjs/common';
import { Document } from 'bson';
import _ from 'lodash';
import { ChangeStreamDocument } from 'mongodb';
import { Client } from 'typesense';
import Collection, { CollectionFieldSchema } from 'typesense/lib/Typesense/Collection';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { CollectionDropFieldSchema } from 'typesense/src/Typesense/Collection';

import { TypesenseSearchModel } from '../interfaces';

export class TypesenseFeature<TSchema extends Document = Document> implements TypesenseSearchModel<TSchema> {
    private _Collection: Collection<TSchema>;

    constructor(client: Client, schema: CollectionCreateSchema) {
        this.register(client, schema).then();
    }

    private async register(client: Client, schema: CollectionCreateSchema) {
        const collection = client.collections<TSchema>(schema.name);

        if (await collection.exists()) {
            const updatedFieldNames = schema.fields.map((fields) => fields.name);
            const existedFields = (await collection.retrieve()).fields;
            const existedFieldNames = existedFields.map((fields) => fields.name);
            const newFields: CollectionFieldSchema[] = schema.fields.filter(
                (field) => !existedFieldNames.includes(field.name) && field.name !== 'id',
            );
            const modifiedFields: CollectionFieldSchema[] = schema.fields.filter((field) => {
                if (!existedFieldNames.includes(field.name) || field.name === 'id') {
                    return false;
                }
                const oldField = existedFields.find((existedField) => existedField.name === field.name);

                return !!_.find(_.keys(field), (key) => field[key] !== oldField[key]);
            });
            const deletedFields: CollectionDropFieldSchema[] = [
                ...existedFields.filter((field) => !updatedFieldNames.includes(field.name) && field.name !== 'id'),
                ...modifiedFields,
            ].map((field) => ({ name: field.name, drop: true }));

            if (deletedFields?.length || newFields?.length) {
                await collection.update({
                    fields: [...newFields, ...deletedFields, ...modifiedFields],
                });
            }
        } else {
            await client.collections().create(schema);
        }
        this._Collection = client.collections<TSchema>(schema.name);
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
