import { useEffect, useState } from "react"
import ClassFeatureSelectorItem from "./ClassFeatureSelectorItem";
import SelectedClassFeatureItem from "./SelectedClassFeatureItem";

export default function ClassFeatureSelector( props )
{
    const [allClassFeatures, setAllClassFeatures] = useState([]);
    const [filteredClassFeatures, setFilteredClassFeatures] = useState([]);
    const [selectedClassFeatures, setSelectedClassFeatures] = useState([]);

    const [selectedClassFeatureJSONArray, setSelectedClassFeatureJSONArray] = useState([]);

    useEffect(() => {
        const url = "http://localhost:8080/classFeatures/all"

        fetch(url)
        .then(res => res.json())
        .then(data => setAllClassFeatures(data));
    }, [])

    // Add the given classFeature to selectedClassFeatures
    function selectClassFeature ( classFeature )
    {
        setSelectedClassFeatures( selectedClassFeatures.concat( classFeature ));
    }

    // Remove the classFeature at the given index
    function removeClassFeature ( index )
    {
        setSelectedClassFeatures( selectedClassFeatures.filter( (elem, i) =>  i != index) );
    }

    // Filter the classFeature list to only those which contain the text input
    // Irregardless of case
    function filterClassFeatures( event )
    {
        setFilteredClassFeatures( allClassFeatures.filter((feature) =>
            feature.name.toLowerCase().includes(event.target.value.toLowerCase())
        ));
    }

    function updateJSON ( classFeatureJSON )
    {
        // If classFeatureJSON is not in the array, ddd it
        // Otherwise remove it
        if ( !selectedClassFeatureJSONArray.includes(classFeatureJSON) ) 
        {
            setSelectedClassFeatureJSONArray( selectedClassFeatureJSONArray.concat(classFeatureJSON) );
        }
        else
        {
            setSelectedClassFeatureJSONArray( selectedClassFeatureJSONArray.filter(feature => feature != classFeatureJSON) );
        }
    }

    // When selectedClassFeatureJSONArray updates, propagate it
    useEffect(() => {
        props.update(selectedClassFeatureJSONArray);
    }, [selectedClassFeatureJSONArray])

    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        Ability
                                    </td>
                                    <td>
                                        Level
                                    </td>
                                    <td>
                                        
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedClassFeatures.map((feature, index) => (
                                    <SelectedClassFeatureItem classFeature={feature} key={feature.classFeatureID + "" + index} removeClassFeature={removeClassFeature} index={index} update={updateJSON}/>
                                ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="text" onChange={filterClassFeatures}/>
                    </td>
                </tr>
                {filteredClassFeatures.map( feature => (
                    <ClassFeatureSelectorItem classFeature={feature} key={feature.classFeatureID + "selector"} selectClassFeature={selectClassFeature}/>
                ))}
            </tbody>
        </table>
    )
}