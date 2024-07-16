// PROPS
// selectedClassFeature - the class feature we're editing
// change - the parent function to call when we change the variäble

export default function ClassFeatureVariableDropdown ( props )
{
    return (
        <select name="classFeatureVars" id="classFeatureVars" onChange={props.change}>
            <option value="placeholder">Choose variable</option>
            {Object.keys(props.selectedClassFeature).map( key => (
                <option key={key} value={key}> {key}</option>
            ))}
        </select>
    );
}