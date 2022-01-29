import {ContentFields} from "contentful-management";
import {ContentTypeProps} from "contentful-management/dist/typings/entities/content-type";
import {FieldsMap, MappedContentTypeProps} from "~/types";

export function transformFields(fields: ContentFields[]): FieldsMap {
    return fields.reduce((previousValue, currentValue) => {
        previousValue[currentValue.id] = currentValue;
        return previousValue
    }, {} as FieldsMap)
}

export function transformContentTypeProps(contentType: ContentTypeProps): MappedContentTypeProps {
    return {
        ...contentType,
        fields: transformFields(contentType.fields)
    } as MappedContentTypeProps
}
