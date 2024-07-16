// PROPS
// totalClassFeatures - all the class features
// changeClassFeature() - function to handle a change

import ClassFeatureDropdownItem from "./ClassFeatureDropdownItem";

export default function ClassFeatureDropdown ( props )
{
    return (
        <select name="allClassFeatures" id="allClassFeatures" onChange={props.changeClassFeature}>
                <option value="placeholder">Choose class feature</option>
                {props.totalClassFeatures.map(classFeature => (
                    <ClassFeatureDropdownItem classFeature = {classFeature} key={classFeature.classFeatureID}/>
            ))}
        </select>
    );
}