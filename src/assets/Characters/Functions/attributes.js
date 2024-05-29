export default function findCharAttributeByID ( character, id )
{
    return (character.raw.attributes.find( attribute => attribute.id.attributeID == id )).value;
}