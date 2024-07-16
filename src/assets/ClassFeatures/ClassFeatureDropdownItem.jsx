// PROPS
// classFeature - the feature in question

export default function ClassFeatureDropdownItem ( props )
{
    return (
        <option key={props.classFeature.classFeatureID} value={props.classFeature.classFeatureID}>{props.classFeature.name}</option>
    );
}