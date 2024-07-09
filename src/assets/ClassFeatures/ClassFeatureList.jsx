import { useEffect, useState } from "react"

export default function ClassFeatureList ( props )
{
    const [displayClassFeatures, setDisplayClassFeatures] = useState([]);
    const [finalClassFeatures, setFinalClassFeatures] = useState([]);

    // Proopagate finalClassFeatures whenever it changes
    useEffect ( () => {
        props.update(finalClassFeatures)
    }, [finalClassFeatures])

    // If props.displayClassFeatures changes, change the internal state to match it or to be an empty array.
    useEffect(() =>{
        if (Array.isArray(props.inheritedClassFeatures))
        {
            // Sort displayBuffs by level
            setDisplayClassFeatures(props.inheritedClassFeatures.sort((a, b) => a.id.level - b.id.level));
        }
        else
        {
            setDisplayClassFeatures([]);
        }
    }, [props.inheritedClassFeatures])

    // Whenever displayClassFeatures changes, set finalClassFeatures to be equal
    useEffect(() => {
        setFinalClassFeatures(displayClassFeatures);
    }, [displayClassFeatures])

    function cancelClassFeature( event )
    {
        // Separate out the classFeatureID and classFeatureLevel from the className
        const classFeatureID = event.target.className.split(" ")[0]
        const classFeatureLevel = event.target.className.split(" ")[1]

        // Get the unique classFeature corresponding to the given ID and level
        const classFeature = displayClassFeatures.filter( elem => (
            elem.id.classFeatureID == classFeatureID &&
            elem.id.level == classFeatureLevel
        ))[0];

        // If present, remove this class feature from finalClassFeatures and strike it through
        if ( finalClassFeatures.includes(classFeature) )
        {
            setFinalClassFeatures(finalClassFeatures.filter( elem => elem != classFeature));
            event.target.parentNode.className = "strike"
        }
        // Otherwise put it back
        else
        {
            setFinalClassFeatures( finalClassFeatures.concat(classFeature));
            event.target.parentNode.className = ""
        }
    }

    return (
        <table id="classFeatureList">
            <thead>
                <tr>
                    <td>Class ability</td>
                    <td>Level learned</td>
                </tr>
            </thead>
            <tbody>
            {displayClassFeatures.map(feature => (
                <tr key={feature.classFeature.classFeatureID + "" + feature.id.level} id={feature.classFeature.classFeatureID + "" + feature.id.level}>
                    <td key={feature.classFeature.classFeatureID + "" + feature.id.level + "name"}>
                        {feature.classFeature.name} 
                    </td>
                    <td key={feature.classFeature.classFeatureID + "" + feature.id.level + "level"}>
                        {feature.id.level}
                    </td>
                    <td key={feature.classFeature.classFeatureID + "" + feature.id.level + " cancel"} className={feature.classFeature.classFeatureID + " " + feature.id.level + " cancel"} onClick={cancelClassFeature}>
                        X
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}