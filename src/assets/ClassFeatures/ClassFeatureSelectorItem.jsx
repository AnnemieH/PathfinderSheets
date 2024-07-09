import { useEffect, useState } from "react"

export default function ClassFeatureSelectorItem ( props )
{
    const [classFeature, setClassFeature] = useState({});

    useEffect(() => {
        setClassFeature(props.classFeature);
    }, [props.classFeature])

    function hoverStart( event )
    {
        event.target.className += " hovering";
    }

    function hoverEnd( event )
    {
        event.target.className = "buffItem ";
    }

    function selectClassFeature( event )
    {
        props.selectClassFeature ( classFeature, true )
    }

    return (
        <tr key={classFeature.classFeatureID + "" + classFeature.Level} className={"classFeatureItem "} onMouseEnter={hoverStart} onMouseLeave={hoverEnd} onClick={selectClassFeature}>
            <td key={classFeature.classFeatureID + "" + classFeature.Level + "cell"}>
                {classFeature.name}
            </td>
        </tr>
    )
}