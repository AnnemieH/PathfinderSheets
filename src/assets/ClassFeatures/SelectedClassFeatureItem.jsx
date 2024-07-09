import { useEffect, useState } from "react";

export default function SelectedClassFeatureItem ( props )
{
    const [classFeature, setClassFeature] = useState({});
    const [classFeatureJSON, setClassFeatureJSON] = useState({});
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        setClassFeature(props.classFeature);
    }, [props.classFeature])

    function cancel (event)
    {
        props.removeClassFeature( props.index );
    }

    function lockLevel ( event )
    {
        setLocked(!locked);

        props.update(classFeatureJSON);
    }

    // If the classFeature is beïng set, disable the level field and propagate the buffJSON up
    useEffect(() => {

        document.getElementById(classFeature.classFeatureID + "levelInput" + props.index).disabled = locked;

        
    }, [locked])

    function generateJSON( event )
    {
        let tempJSON = {};
        let idJSON = {};

        idJSON.classFeatureID = classFeature.classFeatureID;
        idJSON.level = event.target.value;

        tempJSON.id = idJSON;
        tempJSON.classFeature = classFeature;

        setClassFeatureJSON(tempJSON);
    }

    return (
        <tr key={classFeature.classFeatureID + "row" + props.index}>
            <td key={classFeature.classFeatureID + "name"}>
                {classFeature.name}
            </td>
            <td key={classFeature.classFeatureID + "level" + props.index} >
                <input type="text" key={classFeature.classFeatureID + "levelInput" + props.index} id={classFeature.classFeatureID + "levelInput" + props.index} size={2} onChange={generateJSON}/>
            </td>
            <td key={classFeature.classFeatureID + "set"}>
                <button type="button" key={classFeature.classFeatureID + "setButton" + props.index} id={classFeature.classFeatureID + "setButton"} onClick={lockLevel}>Set</button>
            </td>
            <td key={classFeature.classFeatureID + "cancel" + props.index} className="cancel" onClick={cancel}>
                X
            </td>
        </tr>
    );
}