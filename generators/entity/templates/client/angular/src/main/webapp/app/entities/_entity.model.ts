<%#
 Copyright 2013-2017 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://jhipster.github.io/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-%>
<% const enumsAlreadyDeclared = [];
    fields.forEach(field => {
    if (field.fieldIsEnum && enumsAlreadyDeclared.indexOf(field.fieldType) === -1) {
        enumsAlreadyDeclared.push(field.fieldType); %>
const enum <%= field.fieldType %> {<%
        const enums = field.fieldValues.split(',');
        for (let i = 0; i < enums.length; i++) { %>
    '<%= enums[i] %>'<%if (i < enums.length - 1) { %>,<% } } %>

}
<%_ } }); _%>
<%_ if (dto === "no") {
       for (const rel of differentRelationships) { _%>
import { <%= rel.otherEntityAngularName %> } from '../<%= rel.otherEntityModulePath %>';
<%_ }
}
const variables = {};
const defaultVariablesValues = {};
let tsKeyType;
if (pkType === 'String') {
    tsKeyType = 'string';
} else {
    tsKeyType = 'number';
}
variables['id'] = 'id?: ' + tsKeyType;
fields.forEach(field => {
    const fieldType = field.fieldType;
    const fieldName = field.fieldName;
    let tsType;
    if (field.fieldIsEnum) {
        tsType = fieldType;
    } else if (fieldType === 'Boolean') {
        tsType = 'boolean';
        defaultVariablesValues[fieldName] = 'this.' + fieldName + ' = false;';
    } else if (fieldType === 'Double' || fieldType === 'Float' || fieldType === 'Long' || fieldType === 'Integer' || fieldType === 'BigDecimal') {
        tsType = 'number';
    } else if (fieldType === 'String'  || fieldType === 'UUID') {
        tsType = 'string';
    } else { //(fieldType === 'byte[]' || fieldType === 'ByteBuffer') && fieldTypeBlobContent === 'any' || (fieldType === 'byte[]' || fieldType === 'ByteBuffer') && fieldTypeBlobContent === 'image' || fieldType === 'LocalDate'
        tsType = 'any';
        if ((fieldType === 'byte[]' || fieldType === 'ByteBuffer') && field.fieldTypeBlobContent !== 'text') {
            variables[fieldName + 'ContentType'] = fieldName + 'ContentType?: ' + 'string';
        }
    }
    variables[fieldName] = fieldName + '?: ' + tsType;
});
relationships.forEach(relationship => {
    let fieldType;
    let fieldName;
    const relationshipType = relationship.relationshipType;
    if (relationshipType == 'one-to-many' || relationshipType == 'many-to-many') {
        fieldType = `${relationships.otherEntityAngularName}[]`;
        fieldName = relationships.relationshipFieldNamePlural;
    } else {
        if (dto === "no") {
            fieldType = relationships.otherEntityAngularName;
            fieldName = relationships.relationshipFieldName;
        } else {
            fieldType = tsKeyType;
            fieldName = `${relationships.relationshipFieldName}Id`;
        }
    }
    variables[fieldName] = fieldName + '?: ' + fieldType;
});_%>
export class <%= entityAngularName %> {
    constructor(<% for (idx in variables) { %>
        public <%- variables[idx] %>,<% } %>
    ) {<% for (idx in defaultVariablesValues) { %>
        <%- defaultVariablesValues[idx] %><% } %>
    }
}
